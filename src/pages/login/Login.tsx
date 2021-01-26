import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useCallback } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useHistory } from 'react-router';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const onLogin = useCallback((e: any) => {
    e.preventDefault();
    login(() => history.push('/dashboard'));
  }, [history, login]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={onLogin} color="primary">Sign in with Google</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
