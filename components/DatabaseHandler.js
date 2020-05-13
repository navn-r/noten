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
  while (config.gradeScales.percentScale[i] > Math.round(average) && i < 13)
    i++;
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

const modifySemester = async (id, semester, semesterKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`semesters/${semesterKey}`).update({
      name: semester.name,
      numCourses: semester.numCourses,
    });
  } catch (e) {
    console.log('Error:', e);
  }
};

const deleteSemester = async (id, semesterKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    let numSemesters;
    let i = 0;
    const currentSemester = (await ref
      .child('currentSemesterKey')
      .once('value')).val();
    await ref.child(`numberOfSemesters`).transaction(data => {
      if (data !== null && data !== undefined && data > 0) {
        numSemesters = data - 1;
        return numSemesters;
      }
    });
    if (numSemesters === 0) {
      await ref.update({currentSemesterKey: ""});
    } else if (currentSemester === semesterKey) {
      (await ref.child('semesters').once('value')).forEach(async snapshot => {
        if(i === 0 && snapshot.key !== currentSemester) {
          await setCurrentSemester(id, snapshot.key);
          i++;
          return;
        }
      })
    }
    (await ref
      .child(`courses`)
      .orderByChild('semesterKey')
      .equalTo(semesterKey)
      .once('value')).forEach(
      async snapshot => await deleteCourse(id, snapshot.key, semesterKey),
    );
    await ref.child(`semesters/${semesterKey}`).remove();
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

const modifyCourse = async (id, course, courseKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`courses/${courseKey}`).update({
      semesterKey: course.semesterKey,
      name: course.name,
      instructor: course.instructor,
      passFail: course.passFail,
      numCatagories: course.numCatagories,
    });
  } catch (e) {
    console.log('Error', e);
  }
};

