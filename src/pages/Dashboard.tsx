import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import { useModalData } from '../components/Modal';
import Page from '../components/Page';
import { useService } from '../firebase/DataContext';
import { CourseModal, CourseModalData } from '../modals/CourseModal';

const Dashboard: React.FC = () => {
  const service = useService();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const { data, setData, reset } = useModalData<CourseModalData>({
    id: '',
    name: '',
    instructor: '',
    passFail: false,
  });

  const semester = service.getSemester();

  const _reset = () => {
    reset();
    setShowModal(false);
  };

  const deleteCourse = async (key: Noten.UID) => {
    await service.deleteCourse(key);
  };

  const openCourse = (id: string) => {
    history.push(`/home/dashboard/course/${id}`);
  };

  const onSuccess = async () => {
    // TODO: Category Modal
    console.log(data);
    _reset();
  };

  return (
    <Page>
      <Page.Title
        title={semester?.name ?? 'No semesters were found.'}
        subtitle={
          semester
            ? semester.numCourses > 0
              ? 'Tap to open. Long press to modify.'
              : 'Press to create a new course.'
            : 'Press to create a new semester.'
        }
        addNewHandler={() =>
          semester
            ? setShowModal(true)
            : history.replace('/settings/configure-semesters?new=true')
        }
      />
      <InfoGrid
        data={{
          cGPA: service.getCGPA(),
          Average: service.getAverage(service.getSemesterKey()),
          GPA: service.getGPA(service.getSemesterKey()),
        }}
      />
      {semester && semester.courses.length > 0 ? (
        semester.courses.map(([id, { name, instructor, passFail }]) => (
          <Accordion
            key={id}
            onPress={() => openCourse(id)}
            isPassFail={passFail}
            title={name}
            onLongPress={() => {
              setData({
                id,
                name,
                instructor,
                passFail,
              });
              setShowModal(true);
            }}
          >
            <InfoGrid
              data={{
                Grade: service.getGrade(id),
                Average: service.getAverage(id),
                GPA: service.getGPA(id),
              }}
            />
          </Accordion>
        ))
      ) : (
        <Page.Empty />
      )}
      <CourseModal
        deleteCourse={deleteCourse}
        showModal={showModal}
        onDismiss={_reset}
        onSuccess={onSuccess}
        data={data}
        setData={setData}
      />
    </Page>
  );
};

export default React.memo(Dashboard);
