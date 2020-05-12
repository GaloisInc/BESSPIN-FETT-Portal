import React, { useState } from 'react';
import MaterialTable from 'material-table';
import refresh from '../assets/refresh.svg';
import search from '../assets/search.svg';
import chevronRight from '../assets/chevronRight.svg';

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    event.preventDefault();
    console.log('searching');
    // Todo implement ==> search
  };

  const openModal = data => {
    // ToDO implement ==> status modal
    console.log('modalling', data);
  };

  const dummyInstances = [
    {
      username: 'username one',
      email: 'mister.e@testing.fivetalent.com',
      role: 'admin',
    },
    {
      username: 'username one',
      email: 'mister.e@testing.fivetalent.com',
      role: 'researcher',
    },
    {
      username: 'team one',
      email: 'mister.e@testing.fivetalent.com',
      role: 'admin',
    },
  ];

  return (
    <div className="bg-blue-600 mb-4 table-card" style={{ width: '700px', minHeight: '630px' }}>
      <div className="flex flex-row justify-between pl-4 mt-2 items-center mb-4">
        <h5 className="uppercase text-gray-200">current users</h5>
        <div className="flex flex-row items-center mr-4">
          <form className="relative" onSubmit={event => handleSearch(event)}>
            <input
              className="bg-blue-600 border-solid border border-gray-200"
              type="text"
              value={searchTerm}
              name="name"
              onChange={event => setSearchTerm(event.target.value)}
            />
            <img className="absolute right-0 top-0 mt-2 mr-2" src={search} alt="" />
          </form>
          <button className=" ml-4 cursor-pointer" type="button">
            <img className="h-4" src={refresh} alt="" />
          </button>
        </div>
      </div>
      <MaterialTable
        columns={[
          { title: 'User Name', field: 'username' },
          { title: 'Email', field: 'email' },
          { title: 'Role', field: 'role' },
          {
            title: '',
            field: 'detailsView',
            render: data => (
              <button type="button" onClick={() => openModal(data)}>
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
    </div>
  );
}
