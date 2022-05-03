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
 * Firebase Provider for Google Authentication.
 *
 * @static
 */
const provider = new GoogleAuthProvider();

/**
 * Helper type for Auth state.
 */
type IAuthState = Pick<
  Noten.IAuth<UserInfo>,
  'user' | 'authenticated' | 'loading'
>;

const AuthContext = createContext<Noten.IAuth<UserInfo>>(
  null as unknown as Noten.IAuth<UserInfo>
);

export const useAuth = (): Noten.IAuth<UserInfo> => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  /** App global auth state */
  const [authState, setAuthState] = useState<IAuthState>({
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

  /**
   * Logs the user in with Google.
   *
   * @returns Promise that resolves on successful login
   */
  function login(): Promise<void> {
    return signInWithPopup(auth, provider)
      .then(() => setPersistence(auth, browserLocalPersistence))
      .catch(console.error);
  }

  /**
   * Logs the user out.
   *
   * @returns Promise that resolves on successful logout
   */
  function logout(): Promise<void> {
    return signOut(auth).catch(console.error);
  }

  const value: Noten.IAuth<UserInfo> = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
