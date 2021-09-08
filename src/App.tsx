import { IonApp, IonRouterOutlet, setupConfig } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import { Menu, ProtectedRoute, Tabs } from './components';
import { AuthProvider, DataProvider } from './hooks';
import { GradeScale, Login, Semesters } from './pages';

// Disable swipe to go back
setupConfig({
  mode: 'md',
});

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
