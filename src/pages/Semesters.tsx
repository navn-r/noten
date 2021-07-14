import React, { useState } from 'react';
import styled from 'styled-components';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import Page from '../components/Page';
import { SemesterModal, SemesterModalData } from '../modals/SemesterModal';
import { MOCK_SEMESTERS } from '../mocks';

const LOGO_URL = `${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`;

const EmptyPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: 100%;

  img {
    width: 20rem;
    height: 20rem;
    filter: opacity(0.06) saturate(0);
    user-select: none;
  }
`;

const Semesters: React.FC = () => {
  const [current, setCurrent] = useState('-M6vO_oW4hzj9B2_d-ie');
  const [modalData, setModalData] = useState<SemesterModalData>(null);
  const [showModal, setShowModal] = useState(false);

  // TODO: setup after db
  const numSemesters = 3;
  const setSemester = (id: string) => setCurrent(id);
  const addSemester = () => {
    setShowModal(true);
  };

  // TODO: fix
  // prettier-ignore
  const editSemester = (semData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
    <Page>
      <Page.Title
        title="Semesters"
        addNewHandler={addSemester}
        subtitle={
          numSemesters
            ? 'Tap to select. Long press to modify.'
            : 'You currently have no semesters.'
        }
        showBack
      />
      {numSemesters ? (
        MOCK_SEMESTERS.map(
          ({ id, name: title, average, grade, gpa, numCourses }) => (
            <Accordion
              key={id}
              title={title}
              onPress={() => setSemester(id)}
              onLongPress={() => editSemester({ id, title })}
              isCurrent={current === id}
            >
              <InfoGrid
                data={{
                  Grade: grade,
                  Average: `${average.toFixed(2)}%`,
                  GPA: gpa.toFixed(2),
                  Courses: numCourses,
                }}
              />
            </Accordion>
          )
        )
      ) : (
        <EmptyPage>
          <img src={LOGO_URL} alt="" />
        </EmptyPage>
      )}
      <SemesterModal
        onDismiss={onDismiss}
        onSuccess={onSuccess}
        showModal={showModal}
        {...modalData}
      />
    </Page>
  );
};

export default React.memo(Semesters);
