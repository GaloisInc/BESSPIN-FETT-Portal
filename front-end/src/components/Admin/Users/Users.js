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

  const handleScroll = e => e.target.classList.add('fettScroll');

  return (
    <div
      className="pt-6 pl-12 overflow-y-scroll"
      style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}
      onScroll={handleScroll}
    >
      <h3 className="text-gray-200 uppercase">manage users</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to generate new researcher and admin logins and to modify existing logins.
      </p>
      <div className="mt-4 grid grid-cols-12 pr-8 gap-4" style={{ flex: 1 }}>
        <div className="col-span-5">
          <UserForm fetchUsers={fetchUsers} />
        </div>
        <div className="col-span-7">
          {isLoading ? (
            <Spinner relative />
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
    </div>
  );
}
