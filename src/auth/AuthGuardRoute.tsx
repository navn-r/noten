import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner/FullScreenSpinner";

/* Authentication */
import { useAuth } from "./AuthContext";

interface Props extends RouteProps {
  component: any;
}

const AuthGuardRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { loading, authenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => 
       loading ? <FullScreenSpinner /> : authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AuthGuardRoute;
