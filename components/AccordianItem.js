import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const AccordianItem = props => {
  const [isSelected, setIsSelected] = useState(false);
  const expandHandler = () => setIsSelected(!isSelected);
  return (
    <>
      <Card style={styles.header}>
        <TouchableOpacity style={{flex: 1}} onPress={props.onPress}>
          <Text style={styles.title}>{props.item.name}</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.isCurrent ? ( <FontAwesomeIcon icon={['fas', 'check-circle']} color={Colors.green} size={20} /> ) : (<></>)}
          <Button
            color={'white'}
            onPress={expandHandler}
            size={2}
            style={{borderWidth: 0, paddingLeft: 20}}>
            <FontAwesomeIcon
              icon={['fas', isSelected ? 'chevron-up' : 'chevron-down']}
              color={'white'}
              size={20}
            />
          </Button>
        </View>
      </Card>
      <Card
        style={
          isSelected
            ? {width: '100%', paddingHorizontal: 10, paddingBottom: 10}
            : {}
        }>
        {isSelected ? props.expanded : <></>}
      </Card>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ProductSans-Regular',
  },
});

export default AccordianItem;
