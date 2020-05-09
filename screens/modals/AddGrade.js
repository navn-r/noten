import React, {useState, useEffect} from 'react';
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
import * as Database from '../../components/DatabaseHandler'

const AddGrade = ({route, navigation}) => {
  const {id, catagoryKey, catagoryName, numGrades} = route.params;
  const [name, setName] = useState('');
  const [scoreText, setScoreText] = useState('');
  const [outOfText, setOutOfText] = useState('');
  const [score, setScore] = useState(0);
  const [outOf, setOutOf] = useState(0);
  const [isIncluded, setIsIncluded] = useState(true);
  const [isPercent, setIsPercent] = useState(false);
  const [isGood, setIsGood] = useState(false);

  const submitHandler = async () => {
    try {
      await Database.addGrade(id, {
        name: name.trim(),
        score: score,
        total: outOf,
        isIncluded: isIncluded,
      }, catagoryKey);
      Keyboard.dismiss();
      navigation.goBack();
    } catch(e) {
      console.log('Error:', e)
    }
  };

  useEffect(() => {
    const parsedScore = parseFloat(scoreText);
    const parsedOutOf = parseFloat(outOfText);
    setScore(isNaN(parsedScore) ? 0 : parsedScore);
    if (isPercent) {
      setOutOf(!isNaN(parsedScore) ? 100 : 0)
    } else {
      setOutOf(isNaN(parsedOutOf) ? 0 : parsedOutOf);
    }
    //setOutOf(isPercent ? !isNaN(parsedScore) ?  100 : 0 : parsedOutOf);
    setIsGood(!(name.trim() === '' || outOf === 0));
  }, [name, scoreText, score, outOfText, outOf, isGood, isPercent]);

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
          <View style={{alignItems: 'center', flex: 1, paddingRight: '0%'}}>
            <Text style={styles.title}>New Grade</Text>
          </View>
          {isGood ? (
            <View style={{}}>
              <Button
                onPress={async () => {
                  await submitHandler();
                }}
                style={{marginHorizontal: 0}}
                size={3.5}
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
            <></>
          )}
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
                placeholder={`eg. ${catagoryName} ${numGrades + 1}`}
                placeholderTextColor={Colors.light_gray}
                value={name}
                onChangeText={input => {
                  setName(input);
                }}
              />
            </Card>
            <Button
              size={3}
              color={Colors.red}
              style={{marginLeft: 10}}
              onPress={() => {
                setName('');
                setIsGood(false);
              }}>
              <FontAwesomeIcon
                icon={['fas', 'backspace']}
                color={Colors.red}
                size={20}
              />
            </Button>
          </View>
          <View style={{paddingTop: 20}}>
            <ToggleButton
              size={4}
              bool={isPercent}
              onPress={() => {
                setScoreText('');
                setOutOfText('');
                setScore(0);
                setOutOf(0);
                setIsGood(false);
                setIsPercent(!isPercent);
              }}
              TrueTitle="Percentage Based"
              FalseTitle="Score Based"
              trueColor={Colors.yellow}
              falseColor={Colors.orange}
            />
          </View>
          {isPercent ? (
            <View style={{paddingTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text style={styles.heading}>Percentage</Text>
                  <Card>
                    <TextInput
                      style={styles.numberInput}
                      blurOnSubmit
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="decimal-pad"
                      placeholder={`eg. 69`}
                      placeholderTextColor={Colors.light_gray}
                      value={scoreText}
                      onChangeText={input => {
                        setScoreText(input.replace(/[^0-9.]/g, ''));
                      }}
                    />
                  </Card>
                </View>
                <Text
                  style={[
                    styles.text,
                    {paddingTop: 20, paddingRight: 15, fontSize: 20},
                  ]}>
                  %
                </Text>
              </View>
            </View>
          ) : (
            <View style={{paddingTop: 20}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.heading}>Score</Text>
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={styles.heading}>Out Of</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Card style={{flex: 1, margin: 10}}>
                  <TextInput
                    style={styles.numberInput}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="decimal-pad"
                    placeholder={`eg. 13.8`}
                    placeholderTextColor={Colors.light_gray}
                    value={scoreText}
                    onChangeText={input => {
                      setScoreText(input.replace(/[^0-9.]/g, ''));
                    }}
                  />
                </Card>
                <Card style={{flex: 1, margin: 10}}>
                  <TextInput
                    style={styles.numberInput}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="decimal-pad"
                    placeholder={`eg. 20`}
                    placeholderTextColor={Colors.light_gray}
                    value={outOfText}
                    onChangeText={input => {
                      setOutOfText(input.replace(/[^0-9.]/g, ''));
                    }}
                  />
                </Card>
              </View>
            </View>
          )}
          <View style={{justifyContent: 'flex-start', paddingTop: 20}}>
            <Text style={styles.heading}>Incognito Grade</Text>
          </View>
          <View
            style={{
              paddingTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1, marginRight: 10}}>
              <ToggleButton
                size={4}
                bool={isIncluded}
                onPress={() => setIsIncluded(!isIncluded)}
                TrueTitle="Include in Calculations"
                FalseTitle="Ignore in Calculations"
              />
            </View>
            <FontAwesomeIcon
              icon={['fas', 'user-secret']}
              color={Colors.light_gray}
              size={35}
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

  numberInput: {
    color: 'white',
    height: 50,
    textAlign: 'center',
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

export default AddGrade;
