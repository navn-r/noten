import { IonIcon } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import React from 'react';
import styled from 'styled-components';

const PassFail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Icon = styled(IonIcon)`
  height: 1.25rem;
  width: 1.25rem;
`;

const PassFailBadge: React.FC = () => (
  <PassFail>
    <Icon icon={checkmarkCircle} color="success" />
    <Icon icon={closeCircle} color="danger" />
  </PassFail>
);

export default PassFailBadge;
