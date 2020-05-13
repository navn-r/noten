import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import Card from '../../components/Card';
import database from '@react-native-firebase/database';
import * as Database from '../../components/DatabaseHandler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Colors from '../../constants/Colors';

const AddCatagory = ({route, navigation}) => {
  const [weight, setWeight] = useState(0);
  const [catagories, setCatagories] = useState([]);
  const [isGood, setIsGood] = useState(false);
  const {id, semesterKey, course} = route.params;

  const deleteCatagoryHandler = key => {
    setCatagories(catagorys =>
      catagorys.filter(catagory => catagory.key !== key),
    );
  };

  const submitHandler = async () => {
    try {
      const courseKey = await Database.addNewCourse(id, course, semesterKey);
      await Database.addAllCatagories(id, catagories, courseKey);
      navigation.popToTop();
    } catch (e) {
      console.log('Error', e);
    }
  };

  const inputChecker = () => {
    for (var i = 0; i < catagories.length; i++) {
      if (catagories[i].name.trim() === '') {
        setIsGood(false);
        return;
      }
    }
    setIsGood(true);
  };

  const getWeight = () => {
    let num = 0;
    let parsedNum = 0;
    for (var i = 0; i < catagories.length; i++) {
      num += catagories[i].weight;
    }
    setWeight(num);
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
            <Text style={styles.title}>Course Categories</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
              <Button
                style={{marginHorizontal: 5}}
                size={4}
                title="Add New Category"
                color={Colors.blue}
                onPress={() => {
                  Keyboard.dismiss();
                  setCatagories([
                    ...catagories,
                    {
                      key: database()
                        .ref(`users/${id}`)
                        .push().key, //INCLUDE AFTER
                      name: '',
                      weight: '',
                    },
                  ]);
                }}
              />
            </View>
            {weight === 100 && isGood ? (
              <View style={{flex: 0.5}}>
                <Button
                  onPress={async () => {
                    await submitHandler();
                  }}
                  style={{marginHorizontal: 5}}
                  size={4}
                  title=" | Submit"
                  color={Colors.green}>
                  <FontAwesomeIcon
                    icon={['fas', 'check-circle']}
                    color={Colors.green}
                    size={15}
                  />
                </Button>
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  padding: 12,
                  borderWidth: 2,
                  borderColor: Colors.red,
                  borderRadius: 12,
                  flex: 0.25,
                }}>
                <Text style={{...styles.text, fontSize: 16, color: Colors.red}}>
                  {weight}%
                </Text>
              </View>
            )}
          </View>

          <KeyboardAwareFlatList
            enableOnAndroid={true}
            data={catagories}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onLongPress={() => {
                    deleteCatagoryHandler(item.key);
                    setWeight(weight - item.weight);
                  }}>
                  <Card style={{width: '100%', padding: 5, marginTop: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{...styles.text, fontSize: 12}}>
                          Category Name
                        </Text>
                        <TextInput
                          style={styles.input}
                          blurOnSubmit
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="default"
                          textAlign="center"
                          placeholder={'eg. Assignments'}
                          placeholderTextColor={Colors.light_gray}
                          onChangeText={input => {
                            item.name = input;
                            inputChecker();
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View>
                            <Text style={{...styles.text, fontSize: 12}}>
                              Percent Weight
                            </Text>
                            <TextInput
                              style={{...styles.input}}
                              blurOnSubmit
                              autoCapitalize="none"
                              autoCorrect={false}
                              keyboardType="decimal-pad"
                              textAlign="center"
                              placeholder={'eg. 35'}
                              placeholderTextColor={Colors.light_gray}
                              onChangeText={input => {
                                const parsedNum = parseFloat(
                                  input.replace(/[^0-9.]/g, ''),
                                );
                                item.weight = isNaN(parsedNum) ? 0 : parsedNum;
                                getWeight();
                                inputChecker();
                              }}
                            />
                          </View>
                          <View style={{justifyContent: 'center', paddingTop: 20}}>
                            <Text style={[styles.text, {paddingLeft: 5}]}>
                              %
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View>
          <Text style={styles.hint}>
            Press and hold on a category to delete it.
          </Text>
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
    marginTop: 5,
    textAlign: 'left',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    borderRadius: 15,
    width: '90%',
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

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default AddCatagory;
/* */
