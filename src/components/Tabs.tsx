import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { calculator, school } from 'ionicons/icons';
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Calculator, Course, Dashboard } from '../pages';

const TabsContainer = styled(IonTabs)`
  ion-tab-button {
    --color-selected: var(--ion-color-secondary);
  }
`;

const Tabs: React.FC = () => (
  <TabsContainer>
    <IonRouterOutlet id="main">
      <Route path="/home/dashboard" element={<Dashboard />} />
      <Route path="/home/dashboard/course/:id" element={<Course />} />
      <Route path="/home/calculator" element={<Calculator />} />
      <Route path="*" element={<Navigate to="/home/dashboard" />} />
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
