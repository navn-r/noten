import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Login.css';
import { AuthService } from '../../services/Auth';

const Login: React.FC = () => {

  const onLogin = () => {
    AuthService.login((user: any) => console.log(user));
  }

  const onLogout = () => {
    AuthService.logout(() => console.log('Deleted'));
  }

  const onUser = () => {
    console.log(AuthService.getCurrentUser());
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
        <IonButton onClick={onLogout} color="primary">Sign out</IonButton>
        <IonButton onClick={onUser} color="primary">User</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
