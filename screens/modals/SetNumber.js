import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  YellowBox,
} from 'react-native';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TextInput} from 'react-native-gesture-handler';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
  ]);

const SetNumber = ({route, navigation}) => {
  const {msg, callback} = route.params;
  const [text, setText] = useState('');

  const inputHandler = input => {
    setText(input.replace(/[^0-9.]/g, ""));
  };

  const resetHandler = () => {
    setText('');
  };

  const confirmHandler = () => {
    const chosenNumber = parseFloat(text);
    if (isNaN(chosenNumber)) {
      return;
    }
    if (chosenNumber > 100) {
      Alert.alert('Invalid Entry', '0.0 ≤ Value ≤ 100.0', [
        {
          text: 'Sorry!',
          style: 'destructive',
          onPress: resetHandler,
        },
      ]);
    } else {
    setText("");
    Keyboard.dismiss();
    callback(chosenNumber);
    navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
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
          <View style={{alignItems: 'center', width: '90%'}}>
            <Text style={styles.title}>{msg}</Text>
          </View>
        </View>
        <Card style={styles.body}>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              blurOnSubmit
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              keyboardType="decimal-pad"
              onChangeText={inputHandler}
              value={text}
            />
            <View style={styles.buttonContainer}>
              <Button style={{marginRight: 5}} size={3} color={Colors.green} onPress={confirmHandler}>
                <FontAwesomeIcon
                  icon={['fas', 'check-circle']}
                  color={Colors.green}
                  size={25}
                />
              </Button>
              <Button
                onPress={resetHandler}
                style={{marginLeft: 5}}
                size={3}
                color={Colors.red}>
                <FontAwesomeIcon
                  icon={['fas', 'backspace']}
                  color={Colors.red}
                  size={25}
                />
              </Button>
            </View>
          </View>
        </Card>
        <Text style={styles.hint}>Enter any value between 0 and 100 (inclusive).</Text>
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
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },

  body: {
    width: '95%',
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans-Regular',
  },

  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    width: 100,
    textAlign: 'center',
    height: 60,
    borderColor: Colors.light_gray,
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 10,
    color: 'white'
  },

  buttonContainer: {
    flexDirection: 'row',
  },

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default SetNumber;
