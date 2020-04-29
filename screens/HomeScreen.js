import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import Colors from '../constants/Colors';
import ProfileScreen from './ProfileScreen';
import OverviewScreen from './OverviewScreen';
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          const iconColor = focused ? Colors.yellow : color;
          const iconSize = focused ? size + 2 : size;
          if (route.name === 'Profile') {
            iconName = 'user-cog';
          } else if (route.name === 'Overview') {
            iconName = 'home';
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
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
