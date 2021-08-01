import React from 'react';
import styled from 'styled-components';
import { IonButton, IonIcon } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { useAuth } from '../firebase/AuthContext';
import Page from '../components/Page';

const LOGO_URL = `${process.env.PUBLIC_URL}/assets/icon/logo.png`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 10rem);
`;

const Logo = styled.img`
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;
`;

const Button = styled(IonButton)`
  height: 3.5rem;
  --ion-color-primary-contrast: var(--logo-title);
`;

const Login: React.FC = () => {
  const { login } = useAuth();

  // Some problem with using react router for this --- so we fully reload
  const onLogin = async () => {
    await login();
    window.location.href = '/home';
  };

  return (
    <Page hideMenu>
      <Container>
        <Logo alt="logo" src={LOGO_URL} />
        <Button mode="ios" onClick={onLogin} shape="round" color="primary">
          <IonIcon size="small" slot="start" icon={logoGoogle} />
          Sign in
        </Button>
      </Container>
    </Page>
  );
};

export default Login;
