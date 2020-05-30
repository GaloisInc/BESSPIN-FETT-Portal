/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { createAnnouncement } from '../../../services/api/announcements';
import { getTeams } from '../../../services/api/user';


export default function Broadcast() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState('');
  const [vulnurability, setVulnurability] = useState('');
  const [description, setDescription] = useState('');

  const fetchTeams = async () => {
    try {
      const teams = await getTeams();
      console.log(teams);
      setTeams(teams);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teamOptions = Array.isArray(teams)? teams.map(team => {
    return (<option value={`${team.UserName}`}>{`${team.UserName}`}</option>)
  }) : '';

  const handleSubmit = event => {
    event.preventDefault();
    const newAnnouncement = {
      Team: selectedTeam,
      Type: vulnurability,
      Payload: description,
    }
    createAnnouncement(newAnnouncement);
  };
  return (
    <div className="flex flex-col items-center w-auto m-8">
      <label htmlFor="team" className="mt-8 text-gray-200 font-body">
        Select Team
      </label>
      <select
        id="team"
        value={selectedTeam}
        onChange={event => setSelectedTeam(event.target.value)}
        className="block w-full p-1 leading-tight text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded shadow hover:border-gray-300 focus:outline-none focus:shadow-outline"
      >
        {teamOptions}
      </select>
      <label htmlFor="vulnurability" className="mt-8 text-gray-200 font-body">
        Vulnerability
      </label>
      <input
        id="vulnurability"
        value={vulnurability}
        onChange={event => setVulnurability(event.target.value)}
        className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid"
      />
      <label htmlFor="description" className="mt-8 text-gray-200 font-body">
        Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        rows="7"
        className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid"
      />
      <button
        className="w-full px-2 py-1 mt-8 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-gray-300"
        type="submit"
        onClick={event => handleSubmit(event)}
      >
        Send
      </button>
    </div>
  );
}
