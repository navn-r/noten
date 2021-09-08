import React from 'react';
import styled from 'styled-components';
import { Accordion, Page } from '../components';
import { useService } from '../hooks';

const ScaleBody = styled.div`
  display: grid;
  padding: 1rem 15%;
  margin: -0.5rem 0 0.5rem;
  row-gap: 0.5rem;
  background-color: var(--ion-color-step-50);
  border-radius: 20px;
`;

const ScaleRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);

  > span {
    display: flex;
    justify-content: center;
  }

  span:first-child {
    width: 50%;
    margin-right: auto;
    justify-content: flex-start;
  }

  span:nth-child(2) {
    color: var(--ion-color-success);
  }

  span:last-child {
    width: 50%;
    margin-left: auto;
    justify-content: center;
  }
`;

const GradeScale: React.FC = () => {
  const service = useService();

  const setGradeScale = async (index: number): Promise<void> => {
    await service.setDefaultScale(index);
  };

  return (
    <Page>
      <Page.Title
        title="Grade Scales"
        subtitle="Tap the name of the scale to select it."
        showBack
      />
      {service.gradeScale.scales.map(({ title, scale }, scaleIndex) => (
        <Accordion
          key={title}
          onPress={() => setGradeScale(scaleIndex)}
          title={title}
          isCurrent={service.getDefaultScale() === scaleIndex}
        >
          <ScaleBody>
            {scale.map((num, index) => (
              <ScaleRow
                key={`${title}-scale-row-${service.gradeScale.percent[index]}`}
              >
                <span>{service.gradeScale.letter[index]}</span>
                <span>{num.toFixed(2)}</span>
                <span>{service.gradeScale.percent[index]}%</span>
              </ScaleRow>
            ))}
          </ScaleBody>
        </Accordion>
      ))}
    </Page>
  );
};

export default GradeScale;
