/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from 'react';

export default function Broadcast() {
  const [team, setTeam] = useState('');
  const [vulnurability, setVulnurability] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log('submitting vulnurability');
    // Todo implement ==> search
  };
  return (
    <div className="bg-blue-600" style={{ width: '500px', minHeight: '630px' }}>
      <div className="flex flex-row pl-4 mt-2 items-center mb-4">
        <h5 className="uppercase text-gray-200 mr-4">
          <a href="">Announcements</a>
        </h5>
        <h5 className="uppercase text-gray-200">
          <a href="">Messages</a>
        </h5>
      </div>
      <div className="self-center bg-blue-700 m-8" style={{ minHeight: '500px' }}>
        <form className="flex flex-col items-center w-auto m-8">
          <label htmlFor="team" className="text-gray-200 font-body mt-8">
            Select Team
          </label>
          <select
            id="team"
            value={team}
            onChange={event => setTeam(event.target.value)}
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1 block border hover:border-gray-300 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Team 1">Team 1</option>
            <option value="Team 2">Team 2</option>
            <option value="Team 3">Team 3</option>
          </select>
          <label htmlFor="vulnurability" className="text-gray-200 font-body mt-8">
            Vulnerability
          </label>
          <input
            id="vulnurability"
            value={vulnurability}
            onChange={event => setVulnurability(event.target.value)}
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1"
          />
          <label htmlFor="description" className="text-gray-200 font-body mt-8">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            rows="7"
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1"
          />
          <button
            className="bg-gray-200 hover:bg-gray-300 text-blue-700 font-bold py-1 px-2 rounded uppercase w-full mt-8"
            type="submit"
            onClick={event => handleSubmit(event)}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
