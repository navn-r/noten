import { IonAvatar, IonRippleEffect } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks';

/** ChatLine */

const Avatar = styled(IonAvatar)`
  width: 2rem;
  height: 2rem;
  transform: translateY(0.75rem);
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin: 1.375rem 0;
`;

const Bubble = styled.div`
  padding: 0.625rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Left = styled(Line)`
  ${Bubble} {
    background-color: var(--ion-color-dark-shade);
    border-bottom-left-radius: 0;
    margin-left: 0.5rem;
  }
`;

const Right = styled(Line)`
  flex-direction: row-reverse;

  ${Bubble} {
    background-color: var(--ion-color-success-shade);
    border-bottom-right-radius: 0;
    margin-right: 0.5rem;
    min-width: 3.25rem;
    position: relative;
    overflow: hidden;
  }
`;

interface IChatLineProps {
  message: React.ReactChild;
  value?: number;
  onShowModal?: () => void;
}

const ICON_URL = `${process.env.PUBLIC_URL}/assets/icon/logo-circle.png`;

const ChatLine: React.FC<IChatLineProps> = ({
  message,
  value,
  onShowModal,
}) => {
  const { user } = useAuth();

  return (
    <>
      <Left>
        <Avatar slot="start">
          <img src={ICON_URL} alt="" />
        </Avatar>
        <Bubble>{message}</Bubble>
      </Left>
      {value && (
        <Right>
          <Avatar slot="end">
            <img src={user?.photoURL ?? ICON_URL} alt="" />
          </Avatar>
          <Bubble className="ion-activatable" onClick={onShowModal}>
            {value}%
            <IonRippleEffect />
          </Bubble>
        </Right>
      )}
    </>
  );
};

export default ChatLine;
