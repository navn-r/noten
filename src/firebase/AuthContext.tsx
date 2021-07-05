import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { auth } from './Config';

type IAuthContextValue = IAuthProviderState & {
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

interface IAuthProviderState {
  user: firebase.User | null;
  authenticated: boolean;
  loading: boolean;
}

const DEFAULT_AUTH_STATE: IAuthProviderState = {
  user: null,
  authenticated: false,
  loading: true,
} as const;

const AuthContext = createContext<IAuthContextValue>({
  ...DEFAULT_AUTH_STATE,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const useAuth = (): IAuthContextValue => useContext(AuthContext);

/**
 * https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
 */
export const AuthProvider: React.FC = ({ children }) => {
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  const [authState, setAuthState] = useState<IAuthProviderState>({
    ...DEFAULT_AUTH_STATE,
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

  const login = async (): Promise<void> => {
    try {
      await Promise.all([
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
        auth.signInWithPopup(googleAuthProvider),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const value: IAuthContextValue = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
