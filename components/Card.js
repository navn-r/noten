import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Colors from "../constants/Colors";

const Card = (props) => {
    return(
        <View style={{...styles.cardContainer, ...props.style}}>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.gray,
        borderRadius: 15,
        width: '90%',
        marginVertical: 5,
    }

});

export default Card;