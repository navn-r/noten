import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Database from '../components/DatabaseHandler';
import {DataContext} from '../components/DataContext';
import {AuthContext} from '../components/AuthContext';
import Colors from '../constants/Colors';
import ProfileScreen from './ProfileScreen';
import OverviewScreen from './OverviewScreen';
import CalculatorScreen from './CalculatorScreen';
import database from '@react-native-firebase/database';
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const [data, setData] = useState();

  if (user !== null) {
    Database.setData(user.uid, user.displayName); //inits the user
  }

  useEffect(() => {
    if (user !== null && user !== undefined) {
      const subscriber = database()
        .ref(`/users/${user.uid}`)
        .on('value', async s => {
          try {
            if(s !== undefined && s !== null) {
            let data = await s.val();
            if(data !== undefined && data !== null) {
              setData(JSON.stringify(data));
            }
            }
          } catch (e) {
            console.log('Error:', e);
          }
        });
      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [data]);

  return (
    <DataContext.Provider value={{data}}>
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          const iconColor = focused ? Colors.yellow : color;
          const iconSize = focused ? size + 2 : size;
          if (route.name === 'Profile') {
            iconName = 'user-cog';
          } else if (route.name === 'Overview') {
            iconName = 'graduation-cap';
          } else if (route.name === 'Calculator') {
            iconName = 'calculator';
          }
          return (
            <FontAwesomeIcon
              icon={['fas', iconName]}
              color={iconColor}
              size={iconSize}
            />
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: Colors.gray,
          borderTopWidth: 0,
        },
        activeTintColor: Colors.yellow,
      }}>
  
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    </DataContext.Provider>
  );
};

export default HomeScreen;

/*
screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconColor = focused ? Colors.yellow : color;
          const iconSize = focused ? size + 2 : size;
          if (route.name === "Profile") {
            iconName = "user-cog";
          } else if (route.name === "Overview") {
            iconName = "home";
          }
          return (
              <FontAwesomeIcon icon={['fab', iconName]} color={iconColor} size={iconSize} />
            );
          },
        })}
*/
