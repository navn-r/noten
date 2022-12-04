import { IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalProps, Modal, PassFailBadge } from '../../components';
import { Course, UID } from '../../types';

const PassFailButton = styled.div`
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 9fr 1fr;

  ion-button {
    margin: 0;
    width: 100%;
  }
`;

export type CourseModalData = { id?: UID } & Omit<
  Course,
  'semesterKey' | 'numCatagories'
>;

interface CourseModalProps extends ModalProps {
  data: CourseModalData;
  setData: React.Dispatch<React.SetStateAction<CourseModalData>>;
  deleteCourse: (key: UID) => Promise<void>;
  openCategoryModal: (key: UID) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  data,
  setData,
  deleteCourse,
  openCategoryModal,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setShowSuccess(data.name.trim().length > 0);
  }, [data]);

  return (
    <Modal
      partial={!data.id}
      showModal={showModal}
      showSuccess={showSuccess}
      title={`${data.id ? 'Edit' : 'New'} Course`}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <Modal.Input
        label="Course Name"
        placeholder="e.g. Intro to Computer Science"
        value={data.name}
        onChange={(name) => setData({ ...data, name })}
      />
      <Modal.Input
        label="Instructor (Optional)"
        placeholder="e.g. Ada Lovelace"
        value={data.instructor}
        onChange={(instructor) => setData({ ...data, instructor })}
      />
      <Modal.Input.OuterWrapper>
        <Modal.Input.Label>Pass/Fail</Modal.Input.Label>
        <PassFailButton>
          <Modal.Input.Button
            onClick={() => setData({ ...data, passFail: !data.passFail })}
            mode="ios"
            color={data.passFail ? 'danger' : 'success'}
          >
            Course will {data.passFail && 'not '}
            count towards GPA
          </Modal.Input.Button>
          <PassFailBadge />
        </PassFailButton>
      </Modal.Input.OuterWrapper>
      {!!data.id && (
        <>
          <Modal.Input.Button
            expand="block"
            color="tertiary"
            mode="ios"
            onClick={() => openCategoryModal(data.id ?? '')}
          >
            Modify Categories
          </Modal.Input.Button>
          <Modal.Input.Separator />
          <Modal.Input.Button
            expand="block"
            color="danger"
            mode="ios"
            onClick={() => setShowAlert(true)}
          >
            Delete Course
          </Modal.Input.Button>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={`Delete ${data.name}?`}
            message="Are you sure? <strong>THIS ACTION IS IRREVERSIBLE!</strong> <br /><br /> All Categories, and Grades will be deleted."
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
                handler: () => {
                  setShowAlert(false);
                  deleteCourse(data.id || '');
                },
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
