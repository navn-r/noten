import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  UserInfo,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig';

/**
 * Main App Authentication Interface.
 *
 * @see https://firebase.google.com/docs/reference/js/v9/auth.userinfo.md
 */
interface Auth {
  /**
   * Authenticated user's basic info.
   * Includes the Firebase UID used to fetch the user data.
   */
  user: UserInfo | null;
  /**
   * Check if user is authenticated/logged-in.
   */
  authenticated: boolean;
  /**
   * Check if user auth data is loading.
   */
  loading: boolean;
  /**
   * Logs the user in with Google.
   *
   * @returns Promise that resolves on successful login
   */
  login: () => Promise<void>;
  /**
   * Logs the user out.
   *
   * @returns Promise that resolves on successful logout
   */
  logout: () => Promise<void>;
}

/**
 * Helper type for Auth state.
 */
type AuthState = Pick<Auth, 'user' | 'authenticated' | 'loading'>;

/**
 * Firebase Provider for Google Authentication.
 *
 * @static
 */
const provider = new GoogleAuthProvider();

const login = () =>
  signInWithPopup(auth, provider)
    .then(() => setPersistence(auth, browserLocalPersistence))
    .catch(console.error);

const logout = () => signOut(auth).catch(console.error);

const AuthContext = createContext(null as unknown as Auth);

export const useAuth = (): Auth => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  /** App global auth state */
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    /**
     * Local Auth sync loop.
     *
     * Local state is never mutated on its own,
     * instead when Firebase auth changes, local state
     * gets fetched and synced.
     *
     * @see https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
     */
    const subscriber = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user: user && {
          ...user.providerData[0],
          /**
           * Use the Firebase UID, not the Google Provider.
           *  - Adapted for compatibility in v1.0
           */
          uid: user.uid,
        },
        authenticated: !!user,
        loading: false,
      });
    });
    /** Disconnect on unMount */
    return () => subscriber();
  }, []);

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
