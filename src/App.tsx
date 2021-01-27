import React from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/fonts.css";

/* Auth Guard Route */
import AuthGuardRoute from "./auth/AuthGuardRoute";

/* Pages */
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import { AuthProvider } from "./auth/AuthContext";

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <AuthGuardRoute exact path="/dashboard" component={Dashboard} />
          <AuthGuardRoute exact path="/" component={Dashboard} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
