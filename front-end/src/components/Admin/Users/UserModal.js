/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import close from '../../../assets/close.svg';
import { disableUser, resendInvite } from '../../../services/cognito';

const UserModal = ({ handleClose, selectedUser, fetchUsers }) => {
  const [email, setEmail] = useState(selectedUser.UserName);

  const handleResendInvite = async event => {
    event.preventDefault();
    await resendInvite(selectedUser.UserName);
    fetchUsers();
    handleClose();
  };

  const handleDelete = async event => {
    event.preventDefault();
    await disableUser(selectedUser);
    fetchUsers();
    handleClose();
  };

  console.log(selectedUser);
  return (
    <div
      className="absolute text-4xl text-gray-200 bg-blue-600"
      style={{ width: '400px', height: '360px', top: '30%', left: '50%', marginLeft: '-200px' }}
    >
      <div className="flex flex-row justify-between py-2 pl-8 pr-6 border-b-2 border-blue-800 border-b-solid ">
        <h4 className="font-medium uppercase">{selectedUser.Role} user</h4>
        <button type="button" onClick={handleClose} className="focus:outline-none">
          <img src={close} alt="" />
        </button>
      </div>
      <div className="pt-8 pl-12 pr-12">
        <h4 className="text-lg uppercase break-all">{selectedUser.UserName}</h4>
        <form className="flex flex-col">
          <label htmlFor="email" className="mt-4 mb-1 text-base font-medium text-gray-200 font-body">
            User Email
          </label>
          <input
            id="email"
            value={email}
            // onChange={event => setEmail(event.target.value)}
            disabled
            className="w-full p-1 text-base text-gray-600 bg-blue-600 border border-gray-600 border-solid rounded"
          />
        </form>
        <div className="flex flex-row justify-between mt-6">
          <button type="button" onClick={handleResendInvite} disabled={selectedUser.Role !== 'admin'}>
            <h6 className="text-teal-500 underline uppercase ">resend invite</h6>
          </button>
          <button type="button" onClick={handleDelete}>
            <h6 className="text-teal-500 underline uppercase ">delete user</h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

UserModal.propTypes = {
  handleClose: PropTypes.func,
  selectedUser: PropTypes.object,
  fetchUsers: PropTypes.func,
};
