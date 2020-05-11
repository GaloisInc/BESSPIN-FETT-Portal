import { Redirect, Route } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

export default function PrivateRoute({ component: Component, ...rest }) {
  const checkAuth = rest.loggedIn;
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
}
PrivateRoute.propTypes = {
  location: ReactRouterPropTypes.location,
  history: ReactRouterPropTypes.history,
  component: PropTypes.any,
};
