import { IonAlert, IonButton, IonIcon } from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  IModalProps,
  InputLabel,
  Modal,
  ModalInput,
  OuterInputWrapper,
} from "../components/Modal";

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

const PassFailIcons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
  justify-content: space-around;

  ion-icon {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

export type CourseModalData = {
  id: string;
  title: string;
  instructor: string;
  passFail: boolean;
} | null;

interface CourseIModalProps extends IModalProps {
  id?: string;
  instructor?: string;
  passFail?: boolean;
}

export const CourseModal: React.FC<CourseIModalProps> = ({
  showModal,
  onSuccess,
  onDismiss,
  title,
  instructor: initialInstructor,
  passFail: initialPassFail,
  id,
}) => {
  const [name, setName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [instructor, setInstructor] = useState("");
  const [passFail, setPassFail] = useState(false);

  useEffect(() => {
    setName(title ?? "");
    setShowSuccess(!!id);
    setInstructor(initialInstructor ?? "");
    setPassFail(!!initialPassFail);
  }, [title, id, initialInstructor, initialPassFail]);

  const onChangeCourseName = (detail: any) => {
    setName(detail!.value ?? "");
    setShowSuccess(!!name.trim().length);
  };

  const onChangeInstructorName = (detail: any) => {
    setInstructor(detail!.value ?? "");
  };

  // TODO
  const onDeleteCourse = () => setShowAlert(false);
  const onModifyCategories = () => console.log("modifying categories");

  return (
    <Modal
      partial={!id}
      showModal={showModal}
      showSuccess={showSuccess}
      title={(!!id ? "Edit" : "New") + " Course"}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <ModalInput
        label="Course Name"
        placeholder="e.g. Intro to Computer Science"
        value={name}
        onChangeText={({ detail }) => onChangeCourseName(detail)}
      />
      <ModalInput
        label="Instructor (Optional)"
        placeholder="e.g. Ada Lovelace"
        value={instructor}
        onChangeText={({ detail }) => onChangeInstructorName(detail)}
      />
      <OuterInputWrapper>
        <InputLabel>Pass/Fail</InputLabel>
        <PassFailButton>
          <IonButton
            onClick={setPassFail.bind(null, !passFail)}
            mode="ios"
            color={passFail ? "danger" : "success"}
          >
            Course will {passFail && "not "}count towards GPA
          </IonButton>
          <PassFailIcons>
            <IonIcon icon={checkmarkCircle} color="success" />
            <IonIcon icon={closeCircle} color="danger" />
          </PassFailIcons>
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
                text: "Cancel",
                cssClass: "alert-cancel",
                role: "cancel",
                handler: () => setShowAlert(false),
              },
              {
                text: "Proceed",
                cssClass: "alert-proceed",
                handler: onDeleteCourse,
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
