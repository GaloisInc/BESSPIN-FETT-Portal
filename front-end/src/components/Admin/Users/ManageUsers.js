/* eslint-disable react/display-name */

import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import refresh from '../../../assets/refresh.svg';
import search from '../../../assets/search.svg';
import chevronRight from '../../../assets/chevronRight.svg';
import UserModal from './UserModal';
import useWindowDimensions from '../../../services/useDimensions';
import Spinner from '../../Spinner.js';

const ManageUsers = ({ users, fetchUsers, filteredUsers, setFilteredUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteredData = users.filter(
      env => env.UserName.toLowerCase().includes(searchTerm.toLowerCase()) || env.Role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = async event => {
    event.preventDefault();
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleOpen = async data => {
    await setSelectedUser(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="bg-blue-600 table-card" style={{ width: '700px', minHeight: '630px', maxHeight: height - 340 }}>
      <div className="flex flex-row items-center justify-between pl-8 mt-4 mb-4">
        <h5 className="text-gray-200 uppercase">current teams/ users</h5>
        <div className="flex flex-row items-center mr-4">
          <form className="relative" onSubmit={event => handleSearch(event)}>
            <input
              className="pl-4 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded focus:outline-none"
              type="text"
              value={searchTerm}
              name="name"
              onChange={event => handleSearch(event)}
            />
            <img className="absolute top-0 right-0 mt-1 mr-2" src={search} alt="" />
          </form>
          <button className="ml-4 cursor-pointer focus:outline-none " type="button" onClick={fetchUsers}>
            <img className="h-4" src={refresh} alt="" />
          </button>
        </div>
      </div>
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0} />,
        }}
        columns={[
          { title: 'USER NAME', field: 'UserName', width: '18em', cellStyle: { paddingLeft: '2em' }, headerStyle: { paddingLeft: '2em' } },
          { title: 'ROLE', field: 'Role' },
          {
            title: '',
            field: 'detailsView',
            render: data => (
              <button type="button" onClick={() => handleOpen(data)} className="focus:outline-none">
                <img src={chevronRight} alt="" />
              </button>
            ),
          },
        ]}
        options={{
          headerStyle: {
            position: 'sticky',
            top: 0,
            backgroundColor: '#1E2B34',
            color: '#46878E',
            fontWeight: '500',
            fontSize: '1em',
            textTransform: 'uppercase',
          },
          maxBodyHeight: height - 340,
          rowStyle: rowData => ({
            backgroundColor: rowData.tableData.id % 2 ? '#293A46' : '#26343E',
            color: '#F4F4F4',
            border: 'none',
            textTransform: 'uppercase',
          }),
          paging: false,
          search: false,
          showTitle: false,
          toolbar: false,
          sorting: false,
          overflowY: false,
        }}
        data={filteredUsers}
      />
      <Modal open={open} onClose={handleClose}>
        <UserModal handleClose={handleClose} selectedUser={selectedUser} fetchUsers={fetchUsers} />
      </Modal>
    </div>
  );
};

export default ManageUsers;

ManageUsers.propTypes = {
  users: PropTypes.array,
  fetchUsers: PropTypes.func,
  filteredUsers: PropTypes.array,
  setFilteredUsers: PropTypes.func,
};
