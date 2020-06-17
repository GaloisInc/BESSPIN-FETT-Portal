/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import { CircularProgress } from '@material-ui/core';
import { createAdminUser, createTeams } from '../../../services/cognito';

const UserForm = ({ fetchUsers }) => {
  const [email, setEmail] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const headers = [{ label: 'Username', key: 'username' }, { label: 'Password', key: 'password' }];
  const csvLink = useRef();

  const handleCreateUser = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resp = await createAdminUser(email);
      setEmail('');
      fetchUsers();
      setIsLoading(false);
    } catch (error) {
      console.log(`failed to create user ${error}`);
      setIsLoading(false);
    }
  };

  const handleCSVDownload = () => {
    csvLink.current.link.click();
    setTeamNumber('');
    fetchUsers();
    setIsLoading(false);
  };

  useEffect(() => {
    if (teams && teams.length > 0) {
      setTimeout(() => handleCSVDownload(), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);

  const handleCreateTeams = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newTeams = await createTeams(teamNumber);
      setTeams(newTeams);
    } catch (error) {
      setIsLoading(false);
      console.log(`failed to create user ${error}`);
    }
  };

  return (
    <div className="mr-6 bg-blue-600" style={{ width: '400px', minHeight: '630px' }}>
      <h5 className="pt-16 pl-12 text-gray-200 uppercase">New Teams</h5>
      <form className="flex flex-col px-12 ml-4">
        <label htmlFor="teamNumber" className="mt-4 mb-1 text-gray-200 font-body">
          Number of Teams
        </label>
        <input
          type="number"
          min={1}
          id="teamNumber"
          value={teamNumber}
          onChange={event => setTeamNumber(event.target.value)}
          className="w-full p-1 pl-4 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
        />
        <button
          type="submit"
          onClick={event => handleCreateTeams(event)}
          disabled={isLoading}
          className={`w-full px-2 py-1 mt-6 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-teal-500 hover:text-gray-200 font-body ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Create Teams'}
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
          className="w-full p-1 pl-4 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
        />
        <button
          className={`w-full px-2 py-1 mt-6 font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-teal-500 hover:text-gray-200 font-body ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disable={isLoading}
          onClick={event => handleCreateUser(event)}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Send Invite'}
        </button>
      </form>
      <CSVLink ref={csvLink} style={{ display: 'none' }} data={teams} headers={headers} filename="teams.csv" />
    </div>
  );
};

export default UserForm;

UserForm.propTypes = {
  fetchUsers: PropTypes.func,
};
