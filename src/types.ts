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
 * Main App Data.
 *
 * Includes the number of children (semesters).
 */
export interface Data {
  numberOfSemesters: number;
  defaultScale: number;
  currentSemesterKey: UID;
  catagories?: Record<UID, Category>;
  courses?: Record<UID, Course>;
  grades?: Record<UID, Grade>;
  semesters?: Record<UID, Semester>;
}

/**
 * Extended model for semesters, includes courses.
 */
export interface ExtendedSemester extends Semester {
  courses: [UID, Course][];
}

/**
 * Extended model for courses, includes categories and grades.
 */
export interface ExtendedCourse extends Course {
  categories: [UID, ExtendedCategory][];
}

/**
 * Extended model for categories, includes grades.
 */
export interface ExtendedCategory extends Category {
  grades: [UID, Grade][];
}

/**
 * Base model for category.
 *
 * Includes the number of children (grades),
 * and its parent key (course).
 */
export interface Category {
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
export interface Course {
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
export interface Grade {
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
export interface Semester {
  name: string;
  numCourses: number;
}
