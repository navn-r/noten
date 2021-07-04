import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './auth/AuthContext';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* App style */
import './App.css';
/* Protected Route */
import ProtectedRoute from './auth/ProtectedRoute';
import Menu from './components/Menu';
/* Pages */
import Tabs from './components/Tabs';
import Login from './pages/Login';
import { GradeScale } from './pages/GradeScale';
import Semesters from './pages/Semesters';

const App: React.FC = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <Menu id="main" />
        <IonRouterOutlet id="main">
          <Route exact path="/login" component={Login} />
          <ProtectedRoute path="/home" component={Tabs} />
          <ProtectedRoute
            path="/settings/change-grade-scale"
            component={GradeScale}
          />
          <ProtectedRoute
            path="/settings/configure-semesters"
            component={Semesters}
          />
          <Redirect to="/home" from="/" exact />
          <Redirect to="/home" from="/settings" exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
