import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import Button from '../../components/Button';
import ToggleButton from '../../components/ToggleButton';
import Card from '../../components/Card';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Database from '../../components/DatabaseHandler';
import Colors from '../../constants/Colors';

const ModifyCourse = ({route, navigation}) => {
  const {id, course, courseKey, semesterKey} = route.params;
  const [isPassFail, setIsPassFail] = useState(course.passFail);
  const [name, setName] = useState(course.name);
  const [instructor, setInstructor] = useState(course.instructor);

  const inputHandler = () => {
    Keyboard.dismiss();
    navigation.navigate('ModifyCatagory', {
      id: id,
      courseKey: courseKey,
    });
  };

  const submitHandler = async () => {
    try {
      await Database.modifyCourse(
        id,
        {
          semesterKey: course.semesterKey,
          name: name.trim(),
          instructor: instructor.trim(),
          passFail: isPassFail,
          numCatagories: course.numCatagories,
        },
        courseKey,
      );
    } catch (e) {
      console.log('Error: ', e);
    }
    Keyboard.dismiss();
    navigation.goBack();
  };

  const deleteCourseHandler = async () => {
    Alert.alert(
      `Delete ${course.name}?`,
      `Are you sure? Categories and Grades will be deleted.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          style: 'destructive',
          onPress: async () => {
            await Database.deleteCourse(id, courseKey, semesterKey);
            navigation.popToTop();
          },
        },
      ],
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
          <View style={{alignItems: 'center', flex: 1, paddingRight: '5%'}}>
            <Text style={styles.title}>Modify Course</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={{justifyContent: 'flex-start'}}>
            <Text style={styles.heading}>Name</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Card style={{width: '85%'}}>
              <TextInput
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={false}
                keyboardType="default"
                placeholder={'eg. Intro to Computer Science'}
                placeholderTextColor={Colors.light_gray}
                value={name}
                onChangeText={input => setName(input)}
              />
            </Card>
            <Button
              size={3}
              color={Colors.red}
              style={{marginLeft: 10}}
              onPress={() => setName('')}>
              <FontAwesomeIcon
                icon={['fas', 'backspace']}
                color={Colors.red}
                size={20}
              />
            </Button>
          </View>

          <View style={{justifyContent: 'flex-start', paddingTop: 20}}>
            <Text style={styles.heading}>Instructor(s) (Optional)</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Card style={{width: '85%'}}>
              <TextInput
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                placeholder={'eg. Ada Lovelace'}
                placeholderTextColor={Colors.light_gray}
                value={instructor}
                onChangeText={input => setInstructor(input)}
              />
            </Card>
            <Button
              size={3}
              color={Colors.red}
              style={{marginLeft: 10}}
              onPress={() => setInstructor('')}>
              <FontAwesomeIcon
                icon={['fas', 'backspace']}
                color={Colors.red}
                size={20}
              />
            </Button>
          </View>

          <View style={{justifyContent: 'flex-start', paddingTop: 20}}>
            <Text style={styles.heading}>Pass/Fail</Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            <View style={{width: '90%'}}>
              <ToggleButton
                bool={!isPassFail}
                size={4}
                TrueTitle="Course will count towards GPA"
                FalseTitle="Course will not count towards GPA"
                onPress={() => setIsPassFail(!isPassFail)}
              />
            </View>
            <View style={{flex: 1}} />
            <View style={{justifyContent: 'space-evenly'}}>
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                color={Colors.green}
                size={18}
              />
              <View style={{padding: 1}} />
              <FontAwesomeIcon
                icon={['fas', 'times-circle']}
                color={Colors.red}
                size={18}
              />
            </View>
          </View>
          {name.trim() === '' ? (
            <></>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginHorizontal: 5, marginTop: 25}}>
                <Button
                  size={4}
                  title="Modify Categories"
                  color={Colors.blue}
                  onPress={() => inputHandler()}
                />
              </View>
              <View style={{flex: 1, marginHorizontal: 5, marginTop: 25}}>
                <Button
                  size={4}
                  title=" | Submit"
                  color={Colors.green}
                  onPress={async () => await submitHandler()}>
                  <FontAwesomeIcon
                    icon={['fas', 'check-circle']}
                    color={Colors.green}
                    size={18}
                  />
                </Button>
              </View>
            </View>
          )}
          <View style={{flex: 1}} />
          <View style={{width: '100%', marginTop: 25}}>
            <Button
              size={4}
              title="Delete Course"
              color={Colors.red}
              onPress={async () => await deleteCourseHandler()}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    width: '100%',
    paddingTop: 10,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'ProductSans-Regular',
  },

  input: {
    color: 'white',
    height: 50,
    textAlign: 'left',
    padding: 10,
  },

  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },

  heading: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default ModifyCourse;
