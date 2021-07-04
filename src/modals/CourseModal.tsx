import { IonAlert, IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  IModalProps,
  InputLabel,
  Modal,
  ModalInput,
  OuterInputWrapper,
} from '../components/Modal';
import PassFailBadge from '../components/PassFailBadge';

const Separator = styled.div`
  margin: 2rem auto;
  width: 90%;
  border-bottom: 1px solid var(--ion-color-medium-shade);
`;

const PassFailButton = styled.div`
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 9fr 1fr;
`;

export type CourseModalData = {
  id: string;
  title: string;
  instructor: string;
  passFail: boolean;
} | null;

interface ICourseModalProps extends IModalProps {
  id?: string;
  instructor?: string;
  passFail?: boolean;
}

export const CourseModal: React.FC<ICourseModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  title,
  instructor: initialInstructor,
  passFail: initialPassFail,
  id,
}) => {
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [instructor, setInstructor] = useState('');
  const [passFail, setPassFail] = useState(false);

  useEffect(() => {
    setName(title ?? '');
    setShowSuccess(!!id);
    setInstructor(initialInstructor ?? '');
    setPassFail(!!initialPassFail);
  }, [title, id, initialInstructor, initialPassFail]);

  const onChangeCourseName = (text: string) => {
    setName(text);
    setShowSuccess(!!name.trim().length);
  };

  const onChangeInstructorName = (text: string) => {
    setInstructor(text);
  };

  // TODO
  const onDeleteCourse = () => setShowAlert(false);
  const onModifyCategories = () => console.log('modifying categories');

  return (
    <Modal
      partial={!id}
      showModal={showModal}
      showSuccess={showSuccess}
      title={`${id ? 'Edit' : 'New'} Course`}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <ModalInput
        label="Course Name"
        placeholder="e.g. Intro to Computer Science"
        value={name}
        onChangeText={(text) => onChangeCourseName(text)}
      />
      <ModalInput
        label="Instructor (Optional)"
        placeholder="e.g. Ada Lovelace"
        value={instructor}
        onChangeText={(text) => onChangeInstructorName(text)}
      />
      <OuterInputWrapper>
        <InputLabel>Pass/Fail</InputLabel>
        <PassFailButton>
          <IonButton
            onClick={() => setPassFail(!passFail)}
            mode="ios"
            color={passFail ? 'danger' : 'success'}
          >
            Course will {passFail && 'not '}
            count towards GPA
          </IonButton>
          <PassFailBadge />
        </PassFailButton>
      </OuterInputWrapper>

      {!!id && (
        <>
          <IonButton
            expand="block"
            color="tertiary"
            mode="ios"
            onClick={onModifyCategories}
          >
            Modify Categories
          </IonButton>
          <Separator />
          <IonButton
            expand="block"
            color="danger"
            mode="ios"
            onClick={() => setShowAlert(true)}
          >
            Delete Course
          </IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={`Delete ${title}?`}
            message="Are you sure? <br /> Categories, and Grades will be deleted."
            buttons={[
              {
                text: 'Cancel',
                cssClass: 'alert-cancel',
                role: 'cancel',
                handler: () => setShowAlert(false),
              },
              {
                text: 'Proceed',
                cssClass: 'alert-proceed',
                handler: onDeleteCourse,
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
