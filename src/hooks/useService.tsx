import {
  child,
  onValue,
  push,
  ref as getRef,
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
import { useAuth } from './useAuth';
import { db } from './firebaseConfig';
import {
  Category,
  Course,
  Data,
  ExtendedCategory,
  ExtendedCourse,
  ExtendedSemester,
  Grade,
  Semester,
  UID,
} from '../types';

/**
 * Grade Scale - Percentages, Letters, and Points.
 *
 * @static
 */
const GradeScale = {
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
   * Gets the index for the average.
   *
   * @param average grade average
   * @returns the index of the closest grade/gpa/percent, -1 else
   * @static
   */
  getIndex(average: string): number {
    const a = Math.floor(+average);
    let i = 0;

    if (Number.isNaN(a)) {
      return -1;
    }

    while (GradeScale.percent[i] > a && i < 13) {
      i += 1;
    }

    return i;
  },
};

/**
 * Main App Data Service.
 */
interface Service {
  /**
   * Helper to generate a unique database key
   *
   * @param children optional children path
   * @returns unique database key
   */
  key: (children?: string) => UID;
  /**
   * Check if data has loaded,
   */
  ready: boolean;
  /**
   * Grade Scale - Percentages, Letters, and Points.
   */
  gradeScale: typeof GradeScale;
  /**
   * Gets the default grade scale.
   *
   * @returns default grade scale
   */
  getDefaultScale: () => number;
  /**
   * Sets the default grade scale.
   *
   * @param scale new grade scale
   * @returns Promise that resolves on success of updated scale
   */
  setDefaultScale: (scale: number) => Promise<void>;
  /**
   * Gets the current semester.
   *
   * @returns current semester key
   */
  getSemesterKey: () => UID;
  /**
   * Sets the current semester.
   *
   * @param semesterKey new current semester key
   * @returns Promise that resolves on success of updated key
   */
  setSemesterKey: (semesterKey: UID) => Promise<void>;
  /**
   * Gets the number of semesters.
   *
   * @returns number of semesters
   */
  getNumSemesters: () => number;
  /**
   * Gets the average for a given semester, course or category.
   *
   * @param key course key OR semester key OR category key
   * @returns a string of the average to two decimal places
   */
  getAverage: (key: UID) => string;
  /**
   * Gets the letter grade for a given semester, course, or category.
   *
   * @param key course key OR semester key OR category key
   * @returns the letter grade
   */
  getGrade: (key: UID) => string;
  /**
   * Gets the gpa for a given semester, course, or category.
   *
   * @param key course key OR semester key OR category key
   * @returns a string of the gpa based on the current grade scale
   */
  getGPA: (key: UID) => string;
  /**
   * Gets the cumulative GPA.
   *
   * @returns the cGPA based on the current grade scale
   * @see https://help.acorn.utoronto.ca/blog/ufaqs/calculate-gpa/
   */
  getCGPA: () => string;
  /**
   * Gets all semesters.
   *
   * @returns Array of key value semester pairs
   */
  getSemesters: () => [UID, Semester][];
  /**
   * Gets a semester given its key.
   *
   * @param key semester key or current semester key
   * @returns semester if it exists
   */
  getSemester: (key?: UID) => ExtendedSemester | undefined;
  /**
   * Creates a new semester.
   *
   * @param name new semester name
   * @returns Promise that resolves on creation of new semester
   */
  createSemester: (name: string) => Promise<void>;
  /**
   * Edits the semester name.
   *
   * @param key semester key
   * @param name new semester name
   * @returns Promise that resolves on update semester
   */
  editSemester: (key: UID, name: string) => Promise<void>;
  /**
   * Deletes a semester, along with its courses, categories, and grades.
   *
   * @param key semester key
   * @returns Promise that resolves on delete semester
   */
  deleteSemester: (key: UID) => Promise<void>;
  /**
   * Creates a new course and its categories for the current semester.
   *
   * @param course course object w/o semesterKey
   * @param categories array of categories w/o courseKey
   * @returns Promise that resolves on creation of new course, rejects if no semesters exist
   */
  createCourse: (
    course: Omit<Course, 'semesterKey' | 'numCatagories'>,
    categories: (Omit<Category, 'courseKey' | 'numGrades'> & {
      id: UID;
    })[]
  ) => Promise<void>;
  /**
   * Edits a course and optionally its categories.
   *
   * @param key course id
   * @param course course object
   * @param categories optional array to update categories
   * @returns Promise that resolves on edit of course
   */
  editCourse: (
    key: UID,
    course: Omit<Course, 'semesterKey' | 'numCatagories'>,
    categories?: (Omit<Category, 'courseKey' | 'numGrades'> & {
      id: UID;
    })[]
  ) => Promise<void>;
  /**
   * Gets all courses for a given semester.
   *
   * @param key semester key
   * @returns Array of key value semester pairs
   */
  getCourses: (key: UID) => [UID, Course][];
  /**
   * Gets a course given id.
   *
   * @param key course key
   * @returns An extended course object with categories and grades
   */
  getCourse: (key: UID) => ExtendedCourse | undefined;
  /**
   * Deletes a course, along with its categories and grades.
   *
   * @param key course key
   * @returns Promise that resolves on delete course
   */
  deleteCourse: (key: UID) => Promise<void>;
  /**
   * Gets all categories for a given course.
   *
   * @param key course key
   * @returns Array of key value category pairs
   */
  getCategories: (key: UID) => [UID, Category][];
  /**
   * Gets all grades for a given category.
   *
   * @param key category key
   * @returns Array of key value grade pairs
   */
  getGrades: (key: UID) => [UID, Grade][];
  /**
   * Creates a new grade.
   *
   * @param grade grade
   * @returns Promise that resolves on creation of new grade, rejects if the category doesn't exist
   */
  createGrade: (grade: Grade) => Promise<void>;
  /**
   * Edits a grade.
   *
   * @param key grade key
   * @param grade grade object
   * @returns Promise that resolves on edit grade
   */
  editGrade: (key: UID, grade: Grade) => Promise<void>;
  /**
   * Deletes a grade.
   *
   * @param key grade key
   * @returns Promise that resolves on delete grade, rejects if cannot delete
   */
  deleteGrade: (key: UID) => Promise<void>;
}

/**
 * Default data used to init a new user.
 *
 * @static
 */
const DefaultData: Data = {
  defaultScale: GradeScale.default,
  currentSemesterKey: '',
  numberOfSemesters: 0,
};

const DataContext = createContext(null as unknown as Service);

export const useService = (): Service => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useAuth();

  /** App data global state. */
  const [data, setData] = useState(null as unknown as Data);

  /**
   * Database root reference.
   *
   * @private
   */
  const _ref = useMemo(() => getRef(db, `/users/${user?.uid}`), [user]);

  /**
   * Helper to get database reference.
   *
   * @param children optional children path
   * @private
   */
  function ref(children?: string) {
    return children ? child(_ref, children) : _ref;
  }

  function key(children?: string) {
    return push(ref(children)).key as UID;
  }

  useEffect(() => {
    if (user) {
      /**
       * Local Data sync loop.
       *
       * Local store is never mutated on its own,
       * instead the db is straight updated, then local store
       * gets fetched and synced.
       *
       * @see https://firebase.google.com/docs/database/web/structure-data
       */
      const subscriber = onValue(_ref, async (snapshot) => {
        const data: Data = snapshot.val();
        if (data) {
          setData(data);
        } else {
          /** Initialize new user */
          await runTransaction(_ref, (d?: Data) =>
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

  function getDefaultScale() {
    return data.defaultScale;
  }

  function setDefaultScale(scale: number) {
    return set(ref('defaultScale'), scale).catch(console.error);
  }

  function getSemesterKey() {
    return data.currentSemesterKey;
  }

  function setSemesterKey(semesterKey: UID) {
    return set(ref('currentSemesterKey'), semesterKey).catch(console.error);
  }

  function getNumSemesters() {
    return data.numberOfSemesters;
  }

  /**
   * Gets all semesters.
   *
   * @returns Array of key value semester pairs
   * @private
   */
  const _semesters = useMemo<[UID, Semester][]>(
    () => Object.entries(data?.semesters ?? {}),
    [data]
  );

  /**
   * Gets all courses.
   *
   * @returns Array of key value course pairs
   * @private
   */
  const _courses = useMemo<[UID, Course][]>(
    () => Object.entries(data?.courses ?? {}),
    [data]
  );

  /**
   * Gets all categories.
   *
   * @returns Array of key value category pairs
   * @private
   */
  const _categories = useMemo<[UID, Category][]>(
    () => Object.entries(data?.catagories ?? {}),
    [data]
  );

  /**
   * Gets all grades.
   *
   * @returns Array of key value grade pairs
   * @private
   */
  const _grades = useMemo<[UID, Grade][]>(
    () => Object.entries(data?.grades ?? {}),
    [data]
  );

  /**
   * Gets all averages.
   *
   * @returns a shallow object that contains the percent averages for
   *          all semesters, courses and categories
   * @private
   */
  const _averages = useMemo<Record<UID, number>>(() => {
    /**
     * Map (shallow/flat) to store all averages.
     *
     * @key semester key OR category key OR course key
     * @value the average of the key
     */
    const averages: Record<UID, number> = {};

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
    const ignored: Record<UID, number> = {};

    _grades.forEach(([, { catagoryKey: categoryKey, percent, isIncluded }]) => {
      if (!isIncluded) {
        ignored[categoryKey] = (ignored[categoryKey] ?? 0) + 1;
        return;
      }

      averages[categoryKey] = (averages[categoryKey] ?? 0) + percent;
    });

    _categories.forEach(([categoryKey, { courseKey, weight, numGrades }]) => {
      if (!numGrades || !averages[categoryKey]) {
        ignored[courseKey] = (ignored[courseKey] ?? 100) - weight;
        return;
      }

      averages[categoryKey] /= numGrades - (ignored[categoryKey] ?? 0);

      averages[courseKey] =
        (averages[courseKey] ?? 0) + averages[categoryKey] * weight;
    });

    _courses.forEach(
      ([
        courseKey,
        { semesterKey, passFail, numCatagories: numCategories },
      ]) => {
        if (!numCategories || !averages[courseKey]) {
          return;
        }

        // Ignored weight is used when course is not fully completed.
        // i.e. if the final is 35%, then the grade before the final is only 65% of the total.
        averages[courseKey] /= ignored[courseKey] ?? 100;

        // Pass/Fail or CR/NCR courses are not included in the semester calculation
        if (passFail) {
          ignored[semesterKey] = (ignored[semesterKey] ?? 0) + 1;
        }

        averages[semesterKey] =
          (averages[semesterKey] ?? 0) + averages[courseKey];
      }
    );

    // Loop through each semester and
    // divide by the correct number of courses (ignores Pass/Fail).
    _semesters.forEach(([semesterKey, { numCourses }]) => {
      if (!numCourses || !averages[semesterKey]) {
        return;
      }

      const total = numCourses - (ignored[semesterKey] ?? 0);
      averages[semesterKey] = !total ? NaN : averages[semesterKey] / total;
    });

    return averages;
  }, [_grades, _categories, _courses, _semesters]);

  function getAverage(key: UID) {
    const average: number | undefined = _averages[key];
    return average ? average.toFixed(2) : 'N/A';
  }

  function getGrade(key: UID) {
    const index = GradeScale.getIndex(getAverage(key));
    return index === -1 ? 'N/A' : GradeScale.letter[index];
  }

  function getGPA(key: UID) {
    // Semester GPA is computed based on the average GPAs of the courses.
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
  function _getSemesterGPA(key: UID) {
    // Semester GPA sum
    let gpa = 0;
    // Number of "Pass/Fail" OR "no average" courses
    let ignored = 0;

    const semester = getSemester(key);
    if (!semester) {
      return undefined;
    }

    // The computation doesn't really need to be memoized
    // since the course gpa calculation is already memoized.
    semester.courses.forEach(([courseKey, { passFail }]) => {
      if (passFail) {
        ignored += 1;
        return;
      }

      const courseGPA = getGPA(courseKey);
      if (courseGPA === 'N/A') {
        ignored += 1;
        return;
      }

      gpa += +courseGPA;
    });

    const totalCourses = semester.numCourses - ignored;
    return !totalCourses ? undefined : [gpa / totalCourses, totalCourses];
  }

  function getCGPA() {
    if (!getNumSemesters()) {
      return 'N/A';
    }

    const semesterGPAs: [number, number][] = getSemesters()
      .map(([semesterKey]) => _getSemesterGPA(semesterKey))
      .filter((s) => !!s) as [number, number][];

    // Assumption: each course is 0.5 CR
    const cumulativeSum = semesterGPAs.reduce(
      (sum, [semesterGPA, numCourses]) => sum + semesterGPA * numCourses,
      0
    );

    const totalCourses = semesterGPAs.reduce(
      (sum, [, numCourses]) => sum + numCourses,
      0
    );

    const cgpa = cumulativeSum / totalCourses;
    return Number.isNaN(cgpa) ? 'N/A' : cgpa.toFixed(2);
  }

  function getSemesters() {
    return _semesters;
  }

  function getSemester(key?: UID) {
    const semester = data.semesters?.[key || getSemesterKey()];

    if (!semester) {
      return undefined;
    }

    const courses = getCourses(key || getSemesterKey()).sort(
      ([, { name: a }], [, { name: b }]) => (a < b ? -1 : 1)
    );

    return { ...semester, courses } as ExtendedSemester;
  }

  function createSemester(name: string) {
    const currentSemesterKey = key(`semesters`);
    const updates = {
      currentSemesterKey,
      numberOfSemesters: getNumSemesters() + 1,
      [`/semesters/${currentSemesterKey}`]: {
        name,
        numCourses: 0,
      },
    };
    return update(ref(), updates).catch(console.error);
  }

  function editSemester(key: UID, name: string) {
    return set(ref(`semesters/${key}/name`), name).catch(console.error);
  }

  function deleteSemester(key: UID) {
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
    updates.currentSemesterKey = rest.length > 0 ? rest[rest.length - 1] : '';

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

    return update(ref(), updates).catch(console.error);
  }

  function createCourse(
    course: Omit<Course, 'semesterKey' | 'numCatagories'>,
    categories: (Omit<Category, 'courseKey' | 'numGrades'> & {
      id: UID;
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
    const updates: Record<string, Course | Category | number> = {
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

    return update(ref(), updates).catch(console.error);
  }

  function editCourse(
    key: UID,
    course: Omit<Course, 'semesterKey' | 'numCatagories'>,
    categories?: (Omit<Category, 'courseKey' | 'numGrades'> & {
      id: UID;
    })[]
  ) {
    const updates: Record<string, string | boolean | number | null> = {
      [`courses/${key}/name`]: course.name,
      [`courses/${key}/instructor`]: course.instructor,
      [`courses/${key}/passFail`]: course.passFail,
    };

    if (categories && categories.length > 0) {
      // update new number of categories
      updates[`courses/${key}/numCatagories`] = categories.length;

      // Array of modified/new category IDs
      let curr: UID[] = [];

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

    return update(ref(), updates).catch(console.error);
  }

  function getCourses(key: UID) {
    return _courses.filter(([, { semesterKey }]) => semesterKey === key);
  }

  function getCourse(key: UID) {
    const course = data.courses?.[key];

    if (!course) {
      return undefined;
    }

    const categories = getCategories(key)
      .map<[UID, ExtendedCategory]>(([categoryKey, category]) => [
        categoryKey,
        { ...category, grades: getGrades(categoryKey) },
      ])
      .sort(([, { name: a }], [, { name: b }]) => (a < b ? -1 : 1));

    return {
      ...course,
      categories,
    } as ExtendedCourse;
  }

  function deleteCourse(key: UID) {
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

    return update(ref(), updates).catch(console.error);
  }

  function getCategories(key: UID) {
    return _categories.filter(([, { courseKey }]) => courseKey === key);
  }

  function getGrades(key: UID) {
    return _grades.filter(([, { catagoryKey }]) => catagoryKey === key);
  }

  function createGrade(grade: Grade) {
    const category = data.catagories?.[grade.catagoryKey];

    if (!category) {
      return Promise.reject(new Error('Cannot create grade without category.'));
    }

    const gradeKey = key('grades');
    const updates = {
      [`catagories/${grade.catagoryKey}/numGrades`]: category.numGrades + 1,
      [`grades/${gradeKey}`]: grade,
    };

    return update(ref(), updates).catch(console.error);
  }

  function editGrade(key: UID, grade: Grade) {
    return set(ref(`grades/${key}`), grade).catch(console.error);
  }

  function deleteGrade(key: UID) {
    const grade = data.grades?.[key];
    const category = data.catagories?.[grade?.catagoryKey || ''];

    if (!grade || !category) {
      return Promise.reject(
        new Error('Cannot delete grade, grade or category not found.')
      );
    }

    const updates = {
      [`catagories/${grade.catagoryKey}/numGrades`]: category.numGrades - 1,
      [`grades/${key}`]: null,
    };

    return update(ref(), updates).catch(console.error);
  }

  const service = {
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
