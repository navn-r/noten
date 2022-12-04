import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import './App.css';
import { Menu, ProtectedRoute, Tabs } from './components';
import { AuthProvider, DataProvider } from './hooks';
import { GradeScale, Login, Semesters } from './pages';

setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <DataProvider>
      <IonApp>
        <IonReactRouter>
          <Menu id="main" />
          <IonRouterOutlet id="main">
            <Route path="/login" element={<Login />} />
            <ProtectedRoute path="/home/*" element={<Tabs />} />
            <ProtectedRoute
              path="/settings/change-grade-scale"
              element={<GradeScale />}
            />
            <ProtectedRoute
              path="/settings/configure-semesters"
              element={<Semesters />}
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </DataProvider>
  </AuthProvider>
);

export default App;
