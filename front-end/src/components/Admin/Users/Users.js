import React from 'react';
import UserForm from './UserForm';
import ManageUsers from './ManageUsers';

export default function Users() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">manage users</h3>
      <p className="pt-4 text-gray-200">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <div className="flex flex-row flex-wrap justify-around w-full mt-4">
        <UserForm />
        <ManageUsers />
      </div>
    </div>
  );
}
