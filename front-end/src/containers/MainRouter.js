import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
// import Home from './Home';
import Login from './Login';
// import LoginReceiver from './LoginReceiver';
// import PrivateRoute from '../components/PrivateRoute';
import NoMatch from '../components/NoMatch';
import Logout from '../components/Logout';
import Admin from './Admin';
import Bounty from './Bounty';

const MainRouter = props => {
  const { login } = props;

  return (
    <Switch>
      <Route exact path="/" render={() => <Login login={login} />} />
      {/* <Route path="/authorizing" render={rest => <LoginReceiver {...rest} auth={auth} setStorage={setStorage} />} /> */}
      {/* <PrivateRoute path="/home" component={Home} isAdmin={isAdmin} {...props} /> */}
      <Route path="/adminportal" render={() => <Admin {...props} />} />
      <Route path="/bountyportal" render={() => <Bounty {...props} />} />
      <Route path="/logout" render={() => <Logout {...props} />} />
      <Route component={NoMatch} />
    </Switch>
  );
};
export default MainRouter;

MainRouter.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};
