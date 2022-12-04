import { IonSpinner } from '@ionic/react';
import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import styled from 'styled-components';
/* Authentication */
import { useAuth, useService } from '../hooks';

const Container = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`;

const Spinner = styled(IonSpinner)`
  width: 2rem;
  height: 2rem;
`;

const ProtectedRoute: React.FC<RouteProps> = ({ element, ...rest }) => {
  const { loading, authenticated } = useAuth();

  const service = useService();

  if (loading || (authenticated && !service.ready)) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  if (authenticated && service.ready) {
    return <Route {...rest} element={element} />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
