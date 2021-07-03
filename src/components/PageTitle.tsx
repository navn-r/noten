import {
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline, arrowBackOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

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
}

const PageTitle: React.FC<IPageTitleProps> = ({
  title,
  subtitle,
  showBack,
  addNewHandler,
}) => {
  const history = useHistory();
  return (
    <Toolbar mode="md">
      {showBack && (
        <IonButtons slot="start">
          <IonButton onClick={() => history.replace("/home/dashboard")}>
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
    </Toolbar>
  );
};

export default PageTitle;
