import 'react-native-gesture-handler';
import React, {useState, useEffect, useMemo} from 'react';

import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';


import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';

import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './components/AuthContext';
import LogInScreen from './screens/LogInScreen';
import HomeScreen from './screens/HomeScreen';
import Colors from './constants/Colors';

//Pacifico-Regular.ttf
//ProductSans-Regular.ttf
const Stack = createStackNavigator();

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.appdata"],
  webClientId: '938088356921-g6i0b4evjt57qbuqpfe227jpcf3le2gg.apps.googleusercontent.com',
});

library.add(fab, fas);

export default function App() {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  auth().onAuthStateChanged((user) => {
    setUser(user);
    if(user !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  const authContext = useMemo(() => ({
    logIn: async () => {
      try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
      } catch(e) {
        console.log(e);
      }
    },
    logOut: async () => {
      try {
        await auth().signOut();
        await GoogleSignin.revokeAccess();
      } catch (e) {
        console.log('Error: ', e);
      }
    },
  }));

 
  return (
    <AuthContext.Provider value={{user, authContext}}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'left',
            headerTintColor: Colors.yellow,
            headerStyle: {
              backgroundColor: '#000000',
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
            },
            headerTitle: 'Noten',
            headerTitleStyle: {
              fontFamily: 'Pacifico-Regular',
              fontSize: 30,
            },
          }}>
          {isLoggedIn ? (
            <Stack.Screen name="Home" component={HomeScreen} />
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LogInScreen}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
