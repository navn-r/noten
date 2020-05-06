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
              isInitial: false
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
                    return (
                      <AccordianItem
                        item={userData.semesters[item]}
                        expanded={
                          <View>
                            {userData.semesters[item].numCourses === 0 ? (
                              <View style={{paddingVertical: 10}}>
                                <View style={{flex: 1, paddingTop: 10}}>
                                  <Text style={styles.text}>
                                    You are{' '}
                                    <Text style={{color: Colors.red}}>
                                      not enrolled
                                    </Text>{' '}
                                    in any courses this semester.
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              <View style={{paddingVertical: 10}}>
                                <View style={{flex: 1, paddingTop: 10}}>
                                  <Text style={styles.text}>
                                    Semester Average:{' '}
                                    {userData.semesters[item].average}%
                                  </Text>
                                </View>
                                <View style={{flex: 1, paddingTop: 10}}>
                                  <Text style={styles.text}>
                                    Semester GPA:{' '}
                                    {Database.getGpa(
                                      userData.semesters[item].average,
                                      userData.defaultScale,
                                    )}
                                  </Text>
                                </View>
                                <View style={{flex: 1, paddingTop: 10}}>
                                  <Text style={styles.text}>
                                    Enrolled Courses:{' '}
                                    {userData.semesters[item].numCourses}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
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
          <Text style={styles.text}>
            Tap the name of the semester to select it.
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
});

export default SetCurrentSem;
