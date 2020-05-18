import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import rocketDark from '../assets/rocketDark.svg';

const LaunchTable = () => {
  const dummyInstances = [
    {
      type: 'LMCO',
      processor: 'RV32',
      os: 'FreeRTOS',
    },
    {
      type: 'LMCO',
      processor: 'RV64',
      os: 'Linux',
    },
    {
      type: 'SRI Cambridge',
      processor: 'RV64',
      os: 'FreeBSD',
    },
    {
      type: 'UMich',
      processor: 'RV32',
      os: 'FreeRTOS',
    },
    {
      type: 'MIT',
      processor: 'RV64',
      os: 'Linux',
    },
    {
      type: 'Baseline',
      processor: 'RV32',
      os: 'FreeRTOS',
    },
    {
      type: 'Baseline',
      processor: 'RV64',
      os: 'Linux',
    },
    {
      type: 'Baseline',
      processor: 'RV64',
      os: 'FreeBSD',
    },
  ];
  return (
    <>
      <div className="mb-4 bg-blue-600 table-card" style={{ width: '800px', minHeight: '400px' }}>
        <div className="flex flex-row items-center justify-between pl-8 mt-4 mb-4">
          <h5 className="text-gray-200 uppercase">instance configuration</h5>
        </div>
        <MaterialTable
          components={{
            Container: props => <Paper {...props} elevation={0} />,
          }}
          columns={[
            { title: 'Type', field: 'type' },
            { title: 'Processor', field: 'processor' },
            { title: 'OS', field: 'os' },
            {
              title: '',
              field: 'launch',
              render: data => (
                <button className="flex flex-row items-center justify-around w-24 pr-4 btn-gray selected:outline-none" type="button">
                  <img src={rocketDark} alt="" className="w-3" />
                  <p className="self-center text-sm font-medium text-blue-900 uppercase">launch</p>
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
      </div>
    </>
  );
};

LaunchTable.propTypes = {};

export default LaunchTable;
