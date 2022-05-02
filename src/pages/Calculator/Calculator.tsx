import { IonButton } from '@ionic/react';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Page } from '../../components';
import {
  DefaultData,
  CalculatorData,
  CalculatorKey,
  Messages,
} from './CalculatorData';
import ChatLine from './ChatLine';
import NumberModal from './NumberModal';

/** Calculator */

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ChatLineContainer = styled.div`
  margin: 1rem 0.5rem 0;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 4rem;
  column-gap: 0.5rem;
  padding: 0 0.5rem;
`;

const Button = styled(IonButton)`
  width: 100%;
`;

const Calculation = styled.span`
  color: ${({ color }) => `var(--ion-color-${color})`};
`;

const Calculator: React.FC = () => {
  const [data, setData] = useState<CalculatorData<number>>({ ...DefaultData });
  const [currentKey, setCurrentKey] = useState<CalculatorKey | null>(null);
  const [showCalculation, setShowCalculation] = useState<boolean>(false);

  const { color, grade } = useMemo(() => {
    const { goal, current, weight } = data;

    const grade = ((goal - current * (1 - weight / 100)) / weight) * 100;
    const color = grade >= 100 ? 'danger' : grade <= 0 ? 'success' : 'warning';

    return { color, grade };
  }, [data]);

  const onModalSuccess = (key: CalculatorKey, value: number) => {
    if (key) {
      setData((data) => ({ ...data, [key]: +value }));
    }

    setCurrentKey(null);
  };

  const reset = () => {
    setData({ ...DefaultData });
    setShowCalculation(false);
    setCurrentKey(null);
  };

  return (
    <Page>
      <Outer>
        <div>
          <Page.Title
            title="Grade Predictor"
            subtitle="Tap the green chat bubbles to configure."
          />
          <NumberModal
            currentKey={currentKey}
            data={data}
            onDismiss={() => setCurrentKey(null)}
            onSuccess={onModalSuccess}
          />
          <ChatLineContainer>
            {Object.entries(Messages).map(([key, value]) => (
              <ChatLine
                key={key}
                message={value}
                value={data[key as CalculatorKey]}
                onShowModal={() => setCurrentKey(key as CalculatorKey)}
              />
            ))}
            {showCalculation && (
              <ChatLine
                message={
                  <>
                    You will need to score at least&nbsp;
                    <Calculation color={color}>{grade.toFixed(2)}%</Calculation>
                  </>
                }
              />
            )}
          </ChatLineContainer>
        </div>
        <ButtonContainer>
          <Button
            onClick={() => setShowCalculation(true)}
            color="success"
            mode="ios"
          >
            Calculate
          </Button>
          <Button onClick={reset} mode="ios" color="danger">
            Reset
          </Button>
        </ButtonContainer>
      </Outer>
    </Page>
  );
};

export default Calculator;
