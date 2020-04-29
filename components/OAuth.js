import AsyncStorage from '@react-native-community/async-storage';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

export const OAuthLogIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    await AsyncStorage.multiSet([
      ['@user_data', JSON.stringify(response.user)],
      ['@user_token', response.idToken],
    ]);
    console.log(response.user.name);
    return {
      data: response.user,
      token: response.idToken,
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

/* export const OAuthLogIn = async () => {
  try {
    const { type, accessToken } = await Google.logInAsync(config);
    if (type === "success") {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${accessToken}`
      );
      const user = await response.json();
      await AsyncStorage.multiSet([
        ["@user_data", JSON.stringify(user)],
        ["@user_token", accessToken],
      ]);
      return {
        data: user,
        token: accessToken
      };
    } else {
      //console.log("OAuth Cancelled.");
    }
  } catch (error) {
    console.log("Promise Rejected", error);
  }
}; */

/**
 * What i need to fix:
 *  - Handling promise rejection: When user hits cancel
 *  - Handle bad requests
 */
