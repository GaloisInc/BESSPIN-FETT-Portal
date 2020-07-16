import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminDash from '../components/Admin/AdminDash';
import Users from '../components/Admin/Users/Users';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import AdminBroadcast from '../components/Admin/AdminBroadcast';

const Admin = props => {
  const { isAdmin, isLoggedIn, name } = props;
  const checkAuth = isLoggedIn && isAdmin;

  return (
    <div className="inline-flex flex-col h-full portal-container" style={{ minWidth: '100%' }}>
      <Header isAdmin={isAdmin} name={name} />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar isAdmin={isAdmin} />
        <div className="bg-blue-700 w-full" style={{ minWidth: '1px' }}>
          {checkAuth ? (
            <>
              <Route path="/adminportal/dashboard" component={AdminDash} />
              <Route path="/adminportal/users" component={Users} />
              <Route path="/adminportal/broadcast" component={AdminBroadcast} />
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
  name: PropTypes.string,
};
