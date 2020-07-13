/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { createAnnouncement, getAnnouncement } from '../../../services/api/announcements';
import PropTypes from 'prop-types'

const Broadcast = ({ update, announceID }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [vulnurability, setVulnurability] = useState('');
  const [description, setDescription] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  
  const fetchAnnouncement = async announceID => {
    try {
    const response = await getAnnouncement(announceID);
      setVulnurability(response.vulnerability);
      setDescription(response.description);
      
    } catch (error) {
      console.log(`Error fetching announcement: ${error}`);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsDisabled(true);
    const newAnnouncement = {
      Team: selectedTeam,
      Type: vulnurability,
      Payload: description,
    }
    const response = await createAnnouncement(newAnnouncement);
    if (response && response.serverStatus === 2){
      update('History')
    }
    setIsDisabled(false);
  };

  useEffect(() => {
    fetchAnnouncement(announceID);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  return (
    <div className="flex flex-col items-center w-auto m-8 pb-8">
      <label htmlFor="vulnurability" className="self-start mt-8 text-gray-200 font-body">
        Subject
      </label>
      <input
        id="vulnurability"
        value={vulnurability}
        onChange={event => setVulnurability(event.target.value)}
        className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
      />
      <label htmlFor="description" className="self-start mt-8 text-gray-200 font-body">
        Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        rows="7"
        className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
      />
      <button
        className={`w-full px-2 py-1 mt-8 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-teal-500 hover:text-gray-200 font-body ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
        type="submit"
        disabled={isDisabled}
        onClick={event => handleSubmit(event)}
      >
        Send
      </button>
    </div>
  );
}

export default Broadcast 

Broadcast.propTypes = {
  update: PropTypes.func,
}
