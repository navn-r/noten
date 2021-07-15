import { IonAlert, IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { IModalProps, Modal } from '../components/Modal';

interface ISemesterModalProps extends IModalProps {
  id: Noten.UID;
  name: string;
  setName: React.Dispatch<string>;
  deleteSemester: (key: Noten.UID) => Promise<void>;
  updateSemester: (key: Noten.UID, name: string) => Promise<void>;
}

export const SemesterModal: React.FC<ISemesterModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  id,
  name,
  setName,
  deleteSemester,
  updateSemester,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowSuccess(!!name && name.trim().length > 0);
  }, [name]);

  return (
    <Modal
      partial
      showModal={showModal}
      title={`${id ? 'Edit' : 'New'} Semester`}
      showSuccess={showSuccess}
      onSuccess={() => {
        updateSemester(id, name);
        onSuccess();
      }}
      onDismiss={onDismiss}
    >
      <Modal.Input
        onChangeText={setName}
        value={name}
        label="Semester Name"
        placeholder="e.g. Summer 2020"
      />
      {id && (
        <>
          <IonButton
            expand="block"
            color="danger"
            mode="ios"
            onClick={() => setShowAlert(true)}
          >
            Delete Semester
          </IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={`Delete ${name}?`}
            message="Are you sure? <br /> Courses, Categories, and Grades will be deleted."
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
                  deleteSemester(id);
                  onDismiss();
                },
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
