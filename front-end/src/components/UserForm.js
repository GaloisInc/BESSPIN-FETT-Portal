/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from 'react';
import { createUser } from '../services/cognito';

export default function UserForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log('searching');
    // Todo implement ==> submit user
    try {
      createUser(email, username);
    } catch (error) {
      console.log(`failed to create user ${error}`);
    }
  };
  return (
    <div className="bg-blue-600 mb-8" style={{ width: '500px', minHeight: '630px' }}>
      <h5 className="uppercase text-gray-200 pl-4 pt-2">New User</h5>

      <div className="self-center bg-blue-700 mx-8 mt-4" style={{ minHeight: '500px' }}>
        <form className="flex flex-col items-center w-auto my-4 mx-8">
          <label htmlFor="username" className="text-gray-200 font-body mt-8">
            User Name
          </label>
          <input
            id="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1"
          />
          <label htmlFor="email" className="text-gray-200 font-body mt-8">
            User Email
          </label>
          <input
            id="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1"
          />
          <label htmlFor="role" className="text-gray-200 font-body mt-8">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={event => setRole(event.target.value)}
            className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1 block border hover:border-gray-300 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Admin">Admin</option>
            <option value="Researcher">Researcher</option>
          </select>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-blue-700 font-bold py-1 px-2 rounded uppercase w-full mt-8"
            type="submit"
            onClick={event => handleSubmit(event)}
          >
            Send Invite
          </button>
          <a className="self-end mt-4" href="">
            <h5 className="text-teal-500 uppercase mr-4 underline">upload csv</h5>
          </a>
        </form>
      </div>
    </div>
  );
}
