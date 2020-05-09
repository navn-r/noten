import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {AuthContext} from '../components/AuthContext';
import {DataContext} from '../components/DataContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as Database from '../components/DatabaseHandler';
import AccordianItem from '../components/AccordianItem';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const CourseScreen = ({route, navigation}) => {
  const {id, courseKey} = route.params;
  const {data} = useContext(DataContext);
  const userData = JSON.parse(data);
  const course = userData.courses[courseKey];

  const configureCatagoryHandler = () => {};

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titleText}>{course.name}</Text>
          {course.instructor === '' ? (
            <></>
          ) : (
            <Text style={styles.infoText}>{course.instructor}</Text>
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
              {Database.getGrade(
                Database.calculateAverage(userData, courseKey, 'courses'),
                userData.defaultScale,
              )}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.infoText}>Course Average:</Text>
            <Text style={{...styles.text, paddingTop: 5}}>
              {Database.calculateAverage(userData, courseKey, 'courses').toFixed(2)}%
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.infoText}>Course GPA:</Text>
            <Text style={{...styles.text, paddingTop: 5}}>
              {Database.getGpa(
                Database.calculateAverage(userData, courseKey, 'courses'),
                userData.defaultScale,
              ).toFixed(2)}
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
              return (
                <>
                  {catagory.courseKey === courseKey ? (
                    <AccordianItem
                      item={catagory}
                      onLongPress={() => configureCatagoryHandler()}
                      expanded={
                        <View
                          style={{
                            paddingTop: 5,
                            width: '100%',
                            flexDirection: 'row',
                          }}>
                          <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={styles.infoText}>Average:</Text>
                            {catagory.numGrades === 0 ? (
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
                                {Database.calculateAverage(
                                  userData,
                                  catagoryKey,
                                  'catagories',
                                ).toFixed(2)}
                                %
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
                              for this category.
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
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          paddingVertical: 10,
                                          width: '80%',
                                          justifyContent: 'space-between',
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
        Long press on a category or grade to configure it.
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
