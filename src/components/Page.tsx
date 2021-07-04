import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

const Title = styled(IonTitle)`
  font-family: var(--title);
  color: var(--logo-title);
  font-size: 1.25rem;
  height: 3rem;
`;

const Content = styled(IonContent)`
  --padding-end: 0.5rem;
  --padding-start: 0.5rem;
`;

const Page: React.FC = ({ children }) => (
  <IonPage>
    <IonHeader mode="md">
      <IonToolbar>
        <Title>Noten</Title>
      </IonToolbar>
    </IonHeader>
    <Content fullscreen>{children}</Content>
  </IonPage>
);

export default Page;
