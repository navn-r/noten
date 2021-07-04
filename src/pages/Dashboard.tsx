import React, { useState } from 'react';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import Page from '../components/Page';
import PageTitle from '../components/PageTitle';
import { CourseModal, CourseModalData } from '../modals/CourseModal';
import {
  MOCK_COURSES,
  MOCK_COURSE_GRADE,
  MOCK_SEMESTERS,
} from '../models/mocks';

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<CourseModalData>(null);

  // TODO: setup after db
  const addNewCourse = () => {
    setShowModal(true);
  };
  // TODO fix
  // prettier-ignore
  const editCourse = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setModalData(data);
    setShowModal(true);
  };

  const openCourse = (id: string) => {
    console.log('Open Course', id);
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
      <InfoGrid
        data={{
          cGPA: MOCK_COURSE_GRADE.gpa.toFixed(2),
          Average: `${MOCK_COURSE_GRADE.average.toFixed(2)}%`,
          GPA: MOCK_COURSE_GRADE.gpa.toFixed(2),
        }}
      />
      {MOCK_SEMESTERS &&
        MOCK_COURSES.filter((m) => m.instructor.length).map(
          ({ id, name, instructor, passFail }) => (
            <Accordion
              key={id}
              onPress={() => openCourse(id)}
              isPassFail={passFail}
              title={name}
              onLongPress={() =>
                editCourse({
                  id,
                  title: name,
                  instructor,
                  passFail,
                })
              }
            >
              <InfoGrid
                data={{
                  Grade: MOCK_COURSE_GRADE.grade,
                  Average: `${MOCK_COURSE_GRADE.average.toFixed(2)}%`,
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
