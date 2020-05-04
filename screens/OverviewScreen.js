import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../components/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as Database from '../components/DatabaseHandler';
import database from '@react-native-firebase/database';
import {createStackNavigator} from '@react-navigation/stack';
import AddSemester from './modals/AddSemester';

const Stack = createStackNavigator();

const SemesterScreen = ({route, navigation}) => {
  const {user} = useContext(AuthContext);
  const [data, setData] = useState();

  if (user !== null) {
    Database.setData(user.uid, user.displayName); //inits the user
  }

  useEffect(() => {
    if (user !== null) {
      const subscriber = database()
        .ref(`/users/${user.uid}`)
        .on('value', async s => {
          try {
            setData(JSON.stringify(await s.val()));
          } catch (e) {
            console.log('Error:', e);
          }
        });
      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [data]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Semesters</Text>
        <Button
          title="Add New Semester"
          color={Colors.blue}
          size={3}
          onPress={() => navigation.navigate('AddSemester')}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.titleText}>{data}</Text>
      </View>
    </View>
  );
};


const OverviewScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SemesterScreen" component={SemesterScreen} />
      <Stack.Screen
        name="AddSemester"
        component={AddSemester}
        //CHANGE ANIMATION TO MODAL
      />
    </Stack.Navigator>
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
    alignItems: 'flex-end',
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

  text: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'ProductSans-Regular',
  },
});
export default OverviewScreen;
