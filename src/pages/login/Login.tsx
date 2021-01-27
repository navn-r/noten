import { IonButton, IonContent, IonIcon } from '@ionic/react';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import Header from '../../components/header/Header';
import {logoGoogle} from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const onLogin = useCallback((e: any) => {
    e.preventDefault();
    login(() => history.push('/dashboard'));
  }, [history, login]);

  return (
    <Header>
      <IonContent fullscreen>
        <div className="inner">
          <img id="logo" src={process.env.PUBLIC_URL + '/assets/icon/logo.png'} alt=""/>
          <IonButton onClick={onLogin} shape="round" color="primary"><IonIcon size="small" slot="start" icon={logoGoogle}/>Sign in</IonButton>
        </div>
      </IonContent>
    </Header>
  );
};

export default Login;
