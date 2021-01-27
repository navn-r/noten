import { IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import "./Header.css";

const Header: React.FC = ({ children }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Noten</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </IonPage>
  );
};

export default Header;
