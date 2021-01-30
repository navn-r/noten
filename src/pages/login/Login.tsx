import { IonButton, IonIcon } from "@ionic/react";
import { logoGoogle } from "ionicons/icons";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import "./Login.css";

const LOGO_URL = process.env.PUBLIC_URL + "/assets/icon/logo.png";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const onLogin = useCallback(
    (e: any) => {
      e.preventDefault();
      login(() => history.replace("/home"));
    },
    [history, login]
  );

  return (
    <PageWrapper>
      <div className="inner">
        <img id="logo" alt="logo" src={LOGO_URL} />
        <IonButton mode="ios" onClick={onLogin} shape="round" color="primary">
          <IonIcon size="small" slot="start" icon={logoGoogle} />
          Sign in
        </IonButton>
      </div>
    </PageWrapper>
  );
};

export default Login;
