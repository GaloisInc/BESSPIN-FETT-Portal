import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminDash from '../components/AdminDash';
import Users from '../components/Users';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Admin = ({ isAdmin }) => (
  <div className="flex-col h-full portal-container">
    <Header isAdmin={isAdmin} />
    <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
      <Sidebar isAdmin={isAdmin} />
      <div className="bg-blue-700 w-full">
        <Route path="/adminportal/dashboard" component={AdminDash} />
        <Route path="/adminportal/users" component={Users} />
        <Route exact path="/adminportal" render={() => <Redirect to="adminportal/dashboard" />} />
      </div>
    </div>
  </div>
);
export default Admin;

Admin.propTypes = {
  isAdmin: PropTypes.bool,
};
