import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Button = (props) => {
  const styles = StyleSheet.create({
    button: {
      flexDirection: "row",
      padding: 3 * props.size,
      borderWidth: 2,
      borderRadius: 3 * props.size,
      alignItems: "center",
      justifyContent: 'center',
      borderColor: props.color,
    },
    title: {
      fontFamily: "ProductSans-Regular",
      fontSize: 4 * props.size,
      color: props.color,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ ...styles.button, ...props.style }}>
        {props.children}
        <Text style={styles.title}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
