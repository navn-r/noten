import {
  IonButton,
  IonContent,
} from "@ionic/react";
import { useHistory } from "react-router";
import React, { useCallback } from "react";
import "./Dashboard.css";
import { useAuth } from "../../auth/AuthContext";
import Header from "../../components/header/Header";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const onLogout = useCallback(
    (e: any) => {
      e.preventDefault();
      logout(() => history.goBack());
    },
    [history, logout]
  );
  return (
    <Header>
      <IonContent fullscreen>
        <div className="inner">
        <IonButton onClick={onLogout} color="primary">
          logout
        </IonButton>
        </div>
      </IonContent>
    </Header>
  );
};

export default Dashboard;
