import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import { getUsers } from '../../../services/api/user';
import Spinner from '../../Spinner';
import ManageUsers from './ManageUsers';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      console.log(users);
      setUsers(response);
      setFilteredUsers(response);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">manage users</h3>
      <p className="pt-4 text-gray-200">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <div className="flex flex-row flex-wrap justify-around w-full mt-4">
        <UserForm fetchUsers={fetchUsers} />
        <ManageUsers fetchUsers={fetchUsers} users={users} filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} />
      </div>
      {/* {isLoading && <Spinner />} */}
    </div>
  );
}
