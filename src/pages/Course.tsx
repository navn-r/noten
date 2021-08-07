import { IonIcon, IonRippleEffect } from '@ionic/react';
import { addCircle, eyeOff } from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Accordion from '../components/Accordion';
import { InfoGrid } from '../components/InfoGrid';
import { useModalData } from '../components/Modal';
import Page from '../components/Page';
import useLongPress from '../components/UseLongPress';
import { useService } from '../firebase/DataContext';
import { GradeModal, GradeModalData } from '../modals/GradeModal';

/** Grade Row */

const Grade = styled.div`
  display: grid;
  grid-template-columns: 4fr repeat(3, 2fr);
  padding: 1rem;
  height: 3rem;
  overflow: hidden;
  position: relative;

  span {
    display: flex;
    align-items: center;
  }

  span:not(:nth-child(1)) {
    justify-content: flex-end;
  }

  ion-icon {
    font-size: 1rem;
  }
`;

interface IGradeRowProps {
  grade: Noten.IGrade;
  onLongPress: () => void;
}

const GradeRow: React.FC<IGradeRowProps> = ({ grade, onLongPress }) => {
  const longPress = useLongPress(onLongPress, undefined, 500);

  return (
    <Grade className="ion-activatable" {...longPress}>
      <span>{grade.name}</span>
      <span>{!grade.isIncluded && <IonIcon icon={eyeOff} />}</span>
      <span>{`${grade.score}/${grade.total}`}</span>
      <span>{grade.percent.toFixed(2)}%</span>
      <IonRippleEffect />
    </Grade>
  );
};

/** Course Page */

const GradeContainer = styled.div`
  background-color: var(--ion-color-step-50);
  margin: 0.5rem 0;
  border-radius: 20px;
  font-size: 0.75rem;
  overflow: hidden;
`;

const AddGradeButton = styled(InfoGrid.Column)`
  place-items: center;

  ion-icon {
    font-size: 2rem;
  }
`;

interface ICourseParams {
  id: Noten.UID;
}

const Course: React.FC = () => {
  const service = useService();
  const { id: courseKey } = useParams<ICourseParams>();
  const [showModal, setShowModal] = useState(false);
  const { data, setData, reset } = useModalData<GradeModalData>({
    id: '',
    name: '',
    percent: 0,
    score: 0,
    total: 0,
    isIncluded: true,
    catagoryKey: '',
  });

  const course = service.getCourse(courseKey);

  const _reset = () => {
    reset();
    setShowModal(false);
  };

  const deleteGrade = async (key: Noten.UID): Promise<void> => {
    await service.deleteGrade(key);
  };

  const onEditGrade = (key: Noten.UID, grade: Noten.IGrade): void => {
    setData({
      id: key,
      ...grade,
    });
    setShowModal(true);
  };

  const onSuccess = async () => {
    const { id, ...g } = data;
    /**
     * Calculate percentage only on creation/edit
     *   - Adapted for compatibility in v1.0
     */
    const grade: Noten.IGrade = {
      ...g,
      name: g.name.trim(),
      score: +g.score,
      total: +g.total,
      percent: (+g.score / +g.total) * 100,
    };

    if (id) {
      await service.editGrade(id, grade);
    } else {
      await service.createGrade(grade);
    }

    _reset();
  };

  return (
    <Page>
      <Page.Title
        showBack
        passFail={course?.passFail ?? false}
        title={course?.name ?? 'Course Not Found.'}
        subtitle={
          course
            ? course.instructor || 'Long press on a grade to modify.'
            : 'Press to go back to safety.'
        }
      />
      <InfoGrid
        data={{
          Grade: service.getGrade(courseKey),
          Average: service.getAverage(courseKey),
          GPA: service.getGPA(courseKey),
        }}
      />
      {course ? (
        course.categories.map(([categoryKey, category]) => (
          <Accordion key={categoryKey} title={category.name}>
            <>
              <InfoGrid
                data={{
                  Average: service.getAverage(categoryKey),
                  Weight: `${category.weight}%`,
                }}
              >
                <AddGradeButton
                  onClick={() => {
                    setData({ ...data, catagoryKey: categoryKey });
                    setShowModal(true);
                  }}
                >
                  <InfoGrid.Item>
                    <IonIcon icon={addCircle} />
                  </InfoGrid.Item>
                </AddGradeButton>
              </InfoGrid>
              <GradeContainer>
                {category.grades.map(([gradeKey, grade]) => (
                  <GradeRow
                    onLongPress={() => onEditGrade(gradeKey, grade)}
                    key={gradeKey}
                    grade={grade}
                  />
                ))}
              </GradeContainer>
            </>
          </Accordion>
        ))
      ) : (
        <Page.Empty />
      )}
      <GradeModal
        data={data}
        setData={setData}
        showModal={showModal}
        onDismiss={_reset}
        onSuccess={onSuccess}
        deleteGrade={deleteGrade}
      />
    </Page>
  );
};

export default React.memo(Course);
