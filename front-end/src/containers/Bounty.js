import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import BountyDash from '../components/BountyDash';
import BountyLaunch from '../components/BountyLaunch';
import Learn from '../components/Learn';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Bounty() {
  return (
    <div className="flex-col h-full">
      <Header />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar />
        <div className="bg-blue-700 w-full">
          <Route path="/bounty-portal/dashboard" component={BountyDash} />
          <Route path="/bounty-portal/launch" component={BountyLaunch} />
          <Route path="/bounty-portal/learn" component={Learn} />
          <Redirect from="/bounty-portal/" to="/bounty-portal/dashboard" />
        </div>
      </div>
    </div>
  );
}
