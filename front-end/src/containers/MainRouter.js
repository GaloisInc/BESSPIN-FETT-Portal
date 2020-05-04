import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Home from './Home';
import Login from './Login';
import LoginReceiver from './LoginReceiver';
import NoMatch from '../components/NoMatch';
import Logout from '../components/Logout';

const PrivateRoute = ({ component: Component, ...rest }) => {
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
};
PrivateRoute.propTypes = {
  location: ReactRouterPropTypes.location,
  history: ReactRouterPropTypes.history,
  component: PropTypes.any,
};

const MainRouter = props => {
  const { auth, isAdmin, logout, loggedIn, login, setStorage, storeId } = props;

  return (
    <Switch>
      <Route exact path="/" render={rest => <Login {...rest} auth={auth} login={login} loggedIn={loggedIn} />} />
      <Route path="/authorizing" render={rest => <LoginReceiver {...rest} auth={auth} setStorage={setStorage} />} />
      <PrivateRoute path="/home" component={Home} isAdmin={isAdmin} {...props} />
      <Route path="/logout" render={rest => <Logout {...rest} logout={logout} />} />
      <Route component={NoMatch} />
    </Switch>
  );
};
export default MainRouter;

MainRouter.propTypes = {
  auth: PropTypes.any.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  setStorage: PropTypes.func.isRequired,
  storeId: PropTypes.string,
};
