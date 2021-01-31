import {
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { addOutline, arrowBackOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import "./PageTitle.css";

interface TitleProps {
  title: string;
  addNewHandler?: () => void;
  subtitle?: string;
  showBack?: boolean;
}

const PageTitle: React.FC<TitleProps> = ({ title, subtitle, showBack, addNewHandler }) => {
  const history = useHistory();
  return (
    <IonToolbar id="title" mode="md">
      {showBack && (
        <IonButtons slot="start">
          <IonButton onClick={() => history.replace('/home/dashboard')}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
      )}
      <IonTitle>{title}</IonTitle>
      {subtitle && <IonTitle size="small">{subtitle}</IonTitle>}
      {!!addNewHandler && 
        <IonButtons slot="end">
        <IonButton onClick={addNewHandler}>
          <IonIcon icon={addOutline} />
        </IonButton>
      </IonButtons>
      }
    </IonToolbar>
  );
};

export default PageTitle;
