import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import React from "react";
import "./PartialModalWrapper.css";

export interface PartialModalProps {
  showModal: boolean;
  onSuccess: () => void;
  onDismiss: () => void;
  title: string;
  showSuccess: boolean;
  cssClass?: string;
  children?: React.ReactNode;
}

export const PartialModalWrapper: React.FC<PartialModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  title,
  showSuccess,
  cssClass,
  children,
}) => {
  return (
    <IonModal
      isOpen={showModal}
      mode="ios"
      cssClass={cssClass ?? "partial-modal"}
      swipeToClose={true}
      onDidDismiss={onDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              mode="md"
              color="danger"
              fill="clear"
              shape="round"
              onClick={onDismiss}
            >
              <IonIcon slot="icon-only" icon={closeCircle} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              mode="md"
              color="success"
              disabled={!showSuccess}
              onClick={onSuccess}
            >
              <IonIcon slot="icon-only" icon={checkmarkCircle} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonModal>
  );
};
