import { IonContent } from "@ionic/react";
import React from "react";
import Header from "../../components/header/Header";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <Header id="main" hasMenu={true}>
      <IonContent fullscreen>
        <div className="inner"></div>
      </IonContent>
    </Header>
  );
};

export default Dashboard;
