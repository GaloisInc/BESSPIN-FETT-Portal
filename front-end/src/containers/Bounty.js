import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import BountyDash from '../components/BountyDash';
import BountyLaunch from '../components/BountyLaunch';
import Learn from '../components/Learn';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Bounty = props => {
  const { isLoggedIn, handleRoleSwitch } = props;
  const checkAuth = isLoggedIn;

  return (
    <div className="flex-col h-full portal-container">
      <Header handleRoleSwitch={handleRoleSwitch} />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar />
        <div className="w-full bg-blue-700">
          {checkAuth ? (
            <>
              <Route path="/bountyportal/dashboard" component={BountyDash} />
              <Route path="/bountyportal/launch" component={BountyLaunch} />
              <Route path="/bountyportal/learn" component={Learn} />
              <Route exact path="/bountyportal" render={() => <Redirect to="/bountyportal/dashboard" />} />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bounty;

Bounty.propTypes = {
  isLoggedIn: PropTypes.bool,
  handleRoleSwitch: PropTypes.func,
};
