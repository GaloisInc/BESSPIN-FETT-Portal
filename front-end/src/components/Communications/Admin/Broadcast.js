/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable */

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
    <form className="flex flex-col items-center w-auto m-8">
      <label htmlFor="team" className="mt-8 text-gray-200 font-body">
        Select Team
      </label>
      <select
        id="team"
        value={team}
        onChange={event => setTeam(event.target.value)}
        className="block w-full p-1 leading-tight text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded shadow hover:border-gray-300 focus:outline-none focus:shadow-outline"
      >
        <option value="Team 1">Team 1</option>
        <option value="Team 2">Team 2</option>
        <option value="Team 3">Team 3</option>
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
    </form>
  );
}
