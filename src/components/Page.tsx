import { menuController } from '@ionic/core/components'; // eslint-disable-line import/no-extraneous-dependencies
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { addOutline, arrowBackOutline, menu } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import PassFailBadge from './PassFailBadge';

/** Empty Page */

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: 100%;

  img {
    width: 20rem;
    height: 20rem;
    filter: opacity(0.2) saturate(0);
    user-select: none;
  }
`;

const EmptyPage: React.FC = () => (
  <Empty>
    <img src={`${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`} alt="" />
  </Empty>
);

/** Page Title */

const Toolbar = styled(IonToolbar)`
  margin: 0.5rem 0;
  --background: var(--ion-background-color);
`;

const Title = styled(IonTitle)`
  padding-left: 5px;
`;

const Subtitle = styled(Title)`
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  width: 100%;
`;

interface PageTitleProps {
  title: string;
  addNewHandler?: () => void;
  subtitle?: string;
  showBack?: boolean;
  passFail?: boolean;
  returnToDashboard?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  showBack,
  addNewHandler,
  returnToDashboard,
  passFail,
}) => {
  const history = useHistory();
  const goBack = () =>
    returnToDashboard ? history.replace('/home/dashboard') : history.goBack();

  return (
    <Toolbar mode="md">
      {showBack && (
        <IonButtons slot="start">
          <IonButton onClick={goBack}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
      )}
      <Title>{title}</Title>
      {subtitle && <Subtitle size="small">{subtitle}</Subtitle>}
      {!!addNewHandler && (
        <IonButtons slot="end">
          <IonButton onClick={addNewHandler}>
            <IonIcon icon={addOutline} />
          </IonButton>
        </IonButtons>
      )}
      {passFail && (
        <IonButtons slot="end">
          <PassFailBadge />
        </IonButtons>
      )}
    </Toolbar>
  );
};

const LogoTitle = styled(IonTitle)`
  display: flex;
  align-items: center;
  font-family: var(--title);
  color: var(--logo-title);
  font-size: 1.25rem;
  height: 3rem;

  ion-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    color: var(--ion-color-light);
    transform: translateY(4px); /* Hack-y workaround */
  }
`;

const Content = styled(IonContent)`
  --padding-end: 0.5rem;
  --padding-start: 0.5rem;
`;

interface PageProps {
  hideMenu?: boolean;
  children?: React.ReactNode;
}

const Page = ({ hideMenu, children }: PageProps): React.ReactElement => (
  <IonPage>
    <IonHeader mode="md">
      <IonToolbar>
        <LogoTitle>
          {!hideMenu && (
            <IonIcon icon={menu} onClick={() => menuController.open()} />
          )}
          Noten
        </LogoTitle>
      </IonToolbar>
    </IonHeader>
    <Content fullscreen>{children}</Content>
  </IonPage>
);

Page.Title = PageTitle;
Page.Empty = EmptyPage;

export default Page;
