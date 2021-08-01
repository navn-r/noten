import React, { useState } from 'react';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import { useModalData } from '../components/Modal';
import Page from '../components/Page';
import { useService } from '../firebase/DataContext';
import { SemesterModal, SemesterModalData } from '../modals/SemesterModal';

const Semesters: React.FC = () => {
  const service = useService();
  const [showModal, setShowModal] = useState(false);
  const { data, setData, reset } = useModalData<SemesterModalData>({
    name: '',
  });

  const switchSemester = async (key: Noten.UID) => {
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
    reset();
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
        service.getSemesters().map(([id, { name, numCourses }]) => (
          <Accordion
            key={id}
            title={name}
            onPress={() => switchSemester(id)}
            onLongPress={() => {
              setData({ id, name });
              setShowModal(true);
            }}
            isCurrent={service.getSemesterKey() === id}
          >
            <InfoGrid
              data={{
                Grade: service.getGrade(id),
                Average: service.getAverage(id),
                GPA: service.getGPA(id),
                Courses: numCourses,
              }}
            />
          </Accordion>
        ))
      ) : (
        <Page.Empty />
      )}
      <SemesterModal
        data={data}
        setData={setData}
        onDismiss={resetModalData}
        onSuccess={resetModalData}
        showModal={showModal}
        deleteSemester={deleteSemester}
        updateSemester={updateSemester}
      />
    </Page>
  );
};

export default React.memo(Semesters);
