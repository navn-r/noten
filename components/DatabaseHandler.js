import React, {useEffect, useContext} from 'react';
import database from '@react-native-firebase/database';
import {AuthContext} from '../components/AuthContext';

const {config} = require('../assets/config.json');

const setData = async (id, name) => {
  try {
    await database()
      .ref(`/users/${id}`)
      .transaction(data => {
        if (data === null) {
          return {
            name: name,
            defaultScale: 2,
            cgpa: 0,
            currentSemesterKey: '',
            numberOfSemesters: 0,
            semesters: [{}],
            courses: [{}],
            catagories: [{}],
            grades: [{}],
          };
        }
      });
  } catch (e) {
    console.log('Error:', e);
  }
};

const getCurrentSnapshot = (id, func) => {
  const subscriber = database()
      .ref(`/users/${id}`).on('value', snapshot => {
        func(snapshot.val());
      })
    return () => subscriber();
}

const getGpa = (average, numScale) => {
  let i = 0;
  while (config.gradeScales.percentScale[i] > average && i < 13) i++;
  return config.gradeScales.gpaScales[numScale].scale[i];
};

const getGrade = (gpa, numScale) =>
  config.gradeScales.letterScale[
    config.gradeScales.gpaScales[numScale].scale.indexOf(gpa)
  ];

const getCurrentScale = async (id) => {
  try {
     return (await database().ref(`/users/${id}`).child('defaultScale').once('value')).val();
  } catch (e) {
    console.log("Error from getCurrentScale:", e)
  }
};

const setDefaultScale = async (id, numScale) => {
  try {
    const ref = database()
      .ref(`/users/${id}`)
      .child('defaultScale');
    await ref.transaction(scale => {
      return numScale;
    });
  } catch (e) {
    console.log('Error from setDefaultScale:', e);
  }
};

const setCurrentSemester = async (id, semKey) => {
    try {
        const ref = database()
      .ref(`/users/${id}`)
      .child('currentSemesterKey');
    await ref.transaction(scale => {
      return semKey;
    });
    } catch (e) {
        console.log("Error:", e)
    }
};

const addNewSemester = async (id, semester) => {
  try {
    const ref = database().ref(`/users/${id}`);
    const key = ref.push().key;
    await ref.transaction(data => {
      return {
        cgpa:
          (data.cgpa * data.numberOfSemesters) /
          (data.numberOfSemesters + 1),
        currentSemesterKey: key,
        numberOfSemesters: data.numberOfSemesters + 1,
        semesters: data.numberOfSemesters !== 0 ? [
          ...data.semesters,
          {
            key: key,
            name: semester.name,
            startDate: semester.startDate,
            endDate: semester.endDate,
            gpa: 0,
            average: 0,
            numCourses: 0,
          },
        ] : [{
          key: key,
          name: semester.name,
          startDate: semester.startDate,
          endDate: semester.endDate,
          gpa: 0,
          average: 0,
          numCourses: 0,
        }],
      };
    });
  } catch (e) {
    console.log('Error:', e);
  }
};

const addNewCourse = async (id, course, semesterKey) => {
  try {
    const ref = database()
      .ref(`/users/${id}`)
      .child('courses');
    const key = ref.push().key;
    await ref.transaction(courses => {
      return [
        ...courses,
        {
          key: key,
          semesterKey: semesterKey,
          name: course.name,
          instructor: course.instructor,
          passFail: false,
          average: 0,
          gpa: 0,
          numCatagories: 0,
        },
      ];
    });
    return key;
  } catch (e) {
    console.log('Error:', e);
  }
};

export {
  setData,
  getGpa,
  getGrade,
  setDefaultScale,
  addNewSemester,
  addNewCourse,
  setCurrentSemester,
  getCurrentScale,
  getCurrentSnapshot
};
