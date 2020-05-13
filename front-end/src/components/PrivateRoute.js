import React from 'react';

import { Redirect, Route } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const checkAuth = rest.isLoggedIn;
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
PrivateRoute.propTypes = {
  location: ReactRouterPropTypes.location,
  history: ReactRouterPropTypes.history,
  component: PropTypes.any,
};
