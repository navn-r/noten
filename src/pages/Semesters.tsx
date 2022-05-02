import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Accordion, InfoGrid, Page } from '../components';
import { useModalData, useService } from '../hooks';
import { SemesterModal, SemesterModalData } from '../modals/SemesterModal';

const Semesters: React.FC = () => {
  const service = useService();
  const { search } = useLocation();
  const newSemester = new URLSearchParams(search).get('new');
  const [showModal, setShowModal] = useState(false);
  const { data, setData, reset } = useModalData<SemesterModalData>({
    name: '',
  });

  // Automatically open the modal if ?new=true is set
  useEffect(() => {
    setShowModal(!!newSemester);
  }, [newSemester]);

  const switchSemester = async (key: Noten.UID) => {
    await service.setSemesterKey(key);
  };

  const updateSemester = async (key: Noten.UID, name: string) => {
    if (key) {
      await service.editSemester(key, name.trim());
    } else {
      await service.createSemester(name.trim());
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
        returnToDashboard
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
