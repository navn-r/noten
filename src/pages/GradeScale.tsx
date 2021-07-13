import React, { useState } from 'react';
import styled from 'styled-components';
import Accordion from '../components/Accordion';
import Page from '../components/Page';

export const DEFAULT_GRADE_SCALE = 2;

export const GRADE_SCALES = {
  letter: [
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'F',
  ],
  percent: [90, 85, 80, 77, 73, 70, 67, 63, 60, 57, 53, 50, 0],
  scales: [
    {
      title: '5 Point',
      scale: [5.0, 5.0, 4.7, 4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 0.0],
    },
    {
      title: '4.3 Point',
      scale: [
        4.33, 4.0, 3.67, 3.33, 3.0, 2.67, 2.33, 2.0, 1.67, 1.33, 1.0, 0.67, 0.0,
      ],
    },
    {
      title: '4 Point',
      scale: [4.0, 3.9, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0],
    },
    {
      title: '4 Point Alt.',
      scale: [4.0, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0],
    },
  ],
};

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

export const GradeScale: React.FC = () => {
  const [current, setCurrent] = useState(DEFAULT_GRADE_SCALE);

  // TODO: after setup db
  const setGradeScale = (index: number): void => {
    setCurrent(index);
  };

  return (
    <Page>
      <Page.Title
        title="Grade Scales"
        subtitle="Tap the name of the scale to select it."
        showBack
      />
      {GRADE_SCALES.scales.map(({ title, scale }, scaleIndex) => (
        <Accordion
          key={title}
          onPress={() => setGradeScale(scaleIndex)}
          title={title}
          isCurrent={current === scaleIndex}
        >
          <ScaleBody>
            {scale.map((num, index) => (
              <ScaleRow key={`${title}-scale-row-${num}`}>
                <span>{GRADE_SCALES.letter[index]}</span>
                <span>{num.toFixed(2)}</span>
                <span>{GRADE_SCALES.percent[index]}%</span>
              </ScaleRow>
            ))}
          </ScaleBody>
        </Accordion>
      ))}
    </Page>
  );
};
