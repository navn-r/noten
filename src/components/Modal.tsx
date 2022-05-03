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
`;

const Button = styled(IonButton)`
  width: 90%;
  margin: 0 auto;
  display: grid;
`;

const InputLabel = styled.h6`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
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

const Separator = styled.div`
  margin: 2rem auto;
  width: 90%;
  border-bottom: 1px solid var(--ion-color-medium-shade);
`;
export interface IModalInputProps<T> {
  type?: 'number';
  value: T;
  onChange: (val: T) => void;
  label?: string;
  placeholder: string;
}

function ModalInput<T extends string | number>({
  type,
  value,
  placeholder,
  onChange,
  label,
}: IModalInputProps<T>) {
  return (
    <OuterInputWrapper>
      {label && <InputLabel>{label}</InputLabel>}
      <InputWrapper>
        <IonInput
          clearInput
          value={value}
          inputmode={type === 'number' ? 'decimal' : 'text'}
          type={type || 'text'}
          placeholder={placeholder}
          onIonChange={({ detail }) => onChange(detail.value as T)}
        />
      </InputWrapper>
    </OuterInputWrapper>
  );
}

ModalInput.OuterWrapper = OuterInputWrapper;
ModalInput.Label = InputLabel;
ModalInput.Wrapper = InputWrapper;
ModalInput.Separator = Separator;
ModalInput.Button = Button;

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
