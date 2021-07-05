import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu';
import ProtectedRoute from './components/ProtectedRoute';
import Tabs from './components/Tabs';
import { AuthProvider } from './firebase/AuthContext';
import { DataProvider } from './firebase/DataContext';
import { GradeScale } from './pages/GradeScale';
import Login from './pages/Login';
import Semesters from './pages/Semesters';

const App: React.FC = () => (
  <AuthProvider>
    <DataProvider>
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
    </DataProvider>
  </AuthProvider>
);

export default App;
