import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Login.css';
import { AuthService } from '../../services/Auth';

const Login: React.FC = () => {

  const onLogin = () => {
    AuthService.login((user: any) => console.log(user));
  }

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
