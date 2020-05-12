import React from 'react';
import UserForm from './UserForm';
import ManageUsers from './ManageUsers';

export default function Users() {
  return (
    <div className="pl-6 pt-4 h-full">
      <h3 className="uppercase text-gray-200">manage users</h3>
      <p className="text-gray-200 pt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <a href="">
        <h5 className="text-teal-500 uppercase mt-4 underline">view on AWS</h5>
      </a>
      <div className="flex flex-row flex-wrap justify-around w-full mt-4">
        <UserForm />
        <ManageUsers />
      </div>
    </div>
  );
}
