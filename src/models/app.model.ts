export interface User {
  id: string;
  currentSemester: string;
  semesters: string[];
  scale: number;
}

export interface Semester {
  id: string;
  name: string;
  courses: string[];
}

export interface Course {
  id: string;
  name: string;
  categories: string[];
  instructor: string;
  passFail: boolean;
}

export interface Category {
  id: string;
  name: string;
  weight: number;
  grades: string[];
}

export interface Grade {
  id: string;
  name: string;
  isIncluded: boolean;
  score: number;
  total: number;
}
