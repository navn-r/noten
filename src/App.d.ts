declare namespace Noten {
  /**
   * Alias for Firebase Realtime Database and Authentication IDs.
   *
   * UIDs include time information within them for Realtime,
   * So if sorted alphanumerically, its sorted by time.
   *
   * @see https://firebase.google.com/docs/database
   */
  export type UID = string;

  /**
   * Main App Authentication Interface.
   *
   * @template T Generic user info interface
   * @see https://firebase.google.com/docs/reference/js/v9/auth.userinfo.md
   */
  export interface IAuth<T> {
    /**
     * Authenticated user's basic info.
     * Includes the Firebase UID used to fetch the user data.
     */
    user: T | null;
    /**
     * Check if user is authenticated/logged-in.
     */
    authenticated: boolean;
    /**
     * Check if user auth data is loading.
     */
    loading: boolean;
    /**
     * Logs the user in with Google.
     *
     * @returns Promise that resolves on successful login
     */
    login: () => Promise<void>;
    /**
     * Logs the user out.
     *
     * @returns Promise that resolves on successful logout
     */
    logout: () => Promise<void>;
  }

  /**
   * Main App Data Service.
   */
  export interface IService {
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
    gradeScale: IGradeScale;
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
    getSemesters: () => [UID, ISemester][];
    /**
     * Gets a semester given its key.
     *
     * @param key semester key or current semester key
     * @returns semester if it exists
     */
    getSemester: (key?: UID) => IExtendedSemester | undefined;
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
      course: Omit<ICourse, 'semesterKey' | 'numCatagories'>,
      categories: (Omit<ICategory, 'courseKey' | 'numGrades'> & {
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
      course: Omit<ICourse, 'semesterKey' | 'numCatagories'>,
      categories?: (Omit<ICategory, 'courseKey' | 'numGrades'> & {
        id: UID;
      })[]
    ) => Promise<void>;
    /**
     * Gets all courses for a given semester.
     *
     * @param key semester key
     * @returns Array of key value semester pairs
     */
    getCourses: (key: UID) => [UID, ICourse][];
    /**
     * Gets a course given id.
     *
     * @param key course key
     * @returns An extended course object with categories and grades
     */
    getCourse: (key: UID) => IExtendedCourse | undefined;
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
    getCategories: (key: UID) => [UID, ICategory][];
    /**
     * Gets all grades for a given category.
     *
     * @param key category key
     * @returns Array of key value grade pairs
     */
    getGrades: (key: UID) => [UID, IGrade][];
    /**
     * Creates a new grade.
     *
     * @param grade grade
     * @returns Promise that resolves on creation of new grade, rejects if the category doesn't exist
     */
    createGrade: (grade: IGrade) => Promise<void>;
    /**
     * Edits a grade.
     *
     * @param key grade key
     * @param grade grade object
     * @returns Promise that resolves on edit grade
     */
    editGrade: (key: UID, grade: IGrade) => Promise<void>;
    /**
     * Deletes a grade.
     *
     * @param key grade key
     * @returns Promise that resolves on delete grade, rejects if cannot delete
     */
    deleteGrade: (key: UID) => Promise<void>;
  }

  /**
   * Main App Data.
   *
   * Includes the number of children (semesters).
   */
  export interface IData {
    numberOfSemesters: number;
    defaultScale: number;
    currentSemesterKey: UID;
    catagories?: Record<UID, ICategory>;
    courses?: Record<UID, ICourse>;
    grades?: Record<UID, IGrade>;
    semesters?: Record<UID, ISemester>;
  }

  /**
   * Extended model for semesters, includes courses.
   */
  export interface IExtendedSemester extends ISemester {
    courses: [UID, ICourse][];
  }

  /**
   * Extended model for courses, includes categories and grades.
   */
  export interface IExtendedCourse extends ICourse {
    categories: [UID, IExtendedCategory][];
  }

  /**
   * Extended model for categories, includes grades.
   */
  export interface IExtendedCategory extends ICategory {
    grades: [UID, IGrade][];
  }

  /**
   * Base model for category.
   *
   * Includes the number of children (grades),
   * and its parent key (course).
   */
  export interface ICategory {
    courseKey: UID;
    name: string;
    numGrades: number;
    weight: number;
  }

  /**
   * Base model for course.
   *
   * Includes the number of children (categories),
   * and its parent key (semester).
   */
  export interface ICourse {
    instructor: string;
    name: string;
    numCatagories: number;
    passFail: boolean;
    semesterKey: UID;
  }

  /**
   * Base model for grade.
   *
   * Includes its parent key (category).
   */
  export interface IGrade {
    catagoryKey: UID;
    isIncluded: boolean;
    name: string;
    percent: number;
    score: number;
    total: number;
  }

  /**
   * Base model for semester.
   *
   * Includes the number of children (courses).
   */
  export interface ISemester {
    name: string;
    numCourses: number;
  }

  /**
   * Grade Scale - Percentages, Letters, and Points.
   */
  export interface IGradeScale {
    default: number;
    letter: string[];
    percent: number[];
    scales: {
      title: string;
      scale: number[];
    }[];
    /**
     * Gets the index for the average.
     *
     * @param average grade average
     * @returns the index of the closest grade/gpa/percent, -1 else
     */
    getIndex: (average: string) => number;
  }
}
