import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import * as Database from '../../components/DatabaseHandler';

const AddSemester = ({route, navigation}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [text, setText] = useState("");
  const {id, isInitial} = route.params;

  const inputHandler = async (input) => {
    if(input === '') return;
    await Database.addNewSemester(id, {
      name: input
    });
    Keyboard.dismiss();
    if(!isInitial) navigation.goBack();
    else navigation.replace('menu');
  };


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.screen}>
      <View style={styles.header}>
        <Button
          color={Colors.red}
          onPress={() => {
            Keyboard.dismiss(); 
            if(!isInitial) navigation.goBack();
            else {
              navigation.replace('menu');
            }
            }}
          size={1.5}>
          <FontAwesomeIcon
            icon={['fas', 'times']}
            color={Colors.red}
            size={15}
          />
        </Button>
        <View style={{alignItems: 'center', width: '85%'}}>
          <Text style={styles.title}>New Semester</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{justifyContent: 'flex-start'}}>
          <Text style={styles.heading}>Name</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <Card style={{width: "85%"}}>
            <TextInput
              style={styles.input}
              blurOnSubmit
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              keyboardType="default"
              placeholder={'eg. Summer 2020'}
              value={text}
              onChangeText={(input) => setText(input)}
            />
          </Card>
          <Button size={3} color={Colors.red} style={{marginLeft: 10}} onPress={() => setText("")}>
            <FontAwesomeIcon
              icon={['fas', 'backspace']}
              color={Colors.red}
              size={20}
            />
          </Button>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Button
              size={4}
              onPress={() => inputHandler(text)}
              color={Colors.green}
              title=" | Submit">
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                color={Colors.green}
                size={15}
              />
            </Button>
          </View>
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
    margin: 10,
  },

  body: {
    width: '100%',
    paddingTop: 10,
    justifyContent: 'center',
  },

  input: {
    color: 'white',
    height: 50,
    textAlign: 'left',
    padding: 10
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

  heading: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default AddSemester;
