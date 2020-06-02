/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { createAdminUser, createTeams } from '../../../services/cognito';

const UserForm = ({ fetchUsers }) => {
  const [email, setEmail] = useState('');
  const [teamNumber, setTeamNumber] = useState('');

  const handleCreateUser = async event => {
    event.preventDefault();
    try {
      const resp = await createAdminUser(email);
      console.log('created', resp);
      setEmail('');
      fetchUsers();
    } catch (error) {
      console.log(`failed to create user ${error}`);
    }
  };

  const handleCreateTeams = event => {
    event.preventDefault();
    try {
      createTeams(teamNumber);
    } catch (error) {
      console.log(`failed to create user ${error}`);
    }
  };

  return (
    <div className="mb-4 bg-blue-600" style={{ width: '400px', minHeight: '630px' }}>
      <h5 className="pt-16 pl-12 text-gray-200 uppercase">New Teams</h5>
      <form className="flex flex-col px-12 ml-4">
        <label htmlFor="teamNumber" className="mt-4 mb-1 text-gray-200 font-body">
          Number of Teams
        </label>
        <input
          type="number"
          id="teamNumber"
          value={teamNumber}
          onChange={event => setTeamNumber(event.target.value)}
          className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
        />
        <button
          type="submit"
          onClick={event => handleCreateTeams(event)}
          className="w-full px-2 py-1 mt-6 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-gray-300 font-body"
        >
          Create Teams
        </button>
      </form>
      <h5 className="pt-12 pl-12 text-gray-200 uppercase">New Admin</h5>
      <form className="flex flex-col px-12 ml-4">
        <label htmlFor="email" className="mt-4 mb-1 text-gray-200 font-body">
          User Email
        </label>
        <input
          id="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
        />
        <button
          className="w-full px-2 py-1 mt-6 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-gray-300 font-body"
          type="submit"
          onClick={event => handleCreateUser(event)}
        >
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default UserForm;

UserForm.propTypes = {
  fetchUsers: PropTypes.func,
};
