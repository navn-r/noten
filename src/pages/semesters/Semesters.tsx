import { IonAlert, IonButton, IonInput } from "@ionic/react";
import React, { useEffect, useState } from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import { PartialModalWrapper } from "../../components/partial-modal-wrapper/PartialModalWrapper";
import "./Semesters.css";

const LOGO_URL = process.env.PUBLIC_URL + "/assets/icon/logo-circle.png";

const MOCK_SEMESTERS = [
  {
    id: "-M6vO_oW4hzj9B2_d-ie",
    name: "Fall 2020",
    average: 85,
    grade: "A+",
    gpa: 4.0,
    numCourses: 1,
  },
  {
    id: "-M70HLw6GQAkUS913_zX",
    name: "Summer 2020",
    average: 75,
    grade: "B",
    gpa: 3.0,
    numCourses: 4,
  },
  {
    id: "-M71HLw6GQAkUS924_zV",
    name: "Winter 2020",
    average: 65,
    grade: "C-",
    gpa: 2.0,
    numCourses: 3,
  },
];

type SemesterModalData = { id: string; title: string } | null;

interface SemesterModalProps {
  showModal: boolean;
  onSuccess: () => void;
  onDismiss: () => void;
  id?: string;
  title?: string;
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
      setShowSuccess(detail && detail.value);
      setName(detail!.value ?? "");
    };

    /**
     * TODO: Setup after db
     */
    const onEditSemester = () => {
      console.log(id, name);
      onSuccess();
    }

    /**
     * TODO: Setup after db
     */
    const onDeleteSemester = () => {
      console.log("pls don't delete", id);
    }

    return (
      <PartialModalWrapper
        showModal={showModal}
        title={(!!id ? "Edit" : "New") + " Semester"}
        showSuccess={showSuccess}
        onSuccess={onEditSemester}
        onDismiss={() => {
          if (!!title) setName(title);
          onDismiss();
        }}
      >
        <div className="semester-input-wrapper">
          <IonInput
            clearInput={true}
            value={name}
            inputmode="text"
            type="text"
            placeholder="Enter Semester Name"
            onIonChange={({ detail }) => onChangeName(detail)}
          />
        </div>
        {!!id && <IonButton expand="block" color="danger" mode="ios" onClick={() => setShowAlert(true)}>Delete Semester</IonButton>}
        {!!id && <IonAlert 
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={`Delete ${name}?`}
          message="Are you sure? Courses, Categories, and Grades will be deleted."
          buttons={[
            {
              text: 'Cancel',
              cssClass: 'alert-cancel',
              role: 'cancel',
              handler: () => setShowAlert(false)
            },
            {
              text: 'Proceed',
              cssClass: 'alert-proceed',
              handler: onDeleteSemester
            }
          ]}
        />}
      </PartialModalWrapper>
    );
  }
);

const Semesters: React.FC = () => {
  const [current, setCurrent] = useState("-M6vO_oW4hzj9B2_d-ie");
  const [modalData, setModalData] = useState(null as SemesterModalData);
  const [showModal, setShowModal] = useState(false);

  /**
   * TODO: Setup after db
   */
  const setSemester = (id: string) => setCurrent(id);
  const editSemester = (semData: any) => {
    setModalData(semData);
    setShowModal(true);
  };
  const numSemesters = 3;
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
              <div className="accordion-card semester-info">
                <div className="semester-info-row">
                  <span>Grade:</span> <span>Average:</span> <span>GPA:</span>
                  <span>Courses:</span>
                  <span>{grade}</span> <span>{average.toFixed(2)}%</span>
                  <span>{gpa.toFixed(2)}</span> <span>{numCourses}</span>
                </div>
              </div>
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
