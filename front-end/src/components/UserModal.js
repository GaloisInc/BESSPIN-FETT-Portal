/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import close from '../assets/close.svg';
import { updateUser } from '../services/cognito';

const UserModal = ({ handleClose, selectedUser }) => {
  const [email, setEmail] = useState(selectedUser.email);
  const handleUpdateUser = event => {
    event.preventDefault();
    updateUser();
  };
  return (
    <div
      className="absolute text-4xl text-gray-200 bg-blue-600"
      style={{ width: '375px', height: '360px', top: '30%', left: '50%', marginLeft: '-183px' }}
    >
      <div className="flex flex-row justify-between py-2 pl-8 pr-6 border-b-2 border-blue-800 border-b-solid ">
        <h4 className="font-medium uppercase">{selectedUser.role} user</h4>
        <button type="button" onClick={handleClose} className="focus:outline-none">
          <img src={close} alt="" />
        </button>
      </div>
      <div className="pt-8 pl-12 pr-20">
        <h4 className="uppercase">{selectedUser.username}</h4>
        <form className="flex flex-col">
          <label htmlFor="email" className="mt-4 mb-1 text-base font-medium text-gray-200 font-body">
            User Email
          </label>
          <input
            id="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="w-full p-1 text-base text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
          />
          <button
            className="w-full px-2 py-1 mt-6 text-base font-bold text-blue-700 uppercase bg-gray-200 rounded hover:bg-gray-300 font-body"
            type="submit"
            onClick={event => handleUpdateUser(event)}
          >
            update
          </button>
        </form>
        <div className="flex flex-row justify-between mt-6">
          <h6 className="text-teal-500 underline uppercase ">resend invite</h6>
          <h6 className="text-teal-500 underline uppercase ">delete user</h6>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

UserModal.propTypes = {
  handleClose: PropTypes.func,
  selectedUser: PropTypes.object,
};
