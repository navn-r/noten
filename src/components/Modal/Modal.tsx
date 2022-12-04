import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Formik, FormikValues } from 'formik';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import ModalInput from './ModalInput';

/**
 * `cssClass` prop is in the docs, but typescript is complaining
 *
 * @see https://ionicframework.com/docs/api/modal#modaloptions
 */
const ModalWrapper = styled(IonModal)<{ cssClass?: string }>``;

const Title = styled(IonTitle)`
  text-align: center;
`;

const Toolbar = styled(IonToolbar)`
  --min-height: 4rem;
`;

const Content = styled(IonContent)`
  --background: var(--ion-color-step-100);
`;

interface ModalProps {
  title: string;
  showModal: boolean;
  partial?: boolean;
  cssClass?: string;
  initialValues: FormikValues;
  validationSchema: any; // Yup type
  onSuccess: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onDismiss: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  children: React.ReactNode[];
}

export type BaseModalProps = Pick<
  ModalProps,
  'showModal' | 'onSuccess' | 'onDismiss'
>;

export const Modal = ({
  title,
  showModal,
  partial,
  cssClass,
  initialValues,
  validationSchema,
  onSuccess,
  onDismiss,
  children,
}: ModalProps): React.ReactElement => {
  const partialOptions = partial
    ? {
        breakpoints: [0.69, 1],
        initialBreakpoint: 0.69,
      }
    : undefined;

  return (
    <ModalWrapper
      isOpen={showModal}
      mode="ios"
      cssClass={cssClass}
      canDismiss
      onDidDismiss={onDismiss}
      {...partialOptions}
    >
      <Formik
        validateOnMount
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSuccess}
      >
        {({ isValid, handleSubmit }) => (
          <>
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
                <Title>{title}</Title>
                <IonButtons slot="end">
                  <IonButton
                    mode="md"
                    color="success"
                    disabled={!isValid}
                    type="submit"
                    onClick={
                      // React Event -> Formik Event
                      handleSubmit as unknown as MouseEventHandler<HTMLIonButtonElement>
                    }
                  >
                    <IonIcon slot="icon-only" icon={checkmarkCircle} />
                  </IonButton>
                </IonButtons>
              </Toolbar>
            </IonHeader>
            <Content>{children}</Content>
          </>
        )}
      </Formik>
    </ModalWrapper>
  );
};

Modal.Input = ModalInput;
