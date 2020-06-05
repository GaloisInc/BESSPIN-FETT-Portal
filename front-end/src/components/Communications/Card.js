/* eslint-disable */

import React, { useState, useEffect } from 'react';
import AdminNav from './Admin/Navigation';
import ResearcherNav from './Researcher/Navigation';
import AdminBroadcast from './Admin/Broadcast';
import AdminHistory from './Admin/History';
import AdminMessages from './Admin/Messages';
import ResearcherAnnouncements from './Researcher/Announcements';
import ResearcherMessages from './Researcher/Messages';
import Spinner from '../Spinner';

const Card = props => {
	
	const [currentContent, setCurrentContent] = useState('');
	const [currentNav, setCurrentNav] = useState('');
	const [activeNav, setActiveNav] = useState('');
	
	
useEffect(() => {
  if (props.userType == 'admin') {
    console.log('Admin User Type');
    setActiveNav('Broadcast');
    setCurrentNav('Admin');
    setCurrentContent('Broadcast');
  }

  if (props.userType == 'researcher') {
    console.log('Researcher User Type');
    setActiveNav("Announcements");
    setCurrentNav("Researcher");
    setCurrentContent("Announcements");
  }
}, []);  
 
  const changeContentHandler = active => {
    	console.log(`Clicked Navigation Item ${active}`);
    	setCurrentContent(active);
		console.log(props);
  	};
  
  const renderContent = () => {
	  console.log(currentContent);
	  	return(
		 	<>
			 	{currentContent === 'Broadcast' && <AdminBroadcast update={changeContentHandler}/>}
			 	{currentContent === 'History' && <AdminHistory />}
			 	{currentContent === 'Messages' && <AdminMessages />}
			 	{currentContent === 'Announcements' && <ResearcherAnnouncements />}
			 	{currentContent === 'ResMessages' && <ResearcherMessages />}
			</>
	  	);
  }
  	
  const renderNav = () => {
	  console.log(currentNav);
	  	return(
		 	<div>
			{currentNav === 'Admin' && <AdminNav update={changeContentHandler} setNav={currentContent} />}
			{currentNav === 'Researcher' && <ResearcherNav update={changeContentHandler} setNav={currentContent} />}
			</div>
	  	);
  }
  
  console.log(currentContent);
  
  const renderedNav = renderNav();
  const renderedContent = renderContent();
  
  return (
    <div className="bg-blue-600" style={{ width: '500px', minHeight: '630px' }}>
      <div className="flex flex-row items-center justify-between pl-4 mt-2 mb-4">
        <h5 className="ml-4 text-gray-200 uppercase">{renderedNav}</h5>
      </div>
      <div className="self-center m-8 mt-2 bg-blue-700" style={{ minHeight: '500px' }}>
        {renderedContent}
      </div>
    </div>
  );
};

export default Card;
