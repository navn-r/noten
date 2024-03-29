import { IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { ModalProps, Modal } from '../../components';
import { Semester, UID } from '../../types';

export type SemesterModalData = { id?: UID } & Omit<Semester, 'numCourses'>;

interface SemesterModalProps extends ModalProps {
  data: SemesterModalData;
  setData: React.Dispatch<React.SetStateAction<SemesterModalData>>;
  deleteSemester: (key: UID) => Promise<void>;
  updateSemester: (key: UID, name: string) => Promise<void>;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  data,
  setData,
  deleteSemester,
  updateSemester,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowSuccess(data.name.trim().length > 0);
  }, [data.name]);

  return (
    <Modal
      partial
      showModal={showModal}
      title={`${data.id ? 'Edit' : 'New'} Semester`}
      showSuccess={showSuccess}
      onSuccess={() => {
        updateSemester(data.id || '', data.name);
        onSuccess();
      }}
      onDismiss={onDismiss}
    >
      <Modal.Input
        value={data.name}
        onChange={(name) => setData({ ...data, name })}
        label="Semester Name"
        placeholder="e.g. Summer 2020"
      />
      {data.id ? (
        <>
          <Modal.Input.Separator />
          <Modal.Input.Button
            expand="block"
            color="danger"
            mode="ios"
            onClick={() => setShowAlert(true)}
          >
            Delete Semester
          </Modal.Input.Button>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={`Delete ${data.name}?`}
            message="Are you sure? <strong>THIS ACTION IS IRREVERSIBLE!</strong> <br /><br /> Courses, Categories, and Grades will be deleted."
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
                  deleteSemester(data.id || '');
                  onDismiss();
                },
              },
            ]}
          />
        </>
      ) : null}
    </Modal>
  );
};
