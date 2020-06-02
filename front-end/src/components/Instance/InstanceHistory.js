/* eslint-disable */
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import rocketDark from '../../assets/rocketDark.svg';
import settings from '../../assets/settings.svg';
import InstanceModal from './InstanceModal';

const InstanceHistory = () => {
	const [open, setOpen] = React.useState(false);
	
	  const handleOpen = () => {
	    setOpen(true);
	  };
	
	  const handleClose = () => {
	    setOpen(false);
	  };	
	
  const dummyInstances = [
    {
      instance: 'Baseline | RV64 | FreeBSD',
      launched: '11:52 am',
      status: 'Running',
    },
    {
      instance: 'SRI-Cambridge | RV64 | FreeBSD',
      launched: '9:24 am',
      status: 'Paused',
    },
    {
      instance: 'Baseline | RV32 | FreeRTOs',
      launched: '10:23 am',
      status: 'Provisioning',
    },
  ];
  return (
    <>
      <div className="mb-4 mr-6 bg-blue-600 table-card" style={{ width: '600px', minHeight: '' }}>
        <div className="flex flex-row items-center justify-between pl-2 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance history</h5>
        </div>
        <MaterialTable
          components={{
            Container: props => <Paper {...props} elevation={0} />,
          }}
          columns={[
            { title: 'F1 Instance', field: 'instance' },
            { title: 'Launched Time', field: 'launched' },
            { title: 'Status', field: 'status' },
            {
              title: '',
              field: 'launch',
              render: data => (
	          <button type="button" onClick={() => handleOpen(data)} className="focus:outline-none">
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
              backgroundColor: rowData.tableData.id % 2 ? '#26343E' : '#293A46',
              color: '#F4F4F4',
            }),
            paging: false,
            search: false,
            showTitle: false,
            toolbar: false,
            sorting: false,
          }}
          data={dummyInstances}
        />
        <p className="pt-4 pl-2 text-gray-200">
          Provisioned instances are limited to (2) and a duration of idle activity (TBD) before automatic instance shutdown.
        </p>
		
		<Modal open={open} onClose={handleClose}>
        	<InstanceModal handleClose={handleClose} />
      	</Modal>
		
      </div>
    </>
  );
};

// DashTable.propTypes = {};

export default InstanceHistory;
