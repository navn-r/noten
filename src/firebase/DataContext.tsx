import {
  child,
  onValue,
  push,
  ref as getRef,
  Reference,
  runTransaction,
  set,
  update,
} from 'firebase/database';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { db } from './Config';

/**
 * Grade Scale - Percentages, Letters, and Points.
 * @static
 */
const GradeScale: Noten.IGradeScale = {
  default: 2,
  // prettier-ignore
  letter: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
  percent: [90, 85, 80, 77, 73, 70, 67, 63, 60, 57, 53, 50, 0],
  scales: [
    {
      title: '5 Point',
      scale: [5.0, 5.0, 4.7, 4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 0.0],
    },
    {
      title: '4.3 Point',
      scale: [
        4.33, 4.0, 3.67, 3.33, 3.0, 2.67, 2.33, 2.0, 1.67, 1.33, 1.0, 0.67, 0.0,
      ],
    },
    {
      title: '4 Point',
      scale: [4.0, 3.9, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0],
    },
    {
      title: '4 Point Alt.',
      scale: [4.0, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0],
    },
  ],
  /**
   * Gets the index for the average
   * @param average grade average
   * @returns the index of the closest grade/gpa/percent, -1 else
   * @static
   */
  getIndex(average: string): number {
    const a = Math.floor(+average);

    if (Number.isNaN(a)) {
      return -1;
    }

    return GradeScale.percent.indexOf(
      GradeScale.percent.reduce((p, c) =>
        Math.abs(c - a) < Math.abs(p - a) ? c : p
      )
    );
  },
};

/**
 * Default data used to init a new user.
 * @static
 */
const DefaultData: Noten.IData = {
  defaultScale: GradeScale.default,
  currentSemesterKey: '',
  numberOfSemesters: 0,
};

export const useService = (): Noten.IService => useContext(DataContext);

const DataContext = createContext<Noten.IService>(
  null as unknown as Noten.IService
);

