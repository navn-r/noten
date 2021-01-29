import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calculator, school } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";
/* Tabbed Pages */
import Calculator from "../../pages/calculator/Calculator";
import Dashboard from "../../pages/dashboard/Dashboard";

const TabRoot: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="main">
        <Route path="/home/dashboard" exact>
          <Dashboard />
        </Route>
        <Route path="/home/calculator" exact>
          <Calculator />
        </Route>
        <Redirect to="/home/dashboard" from="/home" exact />
        <Redirect to="/home/dashboard" from="/" exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/home/dashboard">
          <IonIcon icon={school}></IonIcon>
        </IonTabButton>
        <IonTabButton tab="calculator" href="/home/calculator">
          <IonIcon icon={calculator}></IonIcon>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabRoot;
