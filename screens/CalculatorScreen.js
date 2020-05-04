import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import SetNumber from './modals/SetNumber';
import {AuthContext} from '../components/AuthContext';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

const MainScreen = ({navigation}) => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [current, setCurrent] = useState(69);
  const [weight, setWeight] = useState(8.832);
  const [wanted, setWanted] = useState(100);
  let numbers = [current, weight, wanted];
  let msgs = [['What is your average right now?', 'How much is this mark weighed at?', 'What average do you want?'],
    ['Enter Current Average', 'Enter Mark Weight', 'Enter Desired Average']];
  const [calculatedNum, setCalculatedNum] = useState(420);
  const {user} = useContext(AuthContext);

  const callbackfunction = (i, num) => {
    if(i === 0) {
      setCurrent(num);
    } else if (i === 1) {
       setWeight(num);
    } else {
      setWanted(num);
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Grade Predictor</Text>
      </View>
      <View style={styles.body}>
        {numbers.map((num, i) => {
          return (
            <View key={i} style={{width: '100%'}}>
              <View style={styles.messageContainerLeft}>
                <Image style={styles.iconLeft} source={require('../assets/logo-circle.png')} />
                <View>
                  <Card style={styles.messageBubbleLeft}>
                    <Text style={styles.text}>{msgs[0][i]}</Text>
                  </Card>
                </View>
              </View>
              <View style={styles.messageContainerRight}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SetNum', {msg: msgs[1][i], callback: (num) => callbackfunction(i, num)})}>
                  <Card style={styles.messageBubbleRight}>
                    <Text style={styles.text}>{num}%</Text>
                  </Card>
                </TouchableOpacity>
                <Image style={styles.iconRight} source={user === null ? require('../assets/logo-circle.png') : {uri: user.photoURL}} />
              </View>
            </View>
          );
        })}
        {isCalculated ? (
          <View style={styles.messageContainerLeft}>
            <Image style={styles.iconLeft} source={require('../assets/logo-circle.png')}/>
            <View>
              <Card style={styles.messageBubbleLeft}>
                <Text style={styles.text}>You will need to score at least{' '}<Text style={{...styles.text, color: calculatedNum >= 100 ? Colors.red : calculatedNum <= 0 ? Colors.green: Colors.yellow,}}>{calculatedNum}%</Text></Text>
              </Card>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
        <View style={{width: isCalculated ? '45%' : '90%'}}>
          <Button size={4} title="Calculate" color={Colors.green}
            onPress={() => {
                setCalculatedNum((((wanted - current * (1 - weight / 100)) / weight) * 100).toFixed(2));
                setIsCalculated(true);
            }}
          />
        </View>
        {isCalculated ? (
          <View style={{width: '45%'}}>
            <Button size={4} title="Reset" color={Colors.red} onPress={() => {
              setCurrent(69);
              setWeight(8.832);
              setWanted(100);  
              setIsCalculated(false)
              }}/>
          </View>
        ) : (
          <></>
        )}
      </View>
      <Text style={styles.text}>Tap the green chat bubbles to configure.</Text>
    </View>
  );
};

const CalculatorScreen = () => {
  return (
    <Stack.Navigator mode="modal" screenOptions={{headerShown: false, cardStyle: {backgroundColor: 'transparent'}}}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="SetNum" component={SetNumber} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },

  header: {
    paddingBottom: 10,
  },

  body: {
    flex: 1,
  },

  messageContainerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '90%',
  },

  messageContainerRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '90%',
  },

  iconRight: {
    height: 30,
    width: 30,
    borderRadius: 360,
    marginLeft: 5,
  },

  iconLeft: {
    height: 30,
    width: 30,
    borderRadius: 360,
    marginRight: 5,
  },

  messageBubbleLeft: {
    padding: 10,
    borderBottomLeftRadius: 0,
    width: '100%',
  },

  messageBubbleRight: {
    padding: 10,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.green,
    width: '100%',
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
});

export default CalculatorScreen;