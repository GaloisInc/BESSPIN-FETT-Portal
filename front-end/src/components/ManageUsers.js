import React, { useState } from 'react';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import refresh from '../assets/refresh.svg';
import search from '../assets/search.svg';
import chevronRight from '../assets/chevronRight.svg';
import UserModal from './UserModal';

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const handleSearch = event => {
    event.preventDefault();
    console.log('searching');
    // Todo implement ==> search
  };

  const handleOpen = async data => {
    await setSelectedUser(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dummyInstances = [
    {
      username: 'username one',
      email: 'mister.e@testing.fivetalent.com',
      role: 'admin',
    },
    {
      username: 'team one',
      email: '',
      role: 'researcher',
    },
    {
      username: 'username two',
      email: 'mister.t@testing.fivetalent.com',
      role: 'admin',
    },
  ];

  return (
    <div className="bg-blue-600 table-card" style={{ width: '700px', minHeight: '630px' }}>
      <div className="flex flex-row items-center justify-between pl-8 mt-4 mb-4">
        <h5 className="text-gray-200 uppercase">current teams/ users</h5>
        <div className="flex flex-row items-center mr-4">
          <form className="relative" onSubmit={event => handleSearch(event)}>
            <input
              className="bg-blue-600 border border-gray-200 border-solid rounded"
              type="text"
              value={searchTerm}
              name="name"
              onChange={event => setSearchTerm(event.target.value)}
            />
            <img className="absolute top-0 right-0 mt-1 mr-2" src={search} alt="" />
          </form>
          <button className="ml-4 cursor-pointer focus:outline-none " type="button">
            <img className="h-4" src={refresh} alt="" />
          </button>
        </div>
      </div>
      <MaterialTable
        components={{
          Container: props => <Paper {...props} elevation={0} />,
        }}
        columns={[
          { title: 'USER NAME', field: 'username', width: '12em' },
          { title: 'EMAIL', field: 'email' },
          { title: 'ROLE', field: 'role' },
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
            backgroundColor: '#1E2B34',
            color: '#46878E',
            fontWeight: 'bold',
            fontSize: '1em',
          },
          rowStyle: rowData => ({
            backgroundColor: rowData.tableData.id % 2 ? '#293A46' : '#314457',
            color: '#F4F4F4',
            border: 'none',
            textTransform: 'uppercase',
          }),
          paging: false,
          search: false,
          showTitle: false,
          toolbar: false,
          sorting: false,
        }}
        data={dummyInstances}
      />
      <Modal open={open} onClose={handleClose}>
        <UserModal handleClose={handleClose} selectedUser={selectedUser} />
      </Modal>
    </div>
  );
}
