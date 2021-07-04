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
/* Tabbed Pages */
import Calculator from '../pages/Calculator';
import Dashboard from '../pages/Dashboard';

const TabsContainer = styled(IonTabs)`
  ion-tab-button {
    --color-selected: var(--ion-color-secondary);
  }
`;

const ROUTES = [
  {
    tab: 'dashboard',
    icon: school,
    path: '/home/dashboard',
    component: Dashboard,
  },
  {
    tab: 'calculator',
    icon: calculator,
    path: '/home/calculator',
    component: Calculator,
  },
] as const;

const Tabs: React.FC = () => (
  <TabsContainer>
    <IonRouterOutlet id="main">
      {ROUTES.map(({ path, component: Component }) => (
        <Route path={path} key={path} exact>
          <Component />
        </Route>
      ))}
      <Redirect to="/home/dashboard" from="/home" exact />
      <Redirect to="/home/dashboard" from="/" exact />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      {ROUTES.map(({ tab, path: href, icon }) => (
        <IonTabButton tab={tab} href={href} key={tab}>
          <IonIcon icon={icon} />
        </IonTabButton>
      ))}
    </IonTabBar>
  </TabsContainer>
);

export default Tabs;
