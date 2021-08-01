import { IonIcon, IonRippleEffect } from '@ionic/react';
import {
  checkmarkCircle,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import PassFailBadge from './PassFailBadge';
import useLongPress from './UseLongPress';

const Card = styled.div`
  display: grid;
  margin: 1rem 0;
  grid-template-columns: 8fr 2fr;
  overflow: hidden;
  position: relative;
  background-color: var(--ion-color-step-100);
  border-radius: 20px;
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
}

const Accordion: React.FC<IAccordionProps> = ({
  title,
  isCurrent,
  isPassFail,
  children,
  onPress,
  onLongPress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const longPress = useLongPress(onLongPress, onPress ?? toggleOpen, 500);

  return (
    <>
      <Card>
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
