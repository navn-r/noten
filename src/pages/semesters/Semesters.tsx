import { IonAlert, IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import { GradeInfo, GRADE_INFO } from "../../components/grade-info/GradeInfo";
import {
  ModalProps,
  ModalTextInput,
  ModalWrapper,
} from "../../components/modal-wrapper/ModalWrapper";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import { MOCK_SEMESTERS } from "../../models/mocks";
import "./Semesters.css";

const LOGO_URL = process.env.PUBLIC_URL + "/assets/icon/logo-circle.png";

type SemesterModalData = { id: string; title: string } | null;

interface SemesterModalProps extends ModalProps {
  id?: string;
}

const SemesterModal: React.FC<SemesterModalProps> = React.memo(
  ({ showModal, onSuccess, onDismiss, id, title }) => {
    const [name, setName] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
      setName(title ?? "");
      setShowSuccess(!!id);
    }, [id, title]);

    const onChangeName = (detail: any) => {
      setShowSuccess(detail && detail.value.trim());
      setName(detail!.value ?? "");
    };

    // TODO: setup after db
    const onEditSemester = () => {
      console.log(id ?? "NEW SEMESTER", name);
      onSuccess();
    };

    // TODO: setup after db
    const onDeleteSemester = () => {
      console.log("pls don't delete", id);
    };

    return (
      <ModalWrapper
        partial
        showModal={showModal}
        title={(!!id ? "Edit" : "New") + " Semester"}
        showSuccess={showSuccess}
        onSuccess={onEditSemester}
        onDismiss={() => {
          if (!!title) setName(title);
          onDismiss();
        }}
      >
        <ModalTextInput
          onChangeText={({ detail }) => onChangeName(detail)}
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
                  text: "Cancel",
                  cssClass: "alert-cancel",
                  role: "cancel",
                  handler: () => setShowAlert(false),
                },
                {
                  text: "Proceed",
                  cssClass: "alert-proceed",
                  handler: onDeleteSemester,
                },
              ]}
            />
          </>
        )}
      </ModalWrapper>
    );
  }
);

const Semesters: React.FC = () => {
  const [current, setCurrent] = useState("-M6vO_oW4hzj9B2_d-ie");
  const [modalData, setModalData] = useState(null as SemesterModalData);
  const [showModal, setShowModal] = useState(false);

  // TODO: setup after db
  const numSemesters = 3;
  const setSemester = (id: string) => setCurrent(id);
  const addSemester = () => {
    setShowModal(true);
  };
  const editSemester = (semData: any) => {
    setModalData(semData);
    setShowModal(true);
  };
  const onSuccess = () => {
    setModalData(null);
    setShowModal(false);
  };
  const onDismiss = () => {
    setModalData(null);
    setShowModal(false);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Semesters"
        addNewHandler={addSemester}
        subtitle={
          numSemesters
            ? "Tap to select. Long press to modify."
            : "You currently have no semesters."
        }
        showBack={true}
      />
      {!!numSemesters ? (
        MOCK_SEMESTERS.map(
          ({ id, name: title, average, grade, gpa, numCourses }) => (
            <AccordionItem
              key={id}
              title={title}
              onPress={setSemester.bind(null, id)}
              onLongPress={editSemester.bind(null, { id, title })}
              isCurrent={current === id}
            >
              <GradeInfo
                type={GRADE_INFO.COURSE_DROPDOWN}
                data={{
                  Grade: grade,
                  Average: average.toFixed(2) + "%",
                  GPA: gpa.toFixed(2),
                  Courses: numCourses,
                }}
              />
            </AccordionItem>
          )
        )
      ) : (
        <div className="empty-page">
          <img src={LOGO_URL} alt="" />
        </div>
      )}
      <SemesterModal
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        showModal={showModal}
        {...modalData}
      />
    </PageWrapper>
  );
};

export default React.memo(Semesters);
