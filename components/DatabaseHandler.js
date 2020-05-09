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
            defaultScale: 2,
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

const getGrade = (average, numScale) =>
  config.gradeScales.letterScale[
    config.gradeScales.gpaScales[numScale].scale.indexOf(
      getGpa(average, numScale),
    )
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
      numCatagories: 0,
    });
    await ref
      .child(`semesters/${semesterKey}/numCourses`)
      .transaction(data => data + 1);
    return key;
  } catch (e) {
    console.log('Error:', e);
  }
};

const addAllCatagories = async (id, catagories, courseKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`courses/${courseKey}`).update({
      numCatagories: catagories.length,
    });
    let key;
    for (var i = 0; i < catagories.length; i++) {
      await ref.child(`catagories/${catagories[i].key}`).update({
        key: key,
        courseKey: courseKey,
        name: catagories[i].name,
        weight: catagories[i].weight,
        numGrades: 0,
      });
    }
  } catch (e) {
    console.log('Error', e);
  }
};

const addGrade = async (id, grade, catagoryKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    const key = ref.push().key;
    await ref.child(`grades/${key}`).update({
      catagoryKey: catagoryKey,
      name: grade.name,
      score: grade.score,
      total: grade.total,
      percent: (grade.score / grade.total) * 100.0,
      isIncluded: grade.isIncluded,
    });
    await ref
      .child(`catagories/${catagoryKey}/numGrades`)
      .transaction(data => data + 1);
  } catch (e) {
    console.log('Error:', e);
  }
};

const calculateAverage = (userData, key, type) => {
  let avg = 0;
  if (type === 'catagories') {
    let counter = 0;
    const items = Object.keys(userData.grades);
    for (var i = 0; i < items.length; i++) {
      if(userData.grades[items[i]].catagoryKey === key) {
        if(!userData.grades[items[i]].isIncluded) {
          counter++;
        } else {
          avg += userData.grades[items[i]].percent;
        }
      }
    }
    return avg / (userData.catagories[key].numGrades - counter);
  } else if (type === 'courses') {
    const items = Object.keys(userData.catagories);
    for (var i = 0; i < items.length; i++) {
      avg +=
        userData.catagories[items[i]].courseKey === key && userData.catagories[items[i]].numGrades !== 0
          ? calculateAverage(userData, items[i], 'catagories') * userData.catagories[items[i]].weight / 100
          : 0;
    }
    return avg;
  } else if (type === 'semesters') {
    const items = Object.keys(userData.courses);
    for (var i = 0; i < items.length; i++) {
      avg += userData.courses[items[i]].semesterKey === key ? calculateAverage(userData, items[i], 'courses') : 0;
    } return avg / userData.semesters[key].numCourses;
  }
  return 69;
};

const calculateCGPA = (userData) => {
  const items = Object.keys(userData.semesters);
  let gpa = 0;
  let isPassFailCounter = 0;
  for(var i = 0; i < items.length; i++) {
    if(userData.semesters[items[i]].numCourses === 0 || userData.semesters[items[i]].isPassFail) isPassFailCounter++;
    else {
      gpa += getGpa(calculateAverage(userData, items[i], 'semesters'), userData.defaultScale);
    } 
  } 
  return gpa / (userData.numberOfSemesters - isPassFailCounter);
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
  addAllCatagories,
  addGrade,
  calculateAverage,
  calculateCGPA,
};
