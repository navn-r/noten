import React, {useContext} from 'react';
import {View, StyleSheet, Text, Linking, Image} from 'react-native';
import Button from '../components/Button';
import Colors from '../constants/Colors';
import Card from '../components/Card';
import {AuthContext} from '../components/AuthContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import * as Database from '../components/DatabaseHandler';
import {createStackNavigator} from '@react-navigation/stack';
import SetDefaultScale from './modals/SetDefaultScale';
import SetCurrentSem from './modals/SetCurrentSem';
import AddSemester from './modals/AddSemester';

const Stack = createStackNavigator();

const MenuScreen = ({navigation}) => {
  const {user, authContext} = useContext(AuthContext);

  const logOutHandler = async () => await authContext.logOut();
  return (
    <View style={styles.screen}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <Card style={styles.infoHeader}>
          <Image
            style={styles.icon}
            source={
              user !== null
                ? {uri: user.photoURL}
                : require('../assets/logo.png')
            }
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {user !== null ? user.displayName : 'Blvdes Arschloch!'}
            </Text>
          </View>
        </Card>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.yellow}
            size={4}
            title="Configure Semesters"
            style={{marginBottom: 15}}
            onPress={() =>
              navigation.navigate('setCurrentSemester', {id: user.uid})
            }
          />
          <Button
            color={Colors.yellow}
            size={4}
            title="Set Default Grade Scale"
            onPress={async () =>
              navigation.navigate('setDefaultScale', {
                id: user.uid,
                userScale: await Database.getCurrentScale(user.uid),
              })
            }
          />
          <View style={styles.rowButtonContainer}>
            <View style={{flex: 1, paddingHorizontal: 10}}>
            <Button
              title=" | Source Code"
              onPress={() => Linking.openURL('https://github.com/navn-r/Noten')}
              color={Colors.orange}
              size={4}>
              <FontAwesomeIcon
                icon={['fab', 'github']}
                color={Colors.orange}
                size={20}
              />
            </Button>
            </View>
            <View style={{flex: 1, paddingHorizontal: 10}}>
            <Button
              title=" | Buy me a coffee"
              onPress={() =>
                Linking.openURL('https://www.buymeacoffee.com/navinn')
              }
              color={Colors.orange}
              size={4}>
              <FontAwesomeIcon
                icon={['fas', 'coffee']}
                color={Colors.orange}
                size={20}
              />
            </Button>
            </View>
          </View>
          <Button
            title="LOG OUT"
            onPress={logOutHandler}
            color={Colors.red}
            size={5}
          />
        </View>
      </View>
      <View>
        <Text style={styles.hint}>Danke schön!</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <Stack.Navigator mode="modal" screenOptions={{headerShown: false}}>
      <Stack.Screen name="menu" component={MenuScreen} />
      <Stack.Screen name="setDefaultScale" component={SetDefaultScale} />
      <Stack.Screen name="setCurrentSemester" component={SetCurrentSem} />
      <Stack.Screen name="AddSemester" component={AddSemester} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },

  infoHeader: {
    flexDirection: 'row',
    marginVertical: 10,
  },

  buttonContainer: {
    width: '90%',
    paddingVertical: 10,
  },

  rowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 25,
    justifyContent: 'center',

  },

  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 20,
  },

  icon: {
    height: 80,
    width: 80,
    borderRadius: 360,
    margin: 30,
  },

  name: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ProductSans-Regular',
  },

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default ProfileScreen;
