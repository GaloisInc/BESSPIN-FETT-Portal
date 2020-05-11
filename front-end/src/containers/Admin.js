import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AdminDash from '../components/AdminDash';
import Users from '../components/Users';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Admin() {
  return (
    <div className="flex-col h-full portal-container">
      <Header isAdmin />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar isAdmin />
        <div className="bg-blue-700 w-full">
          <Route path="/admin-portal/dashboard" component={AdminDash} />
          <Route path="/admin-portal/users" component={Users} />
          <Redirect from="/admin-portal/" to="/admin-portal/dashboard" />
        </div>
      </div>
    </div>
  );
}
