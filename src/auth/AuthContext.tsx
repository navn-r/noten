import React, { createContext, useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import { auth } from "../config/Firebase.config";

const AuthContext = createContext(null as any);

export const useAuth = () => useContext(AuthContext);

/**
 * https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
 */
export const AuthProvider: React.FC = ({ children }) => {
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  const [authState, setAuthState] = useState({
    user: null as firebase.User | null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) =>
      setAuthState({
        user: newUser,
        authenticated: !!newUser,
        loading: false,
      })
    );
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await Promise.all([
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
        auth.signInWithPopup(googleAuthProvider),
      ]);
    } catch (err) {
      return console.error(err);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      return console.error(err);
    }
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
