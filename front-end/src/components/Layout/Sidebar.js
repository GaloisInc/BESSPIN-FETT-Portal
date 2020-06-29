import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import details from '../../assets/details.svg';
import users from '../../assets/user.svg';
import rocket from '../../assets/rocket.svg';
import dashboard from '../../assets/dashboard.svg';
import NavButton from '../NavButton';

const Sidebar = ({ isAdmin, history }) => {
  const { pathname } = history.location;
  return (
    <div
      className="bg-blue-800 text-gray-200 pt-6"
      style={{ backgroundImage: 'linear-gradient(#1E272F, #314457)', width: '10%' }}
    >
      {isAdmin ? (
        <ul>
          <NavButton currentRoute={pathname} icon={dashboard} routeName="dashboard" path="/adminportal/dashboard" />
          <NavButton currentRoute={pathname} icon={users} routeName="users" path="/adminportal/users" />
        </ul>
      ) : (
        <ul>
          <NavButton currentRoute={pathname} icon={dashboard} routeName="dashboard" path="/bountyportal/dashboard" />
          <NavButton currentRoute={pathname} icon={details} routeName="learn" path="/bountyportal/learn" />
          <NavButton currentRoute={pathname} icon={rocket} routeName="launch" path="/bountyportal/launch" />
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
