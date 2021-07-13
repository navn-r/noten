import { IonAlert, IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { IModalProps, Modal } from '../components/Modal';

export type SemesterModalData = { id: string; title: string } | null;

interface ISemesterModalProps extends IModalProps {
  id?: string;
}

export const SemesterModal: React.FC<ISemesterModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  id,
  title,
}) => {
  const [name, setName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setName(title ?? '');
    setShowSuccess(!!id);
  }, [id, title]);

  const onChangeName = (text: string) => {
    setShowSuccess(text.trim().length > 0);
    setName(text);
  };

  // TODO: setup after db
  const onEditSemester = () => {
    console.log(id ?? 'NEW SEMESTER', name);
    onSuccess();
  };

  // TODO: setup after db
  const onDeleteSemester = () => {
    console.log("pls don't delete", id);
  };

  return (
    <Modal
      partial
      showModal={showModal}
      title={`${id ? 'Edit' : 'New'} Semester`}
      showSuccess={showSuccess}
      onSuccess={onEditSemester}
      onDismiss={() => {
        if (title) setName(title);
        onDismiss();
      }}
    >
      <Modal.Input
        onChangeText={(text) => onChangeName(text)}
        value={name}
        label="Semester Name"
        placeholder="e.g. Summer 2020"
      />
      {!!id && (
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
            header={`Delete ${title}?`}
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
                handler: onDeleteSemester,
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
