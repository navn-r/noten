import React from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Auth Guard Route */
import AuthGuardRoute from "./auth/AuthGuardRoute";
import Menu from "./components/menu/Menu";
/* Pages */
import TabRoot from "./components/tab-root/TabRoot";
import Login from "./pages/login/Login";
/* Theme variables */
import "./theme/fonts.css";
import "./theme/variables.css";
import { GradeScale } from "./pages/grade-scale/GradeScale";
import Semesters from "./pages/semesters/Semesters";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <Menu id="main" />
          <IonRouterOutlet id="main">
            <Route exact path="/login" component={Login} />
            <AuthGuardRoute path="/home" component={TabRoot} />
            <AuthGuardRoute path="/settings/set-default-scale" component={GradeScale} />
            <AuthGuardRoute path="/settings/configure-semesters" component={Semesters} />
            <Redirect to="/home" from="/" exact />
            <Redirect to="/home" from="/settings" exact />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
