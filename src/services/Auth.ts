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
    await Promise.all([
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
      auth.signInWithPopup(googleAuthProvider)
    ]).catch(err => console.error(err));
    callBack(auth.currentUser);
  },
  logout: async (callBack: Function) => {
    await auth.signOut().catch(err => console.error(err));
    callBack();
  },
  getCurrentUser: () => {
    return auth.currentUser;
  }
};