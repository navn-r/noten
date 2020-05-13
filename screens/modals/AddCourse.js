import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import Button from '../../components/Button';
import ToggleButton from '../../components/ToggleButton';
import Card from '../../components/Card';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Colors from '../../constants/Colors';

const AddCourse = ({route, navigation}) => {
  const {id, semesterKey} = route.params;
  const [isPassFail, setIsPassFail] = useState(false);
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');

  const inputHandler = async () => {
    Keyboard.dismiss();
    navigation.navigate('AddCatagory', {
      id: id,
      semesterKey: semesterKey,
      course: {
        name: name.trim(),
        instructor: instructor.trim(),
        passFail: isPassFail,
      },
    });
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
            <Text style={styles.title}>New Course</Text>
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
                autoFocus={true}
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
            <View style={{width: '100%', marginTop: 25}}>
              <Button
                size={4}
                title="Add Categories"
                color={Colors.blue}
                onPress={() => inputHandler()}
              />
            </View>
          )}
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

export default AddCourse;
