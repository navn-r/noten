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
} from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import React from 'react';
import styled from 'styled-components';

/** Modal Text Input */

const OuterInputWrapper = styled.div`
  width: 100%;
  margin: 1.5rem 0;

  ~ ion-button {
    width: 90%;
    margin: auto;
  }
`;

const InputLabel = styled.h6`
  font-size: 0.875rem;
  padding-left: 5%;
`;

const InputWrapper = styled.div`
  display: grid;
  place-items: center;
  background-color: var(--ion-color-step-50);
  width: 90%;
  height: 5rem;
  margin: auto;
  padding: 0 1rem;
  border-radius: 20px;
`;

export interface IModalInputProps {
  value: string;
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

const ModalInput = ({
  value,
  placeholder,
  onChangeText,
  label,
}: IModalInputProps) => {
  const onIonChange = (event: CustomEvent<{ value?: string | null }>): void => {
    onChangeText(event.detail?.value ?? '');
  };

  return (
    <OuterInputWrapper>
      <InputLabel>{label}</InputLabel>
      <InputWrapper>
        <IonInput
          clearInput
          value={value}
          inputmode="text"
          type="text"
          placeholder={placeholder}
          onIonChange={onIonChange}
        />
      </InputWrapper>
    </OuterInputWrapper>
  );
};

ModalInput.OuterWrapper = OuterInputWrapper;
ModalInput.Label = InputLabel;
ModalInput.Wrapper = InputWrapper;

/** Modal */

const ModalWrapper = styled(IonModal)<{ partial: boolean }>`
  .modal-wrapper {
    --height: ${({ partial }) => (partial ? '69' : '100')}%;
    margin-top: auto;
  }
`;

const Title = styled(IonTitle)`
  text-align: center;
`;

const Toolbar = styled(IonToolbar)`
  --min-height: 4rem;
`;

const Content = styled(IonContent)`
  --background: var(--ion-color-step-100);
`;

export interface IModalProps {
  showModal?: boolean;
  onSuccess: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onDismiss: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  title?: string;
  partial?: boolean;
  showSuccess?: boolean;
  cssClass?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  showModal,
  onSuccess,
  onDismiss,
  title,
  partial,
  showSuccess,
  cssClass,
  children,
}: IModalProps): React.ReactElement => (
  <ModalWrapper
    isOpen={!!showModal}
    mode="ios"
    partial={!!partial}
    cssClass={cssClass}
    swipeToClose
    onDidDismiss={onDismiss}
  >
    <IonHeader>
      <Toolbar>
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
        <Title>{title ?? 'Modal Title'}</Title>
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
      </Toolbar>
    </IonHeader>
    <Content>{children}</Content>
  </ModalWrapper>
);

Modal.Input = ModalInput;
