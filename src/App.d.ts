declare namespace Noten {
  export type UID = string;

  /**
   * Main App Data Service.
   */
  export interface IService {
    /**
     * Check if data has loaded,
     */
    ready: boolean;
    /**
     * Gets the default grade scale.
     * @returns default grade scale
     */
    getDefaultScale: () => number;
    /**
     * Sets the default grade scale.
     * @param scale new grade scale
     * @returns Promise that resolves on success of updated scale
     */
    setDefaultScale: (scale: number) => Promise<void>;
    /**
     * Gets the current semester.
     * @returns current semester key
     */
    getSemesterKey: () => Noten.UID;
    /**
     * Sets the current semester.
     * @param semesterKey new current semester key
     * @returns Promise that resolves on success of updated key
     */
    setSemesterKey: (semesterKey: Noten.UID) => Promise<void>;
    /**
     * Gets the number of semesters.
     * @returns number of semesters
     */
    getNumSemesters: () => number;
    /**
     * Gets all semesters.
     * @returns Array of key value semester pairs
     */
    getSemesters: () => [Noten.UID, Noten.ISemester][];
    /**
     * Creates a new semester.
     * @param name new semester name
     * @returns Promise that resolves on creation of new semester
     */
    createSemester: (name: string) => Promise<void>;
    /**
     * Edits the semester name.
     * @param key semester key
     * @param name new semester name
     * @returns Promise that resolves on update semester
     */
    editSemester: (key: Noten.UID, name: string) => Promise<void>;
    /**
     * Deletes a semester, along with its courses, categories, and grades
     * @param key semester key
     * @returns Promise that resolves on delete semester
     */
    deleteSemester: (key: Noten.UID) => Promise<void>;
    /**
     * Creates a new course.
     * @param course course object
     * @returns Promise that resolves on creation of new course
     */
    createCourse: (course: Noten.ICourse) => Promise<void>;
    /**
     * Edits a course.
     * @param key course id
     * @param course course object
     * @returns Promise that resolves on edit of course
     */
    editCourse: (key: Noten.UID, course: Noten.ICourse) => Promise<void>;
  }

  /**
   * Main App Data.
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

  export interface ICategory {
    courseKey: UID;
    name: string;
    numGrades: number;
    weight: number;
  }

  export interface ICourse {
    instructor: string;
    name: string;
    numCatagories: number;
    passFail: boolean;
    semesterKey: UID;
  }

  export interface IGrade {
    catagoryKey: UID;
    isIncluded: boolean;
    name: string;
    percent: number;
    score: number;
    total: number;
  }

  export interface ISemester {
    name: string;
    numCourses: number;
  }
}
