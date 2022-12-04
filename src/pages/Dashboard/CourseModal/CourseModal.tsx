import { IonAlert } from '@ionic/react';
import React, { useState } from 'react';

import * as yup from 'yup';
import { BaseModalProps, Modal } from '../../../components/Modal/Modal';
import { useService } from '../../../hooks';
import PassFailInput from './PassFailInput';

const validationSchema = yup.object({
  name: yup.string().trim().required().default(''),
  instructor: yup.string().trim().optional(),
  passFail: yup.boolean().required().default(false),
});

type CourseSchema = yup.InferType<typeof validationSchema>;

export interface CourseModalData extends CourseSchema {
  id?: Noten.UID;
}

interface CourseModalProps extends BaseModalProps {
  data: CourseModalData;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  data: { id, ...data },
  showModal,
  onSuccess,
  onDismiss,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  // const service = useService();

  const deleteCourse = async () => {
    setShowAlert(false);

    if (id) {
      console.info('course deleted', id);
      // await service.deleteCourse(id);
    }

    onDismiss();
  };

  return (
    <Modal
      partial={!id?.length}
      showModal={showModal}
      title={`${id ? 'Edit' : 'New'} Course`}
      validationSchema={validationSchema}
      initialValues={{ ...data }}
      onSuccess={(values: CourseSchema) => onSuccess(!id, values)}
      onDismiss={onDismiss}
    >
      <Modal.Input
        id="name"
        name="name"
        inputMode="text"
        type="text"
        label="Course Name"
        placeholder="e.g. Intro to Computer Science"
      />
      <Modal.Input
        id="instructor"
        name="instructor"
        inputMode="text"
        type="text"
        label="Instructor (Optional)"
        placeholder="e.g. Ada Lovelace"
      />
      <PassFailInput />
      {id ? (
        <>
          <Modal.Input.Button
            expand="block"
            color="tertiary"
            mode="ios"
            onClick={() => onSuccess(true)}
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
                handler: deleteCourse,
              },
            ]}
          />
        </>
      ) : null}
    </Modal>
  );
};
