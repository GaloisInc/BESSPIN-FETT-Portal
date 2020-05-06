import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './Home';
import Login from './Login';
import LoginReceiver from './LoginReceiver';
import PrivateRoute from '../components/PrivateRoute';
import NoMatch from '../components/NoMatch';
import Logout from '../components/Logout';
import Admin from './Admin';
import Bounty from './Bounty';

const MainRouter = props => {
  const { auth, isAdmin, logout, loggedIn, login, setStorage } = props;

  return (
    <Switch>
      <Route exact path="/" render={rest => <Login {...rest} auth={auth} login={login} loggedIn={loggedIn} />} />
      <Route path="/authorizing" render={rest => <LoginReceiver {...rest} auth={auth} setStorage={setStorage} />} />
      <PrivateRoute path="/home" component={Home} isAdmin={isAdmin} {...props} />
      <Route path="/admin-portal" component={Admin} {...props} />
      <Route path="/bounty-portal" component={Bounty} {...props} />
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
};
