import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import * as Database from '../../components/DatabaseHandler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AccordianItem from '../../components/AccordianItem';
import {DataContext} from '../../components/DataContext';

const SetCurrentSem = ({route, navigation}) => {
  const {data} = useContext(DataContext);
  const {id} = route.params;
  const userData = JSON.parse(data);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Button
          color={Colors.red}
          onPress={() => navigation.goBack()}
          size={1.5}>
          <FontAwesomeIcon
            icon={['fas', 'times']}
            color={Colors.red}
            size={15}
          />
        </Button>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>Semesters</Text>
        </View>
        <Button
          title="Add New Semester"
          color={Colors.blue}
          size={3}
          onPress={() =>
            navigation.navigate('AddSemester', {
              id: id,
              isInitial: false,
            })
          }
        />
      </View>
      <View style={styles.body}>
        {userData === null || userData === undefined ? (
          <></>
        ) : (
          <>
            {userData.numberOfSemesters === 0 ? (
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
                  <Text style={styles.text}>
                    Press{' '}
                    <Text style={{color: Colors.blue}}>
                      {'"Add New Semester"'}
                    </Text>
                  </Text>
                </View>
              </>
            ) : (
              <>
                <FlatList
                  data={Object.keys(userData.semesters)}
                  keyExtractor={(item, index) => item}
                  renderItem={({item}) => {
                    let average = Database.calculateAverage(
                      userData,
                      item,
                      'semesters',
                    );
                    let gpa = Database.calculateGPA(
                      userData,
                      item,
                    );
                    return (
                      <AccordianItem
                        item={userData.semesters[item]}
                        onLongPress={() => {navigation.navigate("AddSemester", {
                          id: id, 
                          isInitial: false,
                          type: 'Modify',
                          semester: userData.semesters[item],
                          semesterKey: item
                        })}}
                        expanded={
                          userData.semesters[item].numCourses !== 0 ? (
                            <View
                              style={{
                                padding: 10,
                                width: '100%',
                                flexDirection: 'row',
                              }}>
                              {average === null || gpa === null ? (
                                <View style={{flex: 1, alignItems: 'center'}}>
                                  <Text style={styles.infoText}>Grade/GPA/Average:</Text>
                                    <Text style={{...styles.text, paddingTop: 5, color: Colors.red}}>
                                      No Grades Found
                                    </Text>
                                </View>
                              ) : (
                                <>
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
                                      {average.toFixed(2)}
                                    </Text>
                                  </View>
                                  <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text style={styles.infoText}>GPA:</Text>
                                    <Text
                                      style={{...styles.text, paddingTop: 5}}>
                                      {gpa.toFixed(2)}
                                    </Text>
                                  </View>
                                </>
                              )}

                              <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={styles.infoText}>Courses:</Text>
                                <Text style={{...styles.text, paddingTop: 5}}>
                                  {userData.semesters[item].numCourses}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View style={{padding: 15, alignItems: 'center'}}>
                              <Text style={styles.text}>
                                You are currently{' '}
                                <Text style={{color: Colors.red}}>
                                  not enrolled
                                </Text>{' '}
                                in any courses.
                              </Text>
                            </View>
                          )
                        }
                        isCurrent={item === userData.currentSemesterKey}
                        onPress={async () => {
                          await Database.setCurrentSemester(id, item);
                          navigation.goBack();
                        }}
                      />
                    );
                  }}
                />
              </>
            )}
          </>
        )}
      </View>
      {userData !== null &&
      userData !== undefined &&
      userData.numberOfSemesters !== 0 ? (
        <>
          <Text style={styles.hint}>
            Tap to select a semester. Long press to modify.
          </Text>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    backgroundColor: Colors.dark_gray,
    paddingTop: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },

  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'ProductSans-Regular',
  },

  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },

  container: {flex: 1, alignItems: 'center'},

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },

  infoText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ProductSans-Regular',
  },
});

export default SetCurrentSem;

/* */
