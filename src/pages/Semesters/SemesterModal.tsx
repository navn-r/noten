import { IonAlert } from '@ionic/react';
import React, { useState } from 'react';
import * as yup from 'yup';
import { Modal, BaseModalProps } from '../../components/Modal/Modal';
import { useService } from '../../hooks';

const validationSchema = yup.object({
  name: yup.string().trim().required().default(''),
});

type SemesterSchema = yup.InferType<typeof validationSchema>;

export interface SemesterModalData extends SemesterSchema {
  id?: Noten.UID;
}

interface SemesterModalProps extends BaseModalProps {
  data: SemesterModalData;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  data,
  showModal,
  onSuccess,
  onDismiss,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const service = useService();
  const initialValues = { name: data.name || '' };

  const updateSemester = async ({ name }: SemesterSchema) => {
    if (data.id) {
      await service.editSemester(data.id ?? '', name);
    } else {
      await service.createSemester(name);
    }

    onSuccess();
  };

  const deleteSemester = async () => {
    if (data.id) {
      await service.deleteSemester(data.id);
    }

    onDismiss();
  };

  return (
    <Modal
      partial
      showModal={showModal}
      title={`${data.id ? 'Edit' : 'New'} Semester`}
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSuccess={updateSemester}
      onDismiss={onDismiss}
    >
      <Modal.Input
        id="name"
        name="name"
        inputMode="text"
        type="text"
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
            header={`Delete ${data.name ?? 'Semester'}?`}
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
                handler: deleteSemester,
              },
            ]}
          />
        </>
      ) : null}
    </Modal>
  );
};
