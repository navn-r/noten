import { menuController } from '@ionic/core'; // eslint-disable-line import/no-extraneous-dependencies
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

const EmptyPage: React.FC = React.memo(() => (
  <Empty>
    <img src={`${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`} alt="" />
  </Empty>
));

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

interface IPageTitleProps {
  title: string;
  addNewHandler?: () => void;
  subtitle?: string;
  showBack?: boolean;
  passFail?: boolean;
}

const PageTitle: React.FC<IPageTitleProps> = ({
  title,
  subtitle,
  showBack,
  addNewHandler,
  passFail,
}) => {
  const history = useHistory();
  return (
    <Toolbar mode="md">
      {showBack && (
        <IonButtons slot="start">
          <IonButton onClick={() => history.goBack()}>
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

interface IPageProps {
  hideMenu?: boolean;
}

class Page extends React.Component<IPageProps> {
  static Title: typeof PageTitle = PageTitle;

  static Empty: typeof EmptyPage = EmptyPage;

  render(): React.ReactElement {
    return (
      <IonPage>
        <IonHeader mode="md">
          <IonToolbar>
            <LogoTitle>
              {!this.props.hideMenu && (
                <IonIcon icon={menu} onClick={() => menuController.open()} />
              )}
              Noten
            </LogoTitle>
          </IonToolbar>
        </IonHeader>
        <Content fullscreen>{this.props.children}</Content>
      </IonPage>
    );
  }
}

export default Page;
