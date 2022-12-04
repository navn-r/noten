import { IonButton, IonInput } from '@ionic/react';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { InferType } from 'yup';

const OuterWrapper = styled.div`
  width: 100%;
  margin: 1.5rem 0;
`;

const Button = styled(IonButton)<{ name?: string; value?: boolean }>`
  width: 90%;
  margin: 0 auto;
  display: grid;
`;

const Label = styled.h6`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0 5%;
`;

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  background-color: var(--ion-color-step-50);
  width: 90%;
  height: 5rem;
  margin: auto;
  padding: 0 1rem;
  border-radius: 20px;
`;

const Separator = styled.div`
  margin: 2rem auto;
  width: 90%;
  border-bottom: 1px solid var(--ion-color-medium-shade);
`;

interface ModalInputProps {
  id: string;
  inputMode: 'decimal' | 'text';
  type: 'number' | 'text';
  name: string;
  label?: string;
  placeholder: string;
}

function ModalInput<T>({
  id,
  inputMode,
  type,
  name,
  label,
  placeholder,
}: ModalInputProps) {
  const { values, handleChange, validationSchema } = useFormikContext<T>();

  return (
    <OuterWrapper>
      {label && <Label>{label}</Label>}
      <Wrapper>
        <IonInput
          id={id}
          name={name}
          value={(values as InferType<typeof validationSchema>)[name]}
          inputmode={inputMode}
          type={type}
          placeholder={placeholder}
          onIonChange={handleChange}
          clearInput
        />
      </Wrapper>
    </OuterWrapper>
  );
}

ModalInput.OuterWrapper = OuterWrapper;
ModalInput.Label = Label;
ModalInput.Wrapper = Wrapper;
ModalInput.Separator = Separator;
ModalInput.Button = Button;

export default ModalInput;
