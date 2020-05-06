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
          };
        }
      });
  } catch (e) {
    console.log('Error:', e);
  }
};

const getGpa = (average, numScale) => {
  let i = 0;
  while (config.gradeScales.percentScale[i] > average && i < 13) i++;
  return config.gradeScales.gpaScales[numScale].scale[i];
};

const getGrade = (gpa, numScale) =>
  config.gradeScales.letterScale[
    config.gradeScales.gpaScales[numScale].scale.indexOf(gpa)
  ];

const getCurrentScale = async id => {
  try {
    return (await database()
      .ref(`/users/${id}`)
      .child('defaultScale')
      .once('value')).val();
  } catch (e) {
    console.log('Error from getCurrentScale:', e);
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
    console.log('Error:', e);
  }
};

const addNewSemester = async (id, semester) => {
  try {
    const ref = database().ref(`/users/${id}`);
    const key = ref.push().key;
    await ref.child('currentSemesterKey').set(key);
    await ref.child(`semesters/${key}`).update({
      name: semester.name,
      average: 0,
      numCourses: 0,
    });
    await ref.child('numberOfSemesters').transaction(data => data + 1);
  } catch (e) {
    console.log('Error:', e);
  }
};

const addNewCourse = async (id, course, semesterKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    const key = ref.push().key;
    await ref.child(`courses/${key}`).update({
      semesterKey: semesterKey,
      name: course.name,
      instructor: course.instructor,
      passFail: course.passFail,
      average: 0,
      numCatagories: 0,
    });
    await ref
      .child(`semesters/${semesterKey}/numCourses`)
      .transaction(data => data + 1);
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
};
