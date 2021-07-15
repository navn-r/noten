import {
  child,
  onValue,
  push,
  ref as getRef,
  Reference,
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

export const useService = (): Noten.IService => useContext(DataContext);

const DataContext = createContext<Noten.IService>(
  null as unknown as Noten.IService
);

export const DataProvider: React.FC = ({ children }) => {
  const { user } = useAuth();

  /** App data global state. */
  const [data, setData] = useState<Noten.IData>(null as unknown as Noten.IData);

  /** Database root reference */
  const _ref = useMemo(() => getRef(db, `/users/${user?.uid}`), [user]);

  /**
   * Helper to get database reference.
   * @param children optional children path
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

  useEffect(() => {
    if (user) {
      /** Connect to database */
      const subscriber = onValue(_ref, (snapshot) => {
        const data: Noten.IData = snapshot.val();
        if (data) {
          setData(data);
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
   */
  function getSemesters(): [Noten.UID, Noten.ISemester][] {
    return Object.entries(data.semesters ?? {});
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
  // TODO: Modify data in local store, then push whole object as update
   * Deletes a semester, along with its courses, categories, and grades
   * @param key semester key
   * @returns Promise that resolves on delete semester
   */
  function deleteSemester(key: Noten.UID): Promise<void> {
    const updates = {
      currentSemesterKey: '-MeBfMM1EUPJyArUUG9p',
      numberOfSemesters: getNumSemesters() - 1,
      [`/semesters/${key}`]: null,
    };
    return update(ref(), updates);
  }

  /**
   * Creates a new course.
   * @param course course object
   * @returns Promise that resolves on creation of new course
   */
  function createCourse(course: Noten.ICourse): Promise<void> {
    const courseKey = key('courses');
    const updates: Record<string, Noten.ICourse | number> = {
      [`courses/${courseKey}`]: course,
    };
    if (data.semesters) {
      updates[`semesters/${course.semesterKey}/numCourses`] =
        data.semesters[course.semesterKey].numCourses + 1;
    }
    return update(ref(), updates);
  }

  /**
   * Edits a course.
   * @param key course id
   * @param course course object
   * @returns Promise that resolves on edit of course
   */
  function editCourse(key: Noten.UID, course: Noten.ICourse): Promise<void> {
    return set(ref(`courses/${key}`), course);
  }

  const service: Noten.IService = {
    ready: !!data,
    getDefaultScale,
    setDefaultScale,
    getSemesterKey,
    setSemesterKey,
    getNumSemesters,
    getSemesters,
    createSemester,
    editSemester,
    deleteSemester,
    createCourse,
    editCourse,
  };

  return (
    <DataContext.Provider value={service}>{children}</DataContext.Provider>
  );
};
