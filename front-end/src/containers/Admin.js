import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminDash from '../components/AdminDash';
import Users from '../components/Users';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Admin = props => {
  const { isAdmin, isLoggedIn } = props;
  const checkAuth = isLoggedIn && isAdmin;

  return (
    <div className="flex-col h-full portal-container">
      <Header isAdmin={isAdmin} />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar isAdmin={isAdmin} />
        <div className="bg-blue-700 w-full">
          {checkAuth ? (
            <>
              <Route path="/adminportal/dashboard" component={AdminDash} />
              <Route path="/adminportal/users" component={Users} />
              <Route path="/adminportal" render={() => <Redirect to="adminportal/dashboard" />} />
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
};
