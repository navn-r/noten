import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { calculator, school } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import styled from 'styled-components';
/* Pages */
import Calculator from '../pages/Calculator';
import Course from '../pages/Course';
import Dashboard from '../pages/Dashboard';

const TabsContainer = styled(IonTabs)`
  ion-tab-button {
    --color-selected: var(--ion-color-secondary);
  }
`;

const Tabs: React.FC = () => (
  <TabsContainer>
    <IonRouterOutlet id="main">
      <Route path="/home/dashboard" exact>
        <Dashboard />
      </Route>
      <Route path="/home/dashboard/course/:id" exact>
        <Course />
      </Route>
      <Route path="/home/calculator" exact>
        <Calculator />
      </Route>
      <Redirect to="/home/dashboard" from="/home/dashboard/course" exact />
      <Redirect to="/home/dashboard" from="/home" exact />
      <Redirect to="/home/dashboard" from="/" exact />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="dashboard" href="/home/dashboard">
        <IonIcon icon={school} />
      </IonTabButton>
      <IonTabButton tab="calculator" href="/home/calculator">
        <IonIcon icon={calculator} />
      </IonTabButton>
    </IonTabBar>
  </TabsContainer>
);

export default Tabs;
