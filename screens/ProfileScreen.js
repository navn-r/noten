import React, { useContext } from "react";
import { View, StyleSheet, Image, Text, Linking } from "react-native";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import Card from '../components/Card'
import { AuthContext } from "../components/AuthContext";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';


// props.user => GoogleUser
// user-cog font awesome5

const ProfileScreen = () => {
  const { user, authContext } = useContext(AuthContext);
  const logOutHandler = async () => await authContext.logOut();
  return (
    <View style={styles.screen}>
      <Card style={styles.infoHeader}>
        <Image style={styles.icon} source={user !== null ? { uri: user.photoURL } : require("../assets/logo.png")} />
        <View style={styles.nameContainer}>
         <Text style={styles.name}>{user !== null ? user.displayName : "NO USER FOUND"}</Text>
        </View>
      </Card>
      <View style={styles.buttonContainer}>
      <Button title=" | Source Code" onPress={() => Linking.openURL("https://github.com/navn-r/noten-app")} color={Colors.orange} size={4}>
      <FontAwesomeIcon icon={['fab', 'github']} color={Colors.orange} />
      </Button>
      <Button title="LOG OUT" onPress={logOutHandler} color={Colors.red} size={4}/>
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
    paddingTop: 10,
  },

  infoHeader: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
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
    shadowColor: 'black',
    shadowRadius: 1,

  },

  name: {
    color: "white",
    fontSize: 20,
    fontFamily: "ProductSans-Regular",
  },
});

export default ProfileScreen;
