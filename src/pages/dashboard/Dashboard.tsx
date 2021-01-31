import React from "react";
import AccordionItem from "../../components/accordion-item/AccordionItem";
import PageTitle from "../../components/page-title/PageTitle";
import PageWrapper from "../../components/page-wrapper/PageWrapper";
import { MOCK_COURSES, MOCK_COURSE_GRADE, MOCK_SEMESTERS } from "../../models/mocks";
import "./Dashboard.css";

const currentSemester = MOCK_SEMESTERS[0];

const Dashboard: React.FC = () => {
  // TODO: setup after db
  const addNewCourse = () => {
    console.log("Add New Course");
  };

  const editCourse = (id: string) => {
    console.log("Edit Course", id);
  };

  const openCourse = (id: string) => {
    console.log("Open Course", id);
  };

  return (
    <PageWrapper>
      <PageTitle
        title={currentSemester.name}
        subtitle="Tap a course to open. Long press to modify."
        addNewHandler={addNewCourse}
      />
      {currentSemester &&
        MOCK_COURSES.map(
          ({ id, instructor, name, numCategories, passFail }) => (
            <AccordionItem
              key={id}
              onPress={openCourse.bind(null, id)}
              isPassFail={passFail}
              title={name}
              onLongPress={editCourse.bind(null, id)}
            >
              <div className="accordion-card course-info">
                <div className="course-grade-info">
                <span>Grade:</span> <span>Average:</span> <span>GPA:</span>
                <span>{MOCK_COURSE_GRADE.grade}</span> <span>{MOCK_COURSE_GRADE.average.toFixed(2)}%</span>
                <span>{MOCK_COURSE_GRADE.gpa.toFixed(2)}</span>
                </div>
              </div>
            </AccordionItem>
          )
        )}
    </PageWrapper>
  );
};

export default React.memo(Dashboard);
