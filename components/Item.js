import React, { useContext } from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { AuthContext } from "../components/AuthContext";
import {getData} from "../components/DataHandler";

export const listItem = item => {
  return (
    <View style={styles.screen}>
      <FontAwesomeIcon
        icon={['fas', 'surprise']}
        color={Colors.orange}
        size={50}
      />
      <Text style={styles.noSemText}>No {item}s Found.</Text>
      <Text style={styles.noSemText}>Press "Add New {item}"</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSemText: {
    color: Colors.orange,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});
