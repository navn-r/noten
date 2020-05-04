import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';

const AddSemester = ({navigation}) => {
    const [isComplete, setIsComplete] = useState(false);
  return (
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
          <Text style={styles.title}>New Semester</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>Name</Text>
        <Text style={styles.text}>Start Date:</Text>
        <Text style={styles.text}>End Date:</Text>
      </View>
    </View>
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

  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default AddSemester;