export const DataProvider: React.FC = ({ children }) => {
  const { user } = useAuth();

  /** App data global state. */
  const [data, setData] = useState<Noten.IData>(null as unknown as Noten.IData);

  /**
   * Database root reference
   * @private
   */
  const _ref = useMemo(() => getRef(db, `/users/${user?.uid}`), [user]);

  /**
   * Helper to get database reference.
   * @param children optional children path
   * @private
   */
  function ref(children?: string): Reference {
    return children ? child(_ref, children) : _ref;
  }

  /**
   * Helper to generate a unique database key
   * @param children optional children path
   * @returns unique database key
   */
  function key(children?: string): Noten.UID {
    return push(ref(children)).key as Noten.UID;
  }

  /**
   * Local Data sync loop.
   *
   * Local store is never mutated on its own,
   * instead the db is straight updated, then local store
   * gets fetched and synced.
   *
   * @see https://firebase.google.com/docs/database/web/structure-data
   */
  useEffect(() => {
    if (user) {
      /** Connect to database */
      const subscriber = onValue(_ref, async (snapshot) => {
        const data: Noten.IData = snapshot.val();
        if (data) {
          setData(data);
        } else {
          /** Initialize new user */
          await runTransaction(_ref, (d?: Noten.IData) =>
            // Double check user has no stored data and only init if none found.
            // Not checking could be be DANGEROUS AF.
            !d ? DefaultData : undefined
          );
        }
      });
      /** Disconnect on unMount */
      return () => subscriber();
    }

    // Fix stupid eslint complaining
    return () => 0;
  }, [user, _ref]);

  /**
   * Gets the default grade scale.
   * @returns default grade scale
   */
  function getDefaultScale(): number {
    return data.defaultScale;
  }

  /**
   * Sets the default grade scale.
   * @param scale new grade scale
   * @returns Promise that resolves on success of updated scale
   */
  function setDefaultScale(scale: number): Promise<void> {
    return set(ref('defaultScale'), scale);
  }

  /**
   * Gets the current semester.
   * @returns current semester key
   */
  function getSemesterKey(): Noten.UID {
    return data.currentSemesterKey;
  }

  /**
   * Sets the current semester.
   * @param semesterKey new current semester key
   * @returns Promise that resolves on success of updated key
   */
  function setSemesterKey(semesterKey: Noten.UID): Promise<void> {
    return set(ref('currentSemesterKey'), semesterKey);
  }

  /**
   * Gets the number of semesters.
   * @returns number of semesters
   */
  function getNumSemesters(): number {
    return data.numberOfSemesters;
  }

  /**
   * Gets all semesters.
   * @returns Array of key value semester pairs
   * @private
   */
  const _semesters = useMemo<[Noten.UID, Noten.ISemester][]>(
    () => Object.entries(data?.semesters ?? {}),
    [data]
  );

  /**
   * Gets all courses.
   * @returns Array of key value course pairs
   * @private
   */
  const _courses = useMemo<[Noten.UID, Noten.ICourse][]>(
    () => Object.entries(data?.courses ?? {}),
    [data]
  );

  /**
   * Gets all categories.
   * @returns Array of key value category pairs
   * @private
   */
  const _categories = useMemo<[Noten.UID, Noten.ICategory][]>(
    () => Object.entries(data?.catagories ?? {}),
    [data]
  );

  /**
   * Gets all grades.
   * @returns Array of key value grade pairs
   * @private
   */
  const _grades = useMemo<[Noten.UID, Noten.IGrade][]>(
    () => Object.entries(data?.grades ?? {}),
    [data]
  );

  /**
   * Gets all averages.
   * @returns a shallow object that contains the percent averages for
   *          all semesters, courses and categories
   * @private
   */
  const _averages = useMemo<Record<Noten.UID, number>>(() => {
    /**
     * Map (shallow/flat) to store all averages.
     *
     * @key semester key OR category key OR course key
     * @value the average of the key
     */
    const a: Record<Noten.UID, number> = {};

    /**
     * Intermediate Map (shallow/flat) to store number of
     * ignored grades for any given category.
     *
     * OR if it's a course key, the total weight of its categories,
     * ignoring categories without grades.
     *
     * OR if it's a semester key, the number of
     * ignored courses (Pass/Fail) for the given semester.
     *
     * @key category key OR course Key OR semester key
     * @value the number of ignored grades,
     *        OR total weight of categories,
     *        OR number of ignored courses
     */
    const ig: Record<Noten.UID, number> = {};

    // First store only the sums of the grade percentages
    // in the category.
    _grades.forEach(([, g]) => {
      const { catagoryKey: p, percent: v, isIncluded: i } = g;
      // If the grade is ignored, add it to the ignored map.
      if (!i) {
        ig[p] = (ig[p] ?? 0) + 1;
        return;
      }

      // Sum the percents for the category.
      // Safe to assume that the category exists.
      a[p] = (a[p] ?? 0) + v;
    });

    // Loop through each category and
    // apply the correct weight to the existing sum.
    _categories.forEach(([k, c]) => {
      const { courseKey: p, weight: w, numGrades: n } = c;

      // Skip if there are no grades, or the category is not in the average map.
      // Then remove its weight from the total (100%)
      if (!n || !a[k]) {
        ig[p] = (ig[p] ?? 100) - w;
        return;
      }

      // Divide by the number of included grades.
      // The category is guaranteed to be in the average map.
      a[k] /= n - (ig[k] ?? 0);

      // Set the course average by summing the category with its given weight.
      // The sum of the weights are not guaranteed to be 100%.
      a[p] = (a[p] ?? 0) + a[k] * w;
    });

    // Loop through each course and
    // apply the correct total weight to the existing sum
    _courses.forEach(([k, c]) => {
      const { semesterKey: p, passFail: i, numCatagories: n } = c;

      // Skip if there are no categories,
      // or the course is not in the average map.
      if (!n || !a[k]) {
        return;
      }

      // Divide by the correct weight.
      // Factors in the previous weight adjustment,
      // when no grades are in the category.
      a[k] /= ig[k] ?? 100;

      // If the course is marked as Pass/Fail (CR/nCR),
      // Add it to the ignored list
      if (i) {
        ig[p] = (ig[p] ?? 0) + 1;
      }

      // Set the semester average by summing the course averages
      // Don't skip if it's Pass/Fail, just so the semester will be guaranteed
      // to be in the average map.
      a[p] = (a[p] ?? 0) + (i ? 0 : a[k]);
    });

    // Loop through each semester and
    // divide by the correct number of courses (ignores Pass/Fail).
    _semesters.forEach(([k, s]) => {
      const { numCourses: n } = s;

      // Skip if there are no courses,
      // or the semester is not in the average map.
      if (!n || !a[k]) {
        return;
      }

      // Divide by the number of non-Pass/Fail courses.
      // Division by 0 when all courses are Pass/Fail.
      const num = n - (ig[k] ?? 0);
      a[k] = !num ? NaN : a[k] / num;
    });

    return a;
  }, [_grades, _categories, _courses, _semesters]);

  /**
   * Gets the average for a given semester, course or category.
   * @param key course key OR semester key OR category key
   * @returns a string of the average to two decimal places
   */
  function getAverage(key: Noten.UID): string {
    const average: number | undefined = _averages[key];
    return average ? average.toFixed(2) : 'N/A';
  }

  /**
   * Gets the letter grade for a given semester, course, or category
   * @param key course key OR semester key OR category key
   * @returns the letter grade
   */
  function getGrade(key: Noten.UID): string {
    const index = GradeScale.getIndex(getAverage(key));
    return index === -1 ? 'N/A' : GradeScale.letter[index];
  }

  /**
   * Gets the gpa for a given semester, course, or category
   * @param key course key OR semester key OR category key
   * @returns a string of the gpa based on the current grade scale
   */
  function getGPA(key: Noten.UID): string {
    // Semesters are treated differently.
    // It's gpa is computed based on the average GPAs of the courses.
    if (key in (data.semesters ?? {})) {
      const [gpa] = _getSemesterGPA(key) ?? [];
      return !gpa ? 'N/A' : gpa.toFixed(2);
    }

    const index = GradeScale.getIndex(getAverage(key));
    return index === -1
      ? 'N/A'
      : GradeScale.scales[getDefaultScale()].scale[index].toFixed(2);
  }

  /**
   * Gets the GPA for a given semester.
   *
   * Computed based on the average GPAs of the courses,
   * and NOT the gpa based on the semester average.
   *
   * @param key semester key
   * @returns a pair [semester gpa, number of courses calculated]
   *          or undefined if semester does not exist
   * @see https://help.acorn.utoronto.ca/blog/ufaqs/calculate-gpa/
   * @private
   */
  function _getSemesterGPA(key: Noten.UID): [number, number] | undefined {
    // Semester GPA sum
    let gpa = 0;
    // Number of ignored courses (Pass/Fail OR no average)
    let ig = 0;

    const semester = getSemester(key);
    if (!semester) {
      return undefined;
    }

    // The computation doesn't really need to be memoized
    // since the course gpa calculation is already memoized.
    semester.courses.forEach(([k, c]) => {
      const { passFail: i } = c;
      if (i) {
        ig += 1;
        return;
      }

      const courseGPA = getGPA(k);
      if (courseGPA === 'N/A') {
        ig += 1;
        return;
      }

      gpa += +courseGPA;
    });

    const num = semester.numCourses - ig;
    return !num ? undefined : [gpa / num, num];
  }

  /**
   * Gets the cumulative GPA.
   * @returns the cGPA based on the current grade scale
   * @see https://help.acorn.utoronto.ca/blog/ufaqs/calculate-gpa/
   */
  function getCGPA(): string {
    const n = getNumSemesters();
    if (!n) {
      return 'N/A';
    }

    // Gets all the gpas for each semester.
    const gpa: [number, number][] = getSemesters()
      .map(([k]) => _getSemesterGPA(k))
      .filter((a) => !!a) as [number, number][];

    // Assuming that each course is 0.5 credits or 1 semester only.
    const sum = gpa.map(([g, c]) => g * c).reduce((p, c) => p + c, 0);
    const num = gpa.map(([, c]) => c).reduce((p, c) => p + c, 0);

    const cgpa = sum / num;
    return Number.isNaN(cgpa) ? 'N/A' : cgpa.toFixed(2);
  }

  /**
   * Gets all semesters.
   * @returns Array of key value semester pairs
   */
  function getSemesters(): [Noten.UID, Noten.ISemester][] {
    return _semesters;
  }

  /**
   * Gets a semester given its key
   * @param key semester key
   * @returns semester if it exists
   */
  function getSemester(key?: Noten.UID): Noten.IExtendedSemester | undefined {
    const semester = data.semesters?.[key || getSemesterKey()];

    if (!semester) {
      return undefined;
    }

    const courses = getCourses(key || getSemesterKey());

    return { ...semester, courses };
  }

  /**
   * Creates a new semester.
   * @param name new semester name
   * @returns Promise that resolves on creation of new semester
   */
  function createSemester(name: string): Promise<void> {
    const currentSemesterKey: Noten.UID = key(`semesters`);
    const updates = {
      currentSemesterKey,
      numberOfSemesters: getNumSemesters() + 1,
      [`/semesters/${currentSemesterKey}`]: {
        name,
        numCourses: 0,
      },
    };
    return update(ref(), updates);
  }

  /**
   * Edits the semester name.
   * @param key semester key
   * @param name new semester name
   * @returns Promise that resolves on update semester
   */
  function editSemester(key: Noten.UID, name: string): Promise<void> {
    return set(ref(`semesters/${key}/name`), name);
  }

  /**
   * Deletes a semester, along with its courses, categories, and grades
   * @param key semester key
   * @returns Promise that resolves on delete semester
   */
  function deleteSemester(key: Noten.UID): Promise<void> {
    const semester = data.semesters?.[key];

    if (!semester) {
      return Promise.reject(new Error('Cannot delete semester.'));
    }

    const updates: Record<string, number | null | string> = {
      numberOfSemesters: getNumSemesters() - 1,
      [`semesters/${key}`]: null,
    };

    // Filter the rest of the semesters
    // and pick on to use once this is deleted.
    const rest = getSemesters()
      .map(([k]) => k)
      .filter((k) => k !== key);
    updates.currentSemesterKey = rest.length > 0 ? rest[0] : '';

    getCourses(key).forEach(([courseKey]) => {
      // delete course
      updates[`courses/${courseKey}`] = null;
      getCategories(courseKey).forEach(([categoryKey]) => {
        // delete category
        updates[`catagories/${categoryKey}`] = null;
        getGrades(categoryKey).forEach(([gradeKey]) => {
          // delete grade
          updates[`grades/${gradeKey}`] = null;
        });
      });
    });

    return update(ref(), updates);
  }

  /**
   * Creates a new course and its categories for the current semester.
   * @param course course object w/o semesterKey
   * @param categories array of categories w/o courseKey
   * @returns Promise that resolves on creation of new course, rejects if no semesters exist
   */
  function createCourse(
    course: Omit<Noten.ICourse, 'semesterKey' | 'numCatagories'>,
    categories: (Omit<Noten.ICategory, 'courseKey' | 'numGrades'> & {
      id: Noten.UID;
    })[]
  ): Promise<void> {
    // Verify semester exists
    const semesterKey = getSemesterKey();
    const semester = data.semesters?.[semesterKey];

    if (!semester) {
      return Promise.reject(
        new Error('Cannot create a course without a semester')
      );
    }

    // Create key and updates object
    const courseKey = key('courses');
    const updates: Record<string, Noten.ICourse | Noten.ICategory | number> = {
      [`courses/${courseKey}`]: {
        ...course,
        numCatagories: categories.length,
        semesterKey,
      },
      [`semesters/${semesterKey}/numCourses`]: semester.numCourses + 1,
    };

    // Create categories
    categories.forEach((category) => {
      updates[`catagories/${category.id}`] = {
        ...category,
        numGrades: 0,
        courseKey,
      };
    });

    return update(ref(), updates);
  }

  /**
   * Edits a course and optionally its categories.
   * @param key course id
   * @param course course object
   * @param categories optional array to update categories
   * @returns Promise that resolves on edit of course
   */
  function editCourse(
    key: Noten.UID,
    course: Omit<Noten.ICourse, 'semesterKey' | 'numCatagories'>,
    categories?: (Omit<Noten.ICategory, 'courseKey' | 'numGrades'> & {
      id: Noten.UID;
    })[]
  ): Promise<void> {
    const updates: Record<string, string | boolean | number | null> = {
      [`courses/${key}/name`]: course.name,
      [`courses/${key}/instructor`]: course.instructor,
      [`courses/${key}/passFail`]: course.passFail,
    };

    if (categories && categories.length > 0) {
      // update new number of categories
      updates[`courses/${key}/numCatagories`] = categories.length;

      // Array of modified/new category IDs
      let curr: Noten.UID[] = [];

      // Existing category ids
      const prev = getCategories(key).map(([k]) => k);

      categories.forEach((c) => {
        // avoid looping twice just to get ids
        curr = curr.concat(c.id);

        updates[`catagories/${c.id}/name`] = c.name;
        updates[`catagories/${c.id}/weight`] = c.weight;

        // Indicates new category
        if (!prev.includes(c.id)) {
          updates[`catagories/${c.id}/numGrades`] = 0;
          updates[`catagories/${c.id}/courseKey`] = key;
        }
      });

      // Array of deleted category IDs
      const deleted = prev.filter((k) => !curr.includes(k));

      deleted.forEach((categoryKey) => {
        // delete category
        updates[`catagories/${categoryKey}`] = null;
        getGrades(categoryKey).forEach(([gradeKey]) => {
          // delete grade
          updates[`grades/${gradeKey}`] = null;
        });
      });
    }

    return update(ref(), updates);
  }

  /**
   * Gets all courses for a given semester.
   * @param key semester key
   * @returns Array of key value semester pairs
   */
  function getCourses(key: Noten.UID): [Noten.UID, Noten.ICourse][] {
    return _courses.filter(([, { semesterKey }]) => semesterKey === key);
  }

  /**
   * Gets a course given id
   * @param key course key
   * @returns An extended course object with categories and grades
   */
  function getCourse(key: Noten.UID): Noten.IExtendedCourse | undefined {
    const course = data.courses?.[key];

    if (!course) {
      return undefined;
    }

    const categories = getCategories(key).map<
      [Noten.UID, Noten.IExtendedCategory]
    >(([categoryKey, category]) => [
      categoryKey,
      { ...category, grades: getGrades(categoryKey) },
    ]);

    return {
      ...course,
      categories,
    };
  }

  /**
   * Deletes a course, along with its categories and grades
   * @param key course key
   * @returns Promise that resolves on delete course
   */
  function deleteCourse(key: Noten.UID): Promise<void> {
    const course = data.courses?.[key];
    const semester = data.semesters?.[course?.semesterKey ?? ''];

    if (!course || !semester) {
      return Promise.reject(new Error('Cannot delete course.'));
    }

    const updates = {
      [`semesters/${course.semesterKey}/numCourses`]: semester.numCourses - 1,
      [`courses/${key}`]: null,
    };

    getCategories(key).forEach(([categoryKey]) => {
      // delete category
      updates[`catagories/${categoryKey}`] = null;
      getGrades(categoryKey).forEach(([gradeKey]) => {
        // delete grade
        updates[`grades/${gradeKey}`] = null;
      });
    });

    return update(ref(), updates);
  }

  /**
   * Gets all categories for a given course.
   * @param key course key
   * @returns Array of key value category pairs
   */
  function getCategories(key: Noten.UID): [Noten.UID, Noten.ICategory][] {
    return _categories.filter(([, { courseKey }]) => courseKey === key);
  }

  /**
   * Gets all grades for a given category.
   * @param key category key
   * @returns Array of key value grade pairs
   */
  function getGrades(key: Noten.UID): [Noten.UID, Noten.IGrade][] {
    return _grades.filter(([, { catagoryKey }]) => catagoryKey === key);
  }

  /**
   * Creates a new grade.
   * @param grade grade
   * @returns Promise that resolves on creation of new grade, rejects if the category doesn't exist
   */
  function createGrade(grade: Noten.IGrade): Promise<void> {
    const category: Noten.ICategory | undefined =
      data.catagories?.[grade.catagoryKey];

    if (!category) {
      return Promise.reject(new Error('Cannot create grade without category.'));
    }

    const gradeKey = key('grades');
    const updates = {
      [`catagories/${grade.catagoryKey}/numGrades`]: category.numGrades + 1,
      [`grades/${gradeKey}`]: grade,
    };

    return update(ref(), updates);
  }

  /**
   * Edits a grade.
   * @param key grade key
   * @param grade grade object
   * @returns Promise that resolves on edit grade
   */
  function editGrade(key: Noten.UID, grade: Noten.IGrade): Promise<void> {
    return set(ref(`grades/${key}`), grade);
  }

  /**
   * Deletes a grade.
   * @param key grade key
   * @returns Promise that resolves on delete grade, rejects if cannot delete
   */
  function deleteGrade(key: Noten.UID): Promise<void> {
    const grade: Noten.IGrade | undefined = data.grades?.[key];
    const category: Noten.ICategory | undefined =
      data.catagories?.[grade?.catagoryKey || ''];

    if (!grade || !category) {
      return Promise.reject(
        new Error('Cannot delete grade, grade or category not found.')
      );
    }

    const updates = {
      [`catagories/${grade.catagoryKey}/numGrades`]: category.numGrades - 1,
      [`grades/${key}`]: null,
    };

    return update(ref(), updates);
  }

  const service: Noten.IService = {
    key,
    ready: !!data,
    gradeScale: GradeScale,
    getDefaultScale,
    setDefaultScale,
    getSemesterKey,
    setSemesterKey,
    getNumSemesters,
    getAverage,
    getGrade,
    getGPA,
    getCGPA,
    getSemesters,
    getSemester,
    createSemester,
    editSemester,
    deleteSemester,
    createCourse,
    editCourse,
    getCourses,
    getCourse,
    deleteCourse,
    getCategories,
    getGrades,
    deleteGrade,
    createGrade,
    editGrade,
  };

  return (
    <DataContext.Provider value={service}>{children}</DataContext.Provider>
  );
};
