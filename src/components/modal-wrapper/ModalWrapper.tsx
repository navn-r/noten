import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import React from "react";
import "./ModalWrapper.css";

export interface ModalTextInputProps {
  value: string;
  label: string;
  placeholder: string;
  onChangeText: (e: any) => void;
}

export const ModalTextInput: React.FC<ModalTextInputProps> = ({
  value,
  placeholder,
  onChangeText,
  label,
}) => {
  return (
    <div className="outer-text-input-wrapper">
      <h6>{label}</h6>
      <div className="text-input-wrapper">
        <IonInput
          clearInput={true}
          value={value}
          inputmode="text"
          type="text"
          placeholder={placeholder}
          onIonChange={onChangeText}
        />
      </div>
    </div>
  );
};

export interface ModalProps {
  showModal: boolean;
  onSuccess: (e?: any) => void;
  onDismiss: (e?: any) => void;
  title?: string;
  partial?: boolean;
  showSuccess?: boolean;
  cssClass?: string;
  children?: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  title,
  partial,
  showSuccess,
  cssClass,
  children,
}) => {
  return (
    <IonModal
      isOpen={showModal}
      mode="ios"
      cssClass={cssClass ?? `${partial ? "partial-modal " : ""}modal`}
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
          <IonTitle>{title ?? "Modal Title"}</IonTitle>
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
