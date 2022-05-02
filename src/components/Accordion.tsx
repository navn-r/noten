import { IonIcon, IonRippleEffect } from '@ionic/react';
import {
  checkmarkCircle,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PassFailBadge from './PassFailBadge';
import { useLongPress } from '../hooks';

const Card = styled.div<{ isOpen?: boolean; shouldMerge?: boolean }>`
  display: grid;
  margin: 1rem 0;
  grid-template-columns: 8fr 2fr;
  overflow: hidden;
  position: relative;
  background-color: ${({ color }) => `var(--ion-color-${color ?? 'step-100'})`};
  border-radius: 20px;

  ${({ isOpen, shouldMerge }) =>
    isOpen &&
    shouldMerge &&
    css`
      margin-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      & + div {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    `}
`;

const Title = styled.div`
  height: 100%;
  padding: 1rem;
  align-items: center;
  display: flex;
`;

const ToggleContainer = styled.div`
  height: 100%;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Toggle = styled(IonIcon)`
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 0.5rem;
`;

const Icon = styled(IonIcon)`
  height: 1.25rem;
  width: 1.25rem;
`;

interface IAccordionProps {
  title: string;
  isCurrent?: boolean;
  isPassFail?: boolean;
  children?: React.ReactChild;
  onPress?: () => void;
  onLongPress?: () => void;
  color?: string;
  shouldMerge?: boolean;
}

const Accordion: React.FC<IAccordionProps> = ({
  title,
  isCurrent,
  isPassFail,
  children,
  onPress,
  onLongPress,
  shouldMerge,
  color,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const longPress = useLongPress(onLongPress, onPress ?? toggleOpen, 500);

  return (
    <>
      <Card color={color} isOpen={isOpen} shouldMerge={shouldMerge}>
        {onPress ? (
          <Title className="ion-activatable" {...longPress}>
            {title}
            <IonRippleEffect />
          </Title>
        ) : (
          <Title>{title}</Title>
        )}
        <ToggleContainer onClick={toggleOpen}>
          {isPassFail && <PassFailBadge />}
          {isCurrent && <Icon icon={checkmarkCircle} color="success" />}
          <Toggle
            icon={isOpen ? chevronUpOutline : chevronDownOutline}
            color="light"
          />
        </ToggleContainer>
      </Card>
      {isOpen && children}
    </>
  );
};

export default Accordion;
