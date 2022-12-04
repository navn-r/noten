import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { InferType } from 'yup';
import { PassFailBadge } from '../../../components';
import { Modal } from '../../../components/Modal/Modal';

const PassFailButton = styled.div`
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 9fr 1fr;

  ion-button {
    margin: 0;
    width: 100%;
  }
`;

const PassFailInput = () => {
  const { values, validationSchema, setFieldValue } = useFormikContext();
  const value: boolean = (values as InferType<typeof validationSchema>)
    .passFail;

  return (
    <Modal.Input.OuterWrapper>
      <Modal.Input.Label>Pass/Fail</Modal.Input.Label>
      <PassFailButton>
        <Modal.Input.Button
          id="passFail"
          name="passFail"
          value={value}
          onClick={() => setFieldValue('passFail', !value)}
          mode="ios"
          color={value ? 'danger' : 'success'}
        >
          Course will {value && 'not '}
          count towards GPA
        </Modal.Input.Button>
        <PassFailBadge />
      </PassFailButton>
    </Modal.Input.OuterWrapper>
  );
};

export default PassFailInput;
