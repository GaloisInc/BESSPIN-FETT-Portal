import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import details from '../assets/details.svg';
import users from '../assets/user.svg';
import rocket from '../assets/rocket.svg';
import dashboard from '../assets/dashboard.svg';
import NavButton from './NavButton';

const Sidebar = ({ isAdmin, history }) => {
  const { pathname } = history.location;
  return (
    <div className="w-40 bg-blue-800 text-white pt-6 h-full" style={{ backgroundImage: 'linear-gradient(#1E272F, #314457)' }}>
      {isAdmin ? (
        <ul>
          <NavButton currentRoute={pathname} icon={dashboard} routeName="dashboard" path="/admin-portal/dashboard" />
          <NavButton currentRoute={pathname} icon={users} routeName="users" path="/admin-portal/users" />
        </ul>
      ) : (
        <ul>
          <NavButton currentRoute={pathname} icon={dashboard} routeName="dashboard" path="/bounty-portal/dashboard" />
          <NavButton currentRoute={pathname} icon={details} routeName="learn" path="/bounty-portal/learn" />
          <NavButton currentRoute={pathname} icon={rocket} routeName="launch" path="/bounty-portal/launch" />
        </ul>
      )}
    </div>
  );
};

export default withRouter(Sidebar);

Sidebar.propTypes = {
  isAdmin: PropTypes.bool,
  history: ReactRouterPropTypes.history,
};
