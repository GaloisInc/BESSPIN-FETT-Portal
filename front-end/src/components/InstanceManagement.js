import React, { useState } from 'react';
import MaterialTable from 'material-table';
import { Modal } from '@material-ui/core';
import refresh from '../assets/refresh.svg';
import search from '../assets/search.svg';
import settings from '../assets/settings.svg';
import InstanceModal from './InstanceModal';

export default function InstanceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleSearch = event => {
    event.preventDefault();
    console.log('searching');
    // Todo implement ==> search
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dummyInstances = [
    {
      team: 'team one',
      f1Instance: 'cambrian debian',
      idleTime: null,
      status: 'provisioning',
    },
    {
      team: 'team one',
      f1Instance: 'cambrian debian',
      idleTime: null,
      status: 'provisioning',
    },
    {
      team: 'team one',
      f1Instance: 'cambrian debian',
      idleTime: null,
      status: 'provisioning',
    },
  ];

  return (
    <>
      <div className="mb-4 bg-blue-600 table-card" style={{ width: '700px', minHeight: '630px' }}>
        <div className="flex flex-row items-center justify-between pl-4 mt-2 mb-4">
          <h5 className="text-gray-200 uppercase">instance management</h5>
          <div className="flex flex-row items-center mr-4">
            <form className="relative">
              <input
                className="bg-blue-600 border border-gray-200 border-solid"
                type="text"
                value={searchTerm}
                name="name"
                onChange={event => setSearchTerm(event.target.value)}
                onSubmit={handleSearch}
              />
              <img className="absolute top-0 right-0 mt-2 mr-2" src={search} alt="" />
            </form>
            <button className="ml-4 cursor-pointer " type="button">
              <img className="h-4" src={refresh} alt="" />
            </button>
          </div>
        </div>
        <MaterialTable
          columns={[
            { title: 'Team', field: 'team' },
            { title: 'F1 Instance', field: 'f1Instance' },
            { title: 'Idle Time', field: 'idleTime' },
            { title: 'Status', field: 'status' },
            {
              title: '',
              field: 'detailsView',
              render: data => (
                <button type="button" onClick={() => handleOpen(data)}>
                  <img src={settings} alt="" />
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
      <Modal open={open} onClose={handleClose}>
        <InstanceModal handleClose={handleClose} />
      </Modal>
    </>
  );
}
