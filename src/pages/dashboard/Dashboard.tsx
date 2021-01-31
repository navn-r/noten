import React, { useState } from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import { GradeInfo, GRADE_INFO } from "../../components/grade-info/GradeInfo";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import { CourseModal, CourseModalData } from "../../modals/course-modal/CourseModal";
import {
  MOCK_COURSES,
  MOCK_COURSE_GRADE,
  MOCK_SEMESTERS
} from "../../models/mocks";
import "./Dashboard.css";


const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null as CourseModalData);

  // TODO: setup after db
  const addNewCourse = () => {
    setShowModal(true);
  };

  // @ts-ignore
  const editCourse = (data) => {
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
    <PageWrapper>
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
            <AccordionItem
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
            </AccordionItem>
          )
        )}
      <CourseModal
        showModal={showModal}
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        {...modalData}
      />
    </PageWrapper>
  );
};

export default React.memo(Dashboard);
