import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Accordion, InfoGrid, Page } from '../../components';
import { useService } from '../../hooks';
import { useModalData } from '../../hooks/NewUseModalData';
import { SemesterModal, SemesterModalData } from './SemesterModal';

const Semesters: React.FC = () => {
  const service = useService();
  const { search } = useLocation();
  const newSemester = useMemo(
    () => new URLSearchParams(search).get('new'),
    [search]
  );
  const { data, showModal, openModal, closeModal } =
    useModalData<SemesterModalData>({
      name: '',
    });

  // Automatically open the modal if ?new=true is set
  useEffect(() => {
    if (newSemester === 'true') {
      openModal();
    }
  }, [openModal, newSemester]);

  return (
    <Page>
      <Page.Title
        showBack
        returnToDashboard
        title="Semesters"
        addNewHandler={() => openModal()}
        subtitle={
          service.getNumSemesters() > 0
            ? 'Tap to select. Long press to modify.'
            : 'You currently have no semesters.'
        }
      />
      {!service.getNumSemesters() && <Page.Empty />}
      <div>
        {service.getSemesters().map(([id, { name, numCourses }]) => (
          <Accordion
            key={id}
            title={name}
            onPress={() => service.setSemesterKey(id)}
            onLongPress={() => openModal({ id, name })}
            isCurrent={service.getSemesterKey() === id}
            shouldMerge
          >
            <InfoGrid
              color="step-50"
              data={{
                Grade: service.getGrade(id),
                Average: service.getAverage(id),
                GPA: service.getGPA(id),
                Courses: numCourses,
              }}
            />
          </Accordion>
        ))}
      </div>
      <SemesterModal
        data={data}
        onDismiss={closeModal}
        onSuccess={closeModal}
        showModal={showModal}
      />
    </Page>
  );
};

export default Semesters;
