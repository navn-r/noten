import {
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import "./PageTitle.css";

interface TitleProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageTitle: React.FC<TitleProps> = ({ title, subtitle, showBack }) => {
  const history = useHistory();
  return (
    <IonToolbar id="title" mode="md">
      {showBack && (
        <IonButtons slot="start">
          <IonButton onClick={() => history.push('/home')}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
      )}
      <IonTitle>{title}</IonTitle>
      {subtitle && <IonTitle size="small">{subtitle}</IonTitle>}
    </IonToolbar>
  );
};

export default PageTitle;
