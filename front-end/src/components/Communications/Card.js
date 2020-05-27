/* eslint-disable */

import React, { Component } from 'react';
import AdminNav from './Admin/Navigation';
import ResearcherNav from './Researcher/Navigation';
import AdminBroadcast from './Admin/Broadcast';
import AdminHistory from './Admin/History';
import AdminMessage from './Admin/Message';
import ResearcherAnnouncements from './Researcher/Announcements';

const Card = props => {
  let currentContent = null;
  let currentNav = null;
  let activeTitle = null;

  const changeActiveHandler = active => {
    console.log(`Clicked Navigation Item ${active}`);
    currentContent = <AdminHistory />;
  };

  if (props.userType == 'admin') {
    console.log('Admin User Type');
    activeTitle = 'Broadcast';
    currentNav = <AdminNav current={activeTitle} update={changeActiveHandler} />;
    if (!currentContent) {
      currentContent = <AdminBroadcast />;
    }
  }

  if (props.userType == 'researcher') {
    console.log('Researcher User Type');
    activeTitle = 'Announcements';
    currentNav = <ResearcherNav current={activeTitle} update={changeActiveHandler} />;
    currentContent = <ResearcherAnnouncements />;
  }

  return (
    <div className="bg-blue-600" style={{ width: '500px', minHeight: '630px' }}>
      <div className="flex flex-row justify-between pl-4 mt-2 items-center mb-4">
        <h5 className="uppercase text-gray-200 ml-4">{currentNav}</h5>
      </div>
      <div className="self-center bg-blue-700 m-8 mt-2" style={{ minHeight: '500px' }}>
        {currentContent}
      </div>
    </div>
  );
};

export default Card;
