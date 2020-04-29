import React, { useContext } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import { AuthContext } from "../components/AuthContext";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';


const LogInScreen = () => {
  const { authContext } = useContext(AuthContext);
  const logInHandler = async () => {
    try {
      await authContext.logIn();
    } catch (error) {
      console.log("Error from LogInScreen:", error);
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.body}>
      <Text style={styles.title}>Noten</Text>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Button
          size={5}
          color={Colors.yellow}
          title=" | Sign in"
          onPress={logInHandler}
        >
          <FontAwesomeIcon icon={['fab', 'google']} color={Colors.yellow} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "black",
  },

  body: {
    flex: 2,
    width: "90%",
    marginBottom: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    height: 200,
    width: 200,
    margin: 20,
  },

  title: {
    fontFamily: 'Pacifico-Regular',
    fontSize: 50,
    color: Colors.yellow,
  },
});

export default LogInScreen;