const deleteCourse = async (id, courseKey, semesterKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`semesters/${semesterKey}/numCourses`).transaction(data => {
      if (data !== null && data !== undefined && data > 0) return data - 1;
    });
    (await ref
      .child(`catagories`)
      .orderByChild('courseKey')
      .equalTo(courseKey)
      .once('value')).forEach(
      async snapshot => await deleteCatagory(id, snapshot.key, courseKey),
    );
    await ref.child(`courses/${courseKey}`).remove();
    console.log('Deleted Course');
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
    for (var i = 0; i < catagories.length; i++) {
      await ref.child(`catagories/${catagories[i].key}`).update({
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

const modifyAllCatagories = async (id, catagories, courseKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`courses/${courseKey}/numCatagories`).transaction(data => data + catagories.length);
    for (var i = 0; i < catagories.length; i++) {
      await ref.child(`catagories/${catagories[i].key}`).update({
        courseKey: courseKey,
        name: catagories[i].name,
        weight: catagories[i].weight,
        numGrades: catagories[i].numGrades,
      });
    }
  } catch (e) {
    console.log('Error', e);
  }
};

const deleteCatagory = async (id, catagoryKey, courseKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`courses/${courseKey}/numCatagories`).transaction(data => {
      if (data !== null && data !== undefined && data > 0) return data - 1;
    });
    (await ref
      .child(`grades`)
      .orderByChild('catagoryKey')
      .equalTo(catagoryKey)
      .once('value')).forEach(async snapshot => {
      await deleteGrade(id, snapshot.key, catagoryKey);
    });
    await ref.child(`catagories/${catagoryKey}`).remove();
    console.log('Deleted Catagory');
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

const modifyGrade = async (id, grade, catagoryKey, gradeKey) => {
  try {
    await database()
      .ref(`/users/${id}`)
      .child(`grades/${gradeKey}`)
      .update({
        catagoryKey: catagoryKey,
        name: grade.name,
        score: grade.score,
        total: grade.total,
        percent: (grade.score / grade.total) * 100.0,
        isIncluded: grade.isIncluded,
      });
  } catch (e) {
    console.log('Error', e);
  }
};

const deleteGrade = async (id, gradeKey, catagoryKey) => {
  try {
    const ref = database().ref(`/users/${id}`);
    await ref.child(`catagories/${catagoryKey}/numGrades`).transaction(data => {
      if (data !== null && data !== undefined && data > 0) return data - 1;
    });
    await ref.child(`grades/${gradeKey}`).remove();
  } catch (e) {
    console.log('Error', e);
  }
};

const calculateAverage = (userData, key, type) => {
  let average = 0;
  let counter = 0;
  let weight = 100;
  let mark = 0;
  let items;
  try {
    switch (type) {
      case 'catagories':
        if (
          userData.catagories === undefined ||
          userData.catagories[key].numGrades === 0
        ) {
          return null;
        } else {
          items = Object.keys(userData.grades);
          for (let i = 0; i < items.length; i++) {
            if (userData.grades[items[i]].catagoryKey === key) {
              if (!userData.grades[items[i]].isIncluded) {
                counter++;
              } else {
                average += userData.grades[items[i]].percent;
              }
            }
          }
        }
        if (counter === userData.catagories[key].numGrades) return null;
        return average / (userData.catagories[key].numGrades - counter);
      case 'courses':
        if (userData.courses[key].numCatagories === 0) return null;
        items = Object.keys(userData.catagories); // length > 0
        for (let i = 0; i < items.length; i++) {
          if (userData.catagories[items[i]].courseKey === key) {
            mark = calculateAverage(userData, items[i], 'catagories');
            if (mark === null) {
              weight -= userData.catagories[items[i]].weight;
            } else {
              average += mark * (userData.catagories[items[i]].weight / 100);
            }
          }
        }
        if (weight === 0) return null;
        return average * (100 / weight);

      case 'semesters':
        if (userData.semesters[key].numCourses === 0) return null;
        items = Object.keys(userData.courses);
        for (let i = 0; i < items.length; i++) {
          if (userData.courses[items[i]].semesterKey === key) {
            if (userData.courses[items[i]].passFail) {
              counter++;
            } else {
              mark = calculateAverage(userData, items[i], 'courses');
              if (mark === null) {
                counter++;
              } else {
                average += mark;
              }
            }
          }
        }
        if (userData.semesters[key].numCourses === counter) return null;
        return average / (userData.semesters[key].numCourses - counter);
      default:
        return 0;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

const calculateGPA = (userData, key) => {
  // only for semesters
  let gpa = 0;
  let counter = 0;
  let mark = 0;
  if (userData.semesters[key].numCourses === 0) return null;
  const items = Object.keys(userData.courses);
  for (let i = 0; i < items.length; i++) {
    if (userData.courses[items[i]].semesterKey === key) {
      if (userData.courses[items[i]].passFail) {
        counter++;
      } else {
        mark = calculateAverage(userData, items[i], 'courses');
        if (mark === null) {
          counter++;
        } else {
          gpa += getGpa(mark, userData.defaultScale);
        }
      }
    }
  }
  if (userData.semesters[key].numCourses === counter) return null;
  return gpa / (userData.semesters[key].numCourses - counter);
};

const calculateCGPA = userData => {
  let gpa = 0;
  let counter = 0;
  let mark = 0;
  if (userData.numberOfSemesters === 0) return null;
  else {
    const items = Object.keys(userData.semesters);
    for (let i = 0; i < items.length; i++) {
      mark = calculateGPA(userData, items[i]);
      if (mark === null) {
        counter++;
      } else {
        gpa += mark;
      }
    }
  }
  if (counter === userData.numberOfSemesters) return null;
  return gpa / (userData.numberOfSemesters - counter);
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
  calculateGPA,
  deleteGrade,
  modifyGrade,
  modifySemester,
  deleteSemester,
  modifyCourse,
  deleteCourse,
  deleteCatagory,
  modifyAllCatagories
};
