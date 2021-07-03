import React, { useState } from "react";
import Accordion from "../components/Accordion";
import { GradeInfo, GRADE_INFO } from "../components/GradeInfo";
import PageTitle from "../components/PageTitle";
import Page from "../components/Page";
import { CourseModal, CourseModalData } from "../modals/CourseModal";
import {
  MOCK_COURSES,
  MOCK_COURSE_GRADE,
  MOCK_SEMESTERS,
} from "../models/mocks";

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null as CourseModalData);

  // TODO: setup after db
  const addNewCourse = () => {
    setShowModal(true);
  };
  // TODO
  const editCourse = (data: any) => {
    setModalData(data);
    setShowModal(true);
  };

  const openCourse = (id: string) => {
    console.log("Open Course", id);
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
    <Page>
      <PageTitle
        title={MOCK_SEMESTERS[0].name}
        subtitle="Tap to open. Long press to modify."
        addNewHandler={addNewCourse}
      />
      <GradeInfo
        type={GRADE_INFO.SEMESTER_PAGE}
        data={{
          cGPA: MOCK_COURSE_GRADE.gpa.toFixed(2),
          Average: MOCK_COURSE_GRADE.average.toFixed(2) + "%",
          GPA: MOCK_COURSE_GRADE.gpa.toFixed(2),
        }}
      />
      {MOCK_SEMESTERS &&
        MOCK_COURSES.filter((m) => m.instructor.length).map(
          ({ id, name, instructor, passFail }) => (
            <Accordion
              key={id}
              onPress={openCourse.bind(null, id)}
              isPassFail={passFail}
              title={name}
              onLongPress={editCourse.bind(null, {
                id,
                title: name,
                instructor,
                passFail,
              })}
            >
              <GradeInfo
                type={GRADE_INFO.COURSE_DROPDOWN}
                data={{
                  Grade: MOCK_COURSE_GRADE.grade,
                  Average: MOCK_COURSE_GRADE.average.toFixed(2) + "%",
                  GPA: MOCK_COURSE_GRADE.gpa.toFixed(2),
                }}
              />
            </Accordion>
          )
        )}
      <CourseModal
        showModal={showModal}
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        {...modalData}
      />
    </Page>
  );
};

export default React.memo(Dashboard);
