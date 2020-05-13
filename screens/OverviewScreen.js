import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {AuthContext} from '../components/AuthContext';
import {DataContext} from '../components/DataContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as Database from '../components/DatabaseHandler';
import {createStackNavigator} from '@react-navigation/stack';
import AccordianItem from '../components/AccordianItem';
import AddCourse from './modals/AddCourse';
import ModifyCourse from './modals/ModifyCourse';
import AddCatagory from './modals/AddCatagory';
import ModifyCatagory from './modals/ModifyCatagory';
import AddGrade from './modals/AddGrade';
import CourseScreen from './CourseScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const Stack = createStackNavigator();

const SemesterScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {data} = useContext(DataContext);
  let userData;
  let cgpa;
  let currentSemester;
  if (data !== null && data !== undefined) {
    userData = JSON.parse(data);
    if (userData.currentSemesterKey !== '' && userData.semesters !== undefined)
      currentSemester = userData.semesters[userData.currentSemesterKey];
    cgpa = Database.calculateCGPA(userData);
  }
  return (
    <View style={styles.screen}>
      {currentSemester === null || currentSemester === undefined ? (
        <>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>
              {'You currently have no semesters.'}
            </Text>
            <Button
              style={{marginTop: 10}}
              title="Add New Semester"
              color={Colors.blue}
              size={3}
              onPress={() =>
                navigation.navigate('Profile', {
                  screen: 'AddSemester',
                  params: {id: user.uid, isInitial: true},
                })
              }
            />
          </View>
        </>
      ) : userData.numberOfSemesters !== 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.titleText}>{currentSemester.name}</Text>
            <Button
              title="Add New Course"
              color={Colors.blue}
              size={3}
              onPress={() =>
                navigation.navigate('AddCourse', {
                  id: user.uid,
                  semesterKey: userData.currentSemesterKey,
                })
              }
            />
          </View>
          <View style={styles.body}>
            <Card style={{padding: 10, width: '100%', flexDirection: 'row'}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.infoText}>Cumulative GPA:</Text>
                {cgpa === null ? (
                  <Text
                    style={{...styles.text, paddingTop: 5, color: Colors.red}}>
                    0.00
                  </Text>
                ) : (
                  <Text style={{...styles.text, paddingTop: 5}}>
                    {cgpa.toFixed(2)}
                  </Text>
                )}
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.infoText}>Semester Average:</Text>
                <Text style={{...styles.text, paddingTop: 5}}>
                  {currentSemester.numCourses === 0 ||
                  Database.calculateAverage(
                    userData,
                    userData.currentSemesterKey,
                    'semesters',
                  ) === null ? (
                    <Text style={{color: Colors.red, fontSize: 13}}>
                      {' '}
                      ¯\_(ツ)_/¯
                    </Text>
                  ) : (
                    `${Database.calculateAverage(
                      userData,
                      userData.currentSemesterKey,
                      'semesters',
                    ).toFixed(2)}%`
                  )}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.infoText}>Semester GPA:</Text>
                <Text style={{...styles.text, paddingTop: 5}}>
                  {currentSemester.numCourses === 0 ||
                  Database.calculateGPA(
                    userData,
                    userData.currentSemesterKey,
                  ) === null ? (
                    <Text style={{color: Colors.red, fontSize: 13}}>
                      {' '}
                      ¯\_(ツ)_/¯
                    </Text>
                  ) : (
                    Database.calculateGPA(
                      userData,
                      userData.currentSemesterKey,
                    ).toFixed(2)
                  )}
                </Text>
              </View>
            </Card>
            <View />
            {currentSemester.numCourses === 0 ? (
              <View
                style={{
                  ...styles.container,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.text}>
                  You are currently not enrolled in any courses.
                </Text>
                <Text style={styles.text}>
                  Press{' '}
                  <Text style={{color: Colors.blue}}>{'"Add New Course"'}</Text>
                </Text>
              </View>
            ) : (
              <View style={{paddingTop: 10}}>
                <FlatList
                  data={Object.keys(userData.courses)}
                  keyExtractor={(item, index) => item}
                  renderItem={({item}) => {
                    const average = Database.calculateAverage(
                      userData,
                      item,
                      'courses',
                    );
                    return (
                      <>
                        {userData.courses[item].semesterKey !==
                        userData.currentSemesterKey ? (
                          <></>
                        ) : (
                          <AccordianItem
                            onPress={() =>
                              navigation.navigate('CourseScreen', {
                                id: user.uid,
                                courseKey: item,
                              })
                            }
                            onLongPress={() =>
                              navigation.navigate('ModifyCourse', {
                                id: user.uid,
                                course: userData.courses[item],
                                courseKey: item,
                                semesterKey: userData.currentSemesterKey,
                              })
                            }
                            item={userData.courses[item]}
                            isPassFail={userData.courses[item].passFail}
                            expanded={
                              average === null ? (
                                <View
                                  style={{
                                    paddingVertical: 10,
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                  }}>
                                  <Text style={styles.text}>
                                    You have{' '}
                                    <Text style={{color: Colors.red}}>
                                      no grades
                                    </Text>{' '}
                                    for {userData.courses[item].name}.
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingVertical: 5,
                                    paddingTop: 10,
                                  }}>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={styles.infoText}>Grade:</Text>
                                    <Text
                                      style={{...styles.text, paddingTop: 5}}>
                                      {Database.getGrade(
                                        average,
                                        userData.defaultScale,
                                      )}
                                    </Text>
                                  </View>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={styles.infoText}>
                                      Average:
                                    </Text>
                                    <Text
                                      style={{...styles.text, paddingTop: 5}}>
                                      {average.toFixed(2)}%
                                    </Text>
                                  </View>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={styles.infoText}>GPA:</Text>
                                    <Text
                                      style={{...styles.text, paddingTop: 5}}>
                                      {Database.getGpa(
                                        average,
                                        userData.defaultScale,
                                      ).toFixed(2)}
                                    </Text>
                                  </View>
                                </View>
                              )
                            }
                          />
                        )}
                      </>
                    );
                  }}
                />
              </View>
            )}
          </View>
          {currentSemester.numCourses === 0 ? (
            <></>
          ) : (
            <>
              <Text style={styles.hint}>
                Tap a course to open. Long press to modify.
              </Text>
            </>
          )}
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>
              {'You currently have no semesters.'}
            </Text>
            <Button
              style={{marginTop: 10}}
              title="Add New Semester"
              color={Colors.blue}
              size={3}
              onPress={() =>
                navigation.navigate('Profile', {
                  screen: 'AddSemester',
                  params: {id: user.uid, isInitial: true},
                })
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

const OverviewScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SemesterScreen" component={SemesterScreen} />
      <Stack.Screen name="AddCourse" component={AddCourse} />
      <Stack.Screen name="ModifyCourse" component={ModifyCourse} />
      <Stack.Screen name="AddCatagory" component={AddCatagory} />
      <Stack.Screen name="ModifyCatagory" component={ModifyCatagory} />
      <Stack.Screen name="CourseScreen" component={CourseScreen} />
      <Stack.Screen name="AddGrade" component={AddGrade} />
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  header: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  body: {
    flex: 1,
    width: '90%',
    marginVertical: 10,
  },

  titleText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans-Regular',
  },

  infoText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ProductSans-Regular',
  },

  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },

  container: {
    flex: 1,
    marginTop: 10,
  },

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});
export default OverviewScreen;
