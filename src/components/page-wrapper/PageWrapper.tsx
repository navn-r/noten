import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import "./PageWrapper.css";

interface Props {
  children?: React.ReactNode;
}

const PageWrapper: React.FC<Props> = ({ children }) => (
  <IonPage>
    <IonHeader mode="md">
      <IonToolbar>
        <IonTitle id="header-title">Noten</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="page-content">{children}</IonContent>
  </IonPage>
);

export default React.memo(PageWrapper);
