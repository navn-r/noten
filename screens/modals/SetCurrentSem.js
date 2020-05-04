import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import * as Database from '../../components/DatabaseHandler';
import {config} from '../../assets/config.json';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const SetCurrentSem = ({navigation}) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Current Semesters</Text>
      <Button
        title="Press Me"
        color={Colors.blue}
        onPress={() => navigation.goBack()}
        size={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingTop: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
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
});


export default SetCurrentSem