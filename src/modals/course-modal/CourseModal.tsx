import { IonButton, IonIcon, IonAlert } from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { ModalProps, ModalTextInput, ModalWrapper } from "../../components/modal-wrapper/ModalWrapper";
import './CourseModal.css';

export type CourseModalData = {
  id: string;
  title: string;
  instructor: string;
  passFail: boolean;
} | null;

interface CourseModalProps extends ModalProps {
  id?: string;
  instructor?: string;
  passFail?: boolean;
}

export const CourseModal: React.FC<CourseModalProps> = ({
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
  const onModifyCategories = () => console.log('modifying categories');

  return (
    <ModalWrapper
      partial={!id}
      showModal={showModal}
      showSuccess={showSuccess}
      title={(!!id ? "Edit" : "New") + " Course"}
      onSuccess={onSuccess}
      onDismiss={onDismiss}
    >
      <ModalTextInput
        label="Course Name"
        placeholder="e.g. Intro to Computer Science"
        value={name}
        onChangeText={({ detail }) => onChangeCourseName(detail)}
      />
      <ModalTextInput
        label="Instructor (Optional)"
        placeholder="e.g. Ada Lovelace"
        value={instructor}
        onChangeText={({ detail }) => onChangeInstructorName(detail)}
      />
      <div className="outer-text-input-wrapper">
        <h6>Pass/Fail</h6>
        <div className="pass-fail-button">
          <IonButton
            onClick={setPassFail.bind(null, !passFail)}
            mode="ios"
            color={passFail ? "danger" : "success"}
          >
            Course will {passFail && "not "}count towards GPA
          </IonButton>
          <div className="pass-fail">
            <IonIcon icon={checkmarkCircle} color="success" />
            <IonIcon icon={closeCircle} color="danger" />
          </div>
        </div>
      </div>

      {!!id && (
        <>
          <IonButton
            expand="block"
            color="tertiary"
            mode="ios"
            onClick={onModifyCategories}
          >Modify Categories</IonButton>
          <div className="separator"></div>
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
    </ModalWrapper>
  );
};