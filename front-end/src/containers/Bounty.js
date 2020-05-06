import React from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import BountyDash from '../components/BountyDash';
import BountyLaunch from '../components/BountyLaunch';
import Learn from '../components/Learn';

export default function Bounty() {
  return (
    <>
      <h1>Bounty Hunter's Portal</h1>
      <ul>
        <li>
          <Link to="/bounty-portal/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/bounty-portal/learn">Learn</Link>
        </li>
        <li>
          <Link to="/bounty-portal/launch">Launch</Link>
        </li>
      </ul>
      <Route path="/bounty-portal/dashboard" component={BountyDash} />
      <Route path="/bounty-portal/launch" component={BountyLaunch} />
      <Route path="/bounty-portal/learn" component={Learn} />
      <Redirect from="/bounty-portal/" to="/bounty-portal/dashboard" />
    </>
  );
}
