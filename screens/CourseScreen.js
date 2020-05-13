import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {DataContext} from '../components/DataContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as Database from '../components/DatabaseHandler';
import AccordianItem from '../components/AccordianItem';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CourseScreen = ({route, navigation}) => {
  const {id, courseKey} = route.params;
  const {data} = useContext(DataContext);
  const userData = JSON.parse(data);
  const course = userData.courses[courseKey];
  let courseAverage = Database.calculateAverage(userData, courseKey, 'courses');
  if (courseAverage === null) courseAverage = 0;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={styles.titleText}>{course.name}</Text>
            {course.instructor === '' ? (
              <></>
            ) : (
              <Text style={styles.infoText}>{course.instructor}</Text>
            )}
          </View>
          {course.passFail ? (
            <View style={{paddingLeft: 10}}>
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                color={Colors.green}
                size={10}
              />
              <View style={{padding: 1}} />
              <FontAwesomeIcon
                icon={['fas', 'times-circle']}
                color={Colors.red}
                size={10}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
        <Button
          onPress={() => navigation.goBack()}
          color={Colors.red}
          size={3}
          title="Back to Semester"
        />
      </View>
      <View style={styles.body}>
        <Card style={{padding: 10, width: '100%', flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.infoText}>Course Grade:</Text>
            <Text style={{...styles.text, paddingTop: 5}}>
              {Database.getGrade(courseAverage, userData.defaultScale)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.infoText}>Course Average:</Text>
            <Text style={{...styles.text, paddingTop: 5}}>
              {courseAverage.toFixed(2)}%
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.infoText}>Course GPA:</Text>
            <Text style={{...styles.text, paddingTop: 5}}>
              {Database.getGpa(courseAverage, userData.defaultScale).toFixed(2)}
            </Text>
          </View>
        </Card>
        <View style={{paddingTop: 10, flex: 1}}>
          <FlatList
            data={Object.keys(userData.catagories)}
            keyExtractor={(item, index) => item}
            renderItem={({item}) => {
              const catagory = userData.catagories[item];
              const catagoryKey = item;
              let catagoryAverage = Database.calculateAverage(
                userData,
                catagoryKey,
                'catagories',
              );
              return (
                <>
                  {catagory.courseKey === courseKey ? (
                    <AccordianItem
                      activeOpacity={1}
                      item={catagory}
                      expanded={
                        <View
                          style={{
                            paddingTop: 5,
                            width: '100%',
                            flexDirection: 'row',
                          }}>
                          <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={styles.infoText}>Average:</Text>
                            {catagory.numGrades === 0 ||
                            catagoryAverage === null ? (
                              <Text
                                style={{
                                  color: Colors.red,
                                  fontSize: 13,
                                  paddingTop: 7,
                                }}>
                                {' '}
                                ¯\_(ツ)_/¯
                              </Text>
                            ) : (
                              <Text style={{...styles.text, paddingTop: 5}}>
                                {catagoryAverage.toFixed(2)}%
                              </Text>
                            )}
                          </View>
                          <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={styles.infoText}>Weight:</Text>
                            <Text style={{...styles.text, paddingTop: 5}}>
                              {catagory.weight}%
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Button
                              size={3}
                              color={Colors.blue}
                              title="Add Grade"
                              onPress={() =>
                                navigation.navigate('AddGrade', {
                                  id: id,
                                  catagoryKey: catagoryKey,
                                  catagoryName: catagory.name,
                                  numGrades: catagory.numGrades,
                                  type: 'New',
                                })
                              }
                            />
                          </View>
                        </View>
                      }
                      expanded2={
                        <Card
                          style={{
                            paddingVertical: 10,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: Colors.dark_gray,
                          }}>
                          {catagory.numGrades === 0 ? (
                            <Text style={styles.text}>
                              You have{' '}
                              <Text style={{color: Colors.red}}>no grades</Text>{' '}
                              for {catagory.name}.
                            </Text>
                          ) : (
                            <FlatList
                              data={Object.keys(userData.grades)}
                              keyExtractor={(item, index) => item}
                              renderItem={({item}) => {
                                const grade = userData.grades[item];
                                return (
                                  <View
                                    key={item}
                                    style={{
                                      alignItems: 'center',
                                      paddingLeft: 5,
                                    }}>
                                    {grade.catagoryKey === catagoryKey ? (
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: 'row',
                                          width: '100%',
                                          padding: 10,
                                        }}
                                        onLongPress={() =>
                                          navigation.navigate('AddGrade', {
                                            id: id,
                                            catagoryKey: catagoryKey,
                                            catagoryName: catagory.name,
                                            numGrades: catagory.numGrades,
                                            type: 'Modify',
                                            grade: grade,
                                            gradeKey: item,
                                          })
                                        }>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                          }}>
                                          <View style={{flex: 1}}>
                                            <Text style={styles.infoText}>
                                              {grade.name}
                                            </Text>
                                          </View>

                                          <View
                                            style={{
                                              flex: 1,
                                              alignItems: 'center',
                                            }}>
                                            <Text style={styles.infoText}>
                                              {grade.score}/{grade.total}
                                            </Text>
                                          </View>

                                          <View
                                            style={{
                                              flex: 1,
                                              flexDirection: 'row',
                                            }}>
                                            <View
                                              style={{
                                                flex: 1,
                                                alignItems: 'center',
                                              }}>
                                              <Text style={styles.infoText}>
                                                {grade.percent.toFixed(2)}%
                                              </Text>
                                            </View>
                                            {grade.isIncluded ? (
                                              <></>
                                            ) : (
                                              <View
                                                style={{
                                                  flex: 0.0001,
                                                  alignItems: 'flex-end',
                                                }}>
                                                <FontAwesomeIcon
                                                  icon={['fas', 'user-secret']}
                                                  color={Colors.light_gray}
                                                  size={15}
                                                />
                                              </View>
                                            )}
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <></>
                                    )}
                                  </View>
                                );
                              }}
                            />
                          )}
                        </Card>
                      }
                    />
                  ) : (
                    <></>
                  )}
                </>
              );
            }}
          />
        </View>
      </View>
      <Text style={styles.hint}>
        Long press on a grade to modify it.
      </Text>
    </View>
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

export default CourseScreen;
