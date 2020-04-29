import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../components/AuthContext";


const OverviewScreen = () => {
  const { user } = useContext(AuthContext);
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Overview</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "black",
    paddingTop: 10,
  },

  text: {
    color: "white",
    fontSize: 25,
    fontFamily: "ProductSans-Regular",
  },
});
export default OverviewScreen;
