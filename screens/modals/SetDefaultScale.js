import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import * as Database from '../../components/DatabaseHandler';
import {config} from '../../assets/config.json';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AccordianItem from '../../components/AccordianItem';

const SetDefaultScale = ({route, navigation}) => {
  const {id, userScale} = route.params;
  const {letterScale, percentScale} = config.gradeScales;
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Button color={Colors.red} onPress={() => navigation.goBack()} size={1.5}>
          <FontAwesomeIcon icon={['fas', 'times']} color={Colors.red} size={15}/>
        </Button>
        <View  style={{alignItems: 'center', flex: 1, paddingRight: '5%'}}>
          <Text style={styles.title}>Grade Scales</Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList data={config.gradeScales.gpaScales}
        keyExtractor={(item, index) => item.key.toString()}
          renderItem={({item}) => {
            return (
              <AccordianItem item={item} expanded={
                item.scale.map((grade, i) => {
                return (
                  <View key={i} style={{paddingTop: 10, flexDirection: 'row'}}>
                    <View style={styles.container}>
                    <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.25}}>
                    <Text style={styles.text}>{letterScale[i]}</Text>
                    </View>
                    </View>
                    </View>
                    <View style={styles.container}>
                    <Text style={{...styles.text, color: Colors.green}}>{grade}</Text>
                    </View>
                    <View style={styles.container}>
                    <Text style={styles.text}>{percentScale[i]}%</Text>
                    </View>
                  </View>
                );
              })}
              isCurrent={item.key === userScale}
              onPress={async () => {
                await Database.setDefaultScale(id, item.key);
                navigation.goBack();}}/>
            );
          }}
        />
      </View>
      <Text style={styles.hint} >
        Tap the name of the scale to select it.
      </Text>
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

  container: {flex: 1, alignItems: 'center'},

  hint: {
    color: Colors.light_gray,
    fontSize: 15,
    fontFamily: 'ProductSans-Regular',
  },
});

export default SetDefaultScale