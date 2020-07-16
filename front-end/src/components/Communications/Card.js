import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminNav from './Admin/Navigation';
import ResearcherNav from './Researcher/Navigation';
import AdminBroadcast from './Admin/Broadcast';
import AdminHistory from './Admin/History';
import AdminMessages from './Admin/Messages';
import ResearcherAnnouncements from './Researcher/Announcements';
import ResearcherMessages from './Researcher/Messages';

const Card = props => {
  const [currentContent, setCurrentContent] = useState('');
  const [currentNav, setCurrentNav] = useState('');
  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    if (props.userType === 'admin') {
      setActiveNav('Broadcast');
      setCurrentNav('Admin');
      setCurrentContent('Broadcast');
    }

    if (props.userType === 'researcher') {
      setActiveNav('Announcements');
      setCurrentNav('Researcher');
      setCurrentContent('Announcements');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeContentHandler = active => {
    setCurrentContent(active);
  };

  const renderContent = () => (
    <>
      {currentContent === 'Broadcast' && <AdminBroadcast update={changeContentHandler} />}
      {currentContent === 'History' && <AdminHistory />}
      {currentContent === 'Messages' && <AdminMessages />}
      {currentContent === 'Announcements' && <ResearcherAnnouncements />}
      {currentContent === 'ResMessages' && <ResearcherMessages />}
    </>
  );

  const renderNav = () => (
    <div>
      {currentNav === 'Admin' && <AdminNav update={changeContentHandler} setNav={currentContent} />}
      {currentNav === 'Researcher' && <ResearcherNav update={changeContentHandler} setNav={currentContent} />}
    </div>
  );

  const renderedNav = renderNav();
  const renderedContent = renderContent();

  return (
    <div className="col-span-5 bg-blue-600 mb-4">
      <div className="flex flex-row items-center justify-between mt-2 mb-4 pl-2">
        <h5 className="ml-4 text-gray-200 uppercase">{renderedNav}</h5>
      </div>
      <div className="self-center m-8 mt-2 bg-blue-700">{renderedContent}</div>
    </div>
  );
};

export default Card;

Card.propTypes = {
  userType: PropTypes.string,
};
