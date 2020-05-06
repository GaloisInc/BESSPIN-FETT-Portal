import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import AdminDash from '../components/AdminDash';
import Users from '../components/Users';

export default function Admin() {
  return (
    <>
      <h1>Admin Portal</h1>
      <ul>
        <li>
          <Link to="/admin-portal/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin-portal/users">Users</Link>
        </li>
      </ul>
      <Route path="/admin-portal/dashboard" component={AdminDash} />
      <Route path="/admin-portal/users" component={Users} />
      <Redirect from="/admin-portal/" to="/admin-portal/dashboard" />
    </>
  );
}
