import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminDash from '../components/Admin/AdminDash';
import Users from '../components/Admin/Users/Users';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

const Admin = props => {
  const { isAdmin, isLoggedIn, handleRoleSwitch } = props;
  const checkAuth = isLoggedIn && isAdmin;

  return (
    <div className="flex-col h-full portal-container">
      <Header isAdmin={isAdmin} handleRoleSwitch={handleRoleSwitch} />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar isAdmin={isAdmin} />
        <div className="w-full bg-blue-700">
          {checkAuth ? (
            <>
              <Route path="/adminportal/dashboard" component={AdminDash} />
              <Route path="/adminportal/users" component={Users} />
              <Route exact path="/adminportal" render={() => <Redirect to="adminportal/dashboard" />} />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </div>
      </div>
    </div>
  );
};
export default Admin;

Admin.propTypes = {
  isAdmin: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  handleRoleSwitch: PropTypes.func,
};
