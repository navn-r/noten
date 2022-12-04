import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalProps, Modal } from '../../components';
import {
  CalculatorData,
  Prompts,
  DefaultData,
  CalculatorKey,
} from './CalculatorData';

const InfoText = styled.div`
  color: var(--ion-color-medium);
  font-size: 1rem;
  width: 100%;
  text-align: center;
`;

interface NumberModalProps extends ModalProps {
  currentKey: CalculatorKey | null;
  data: CalculatorData<number>;
}

const NumberModal: React.FC<NumberModalProps> = ({
  currentKey,
  data,
  onDismiss,
  onSuccess,
}) => {
  const [title, setTitle] = useState<string>('');
  const [value, setValue] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    setShowSuccess(!!value && value >= 0 && value <= 100);
  }, [value]);

  useEffect(() => {
    if (currentKey) {
      setValue(data[currentKey]);
      setTitle(Prompts[currentKey]);
    }
  }, [currentKey, data]);

  return (
    <Modal
      partial
      showModal={!!currentKey}
      title={title}
      showSuccess={showSuccess}
      onSuccess={() => onSuccess(currentKey, value)}
      onDismiss={onDismiss}
    >
      <Modal.Input
        type="number"
        value={value}
        onChange={setValue}
        placeholder={`eg. ${DefaultData[currentKey ?? 'current']}`}
      />
      <InfoText>Enter any value between 0 and 100 (inclusive).</InfoText>
    </Modal>
  );
};

export default NumberModal;
