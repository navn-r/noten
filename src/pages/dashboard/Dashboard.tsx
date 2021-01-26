import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import React, { useCallback } from "react";
import "./Dashboard.css";
import { useAuth } from "../../auth/AuthContext";

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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={onLogout} color="primary">logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
