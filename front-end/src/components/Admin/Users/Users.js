import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import { getUsers } from '../../../services/api/user';
import Spinner from '../../Spinner.js';
import ManageUsers from './ManageUsers';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
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
    <div className="pt-6 pl-12 ">
      <h3 className="text-gray-200 uppercase">manage users</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to generate new researcher and admin logins and to modify existing logins.
      </p>
      <div className="relative flex flex-row content-start w-full mt-4">
        <UserForm fetchUsers={fetchUsers} />
        {isLoading ? (
          <Spinner />
        ) : (
          <ManageUsers
            fetchUsers={fetchUsers}
            users={users}
            filteredUsers={filteredUsers}
            setFilteredUsers={setFilteredUsers}
          />
        )}
      </div>
    </div>
  );
}
