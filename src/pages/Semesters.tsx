import React, { useState } from 'react';
import styled from 'styled-components';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import Page from '../components/Page';
import { useService } from '../firebase/DataContext';
import { SemesterModal } from '../modals/SemesterModal';

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
  const service = useService();

  const [modalKey, setModalKey] = useState<Noten.UID>('');
  const [modalSemesterName, setModalSemesterName] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const setSemester = async (key: Noten.UID) => {
    await service.setSemesterKey(key);
  };

  const updateSemester = async (key: Noten.UID, name: string) => {
    if (key) {
      await service.editSemester(key, name);
    } else {
      await service.createSemester(name);
    }
  };

  const deleteSemester = async (key: Noten.UID) => {
    await service.deleteSemester(key);
  };

  const resetModalData = () => {
    setModalKey('');
    setModalSemesterName('');
    setShowModal(false);
  };

  return (
    <Page>
      <Page.Title
        showBack
        title="Semesters"
        addNewHandler={() => setShowModal(true)}
        subtitle={
          service.getNumSemesters() > 0
            ? 'Tap to select. Long press to modify.'
            : 'You currently have no semesters.'
        }
      />
      {service.getNumSemesters() > 0 ? (
        service.getSemesters().map(([key, { name, numCourses }]) => (
          <Accordion
            key={key}
            title={name}
            onPress={() => setSemester(key)}
            onLongPress={() => {
              setModalKey(key);
              setModalSemesterName(name);
              setShowModal(true);
            }}
            isCurrent={service.getSemesterKey() === key}
          >
            <InfoGrid
              data={{
                // TODO
                Grade: 'A+',
                Average: `85%`,
                GPA: '4.00',
                Courses: numCourses,
              }}
            />
          </Accordion>
        ))
      ) : (
        <EmptyPage>
          <img src={LOGO_URL} alt="" />
        </EmptyPage>
      )}
      <SemesterModal
        onDismiss={resetModalData}
        onSuccess={resetModalData}
        showModal={showModal}
        id={modalKey}
        name={modalSemesterName}
        setName={setModalSemesterName}
        deleteSemester={deleteSemester}
        updateSemester={updateSemester}
      />
    </Page>
  );
};

export default React.memo(Semesters);
