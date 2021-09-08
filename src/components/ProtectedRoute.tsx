import { IonSpinner } from '@ionic/react';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import styled from 'styled-components';
/* Authentication */
import { useAuth, useService } from '../hooks';

interface IProtectedRouteProps extends RouteProps {
  component: JSX.LibraryManagedAttributes<
    typeof Route,
    Route['props']
  >['component'];
}

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

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { loading, authenticated } = useAuth();
  const service = useService();

  return loading || (authenticated && !service.ready) ? (
    <Container>
      <Spinner />
    </Container>
  ) : authenticated && service.ready ? (
    <Route {...rest} component={Component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default ProtectedRoute;
