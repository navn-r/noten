import dotenv from "dotenv";
import firebase from 'firebase/app';
import 'firebase/auth';

dotenv.config();

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const AuthService = {
  login: async (callBack: Function) => {
    const user = await auth.signInWithPopup(googleAuthProvider).catch(err => console.error(err));
    callBack(user);
  },
  logout: () => {
    //TODO: WORK ON
    console.log('logout');
  }
};