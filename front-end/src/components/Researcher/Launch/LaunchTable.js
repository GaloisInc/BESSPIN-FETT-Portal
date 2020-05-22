import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import rocketDark from '../../../assets/rocketDark.svg';
import { getInstanceConfigurations } from '../../../services/api';
// import { ec2Launcher } from '../../../services/launcher';

const LaunchTable = ({ history }) => {
  const [instanceConfigurations, setInstanceConfigurations] = useState([
    {
      Type: 'LMCO',
      Processor: 'RV32',
      OS: 'FreeRTOS',
    },
    {
      Type: 'LMCO',
      Processor: 'RV64',
      OS: 'Linux',
    },
    {
      Type: 'SRI Cambridge',
      Processor: 'RV64',
      OS: 'FreeBSD',
    },
    {
      Type: 'UMich',
      Processor: 'RV32',
      OS: 'FreeRTOS',
    },
    {
      Type: 'MIT',
      Processor: 'RV64',
      OS: 'Linux',
    },
    {
      Type: 'Baseline',
      Processor: 'RV32',
      OS: 'FreeRTOS',
    },
    {
      Type: 'Baseline',
      Processor: 'RV64',
      OS: 'Linux',
    },
    {
      Type: 'Baseline',
      Processor: 'RV64',
      OS: 'FreeBSD',
    },
  ]);

  const fetchConfigurations = async () => {
    try {
      const configurations = await getInstanceConfigurations();
      setInstanceConfigurations(configurations);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const handleLaunch = async (event, configuration) => {
    event.preventDefault();
    // const response = await ec2Launcher(configuration);
    // if (response === 'success') {
    //   history.push('./bountyportal/dashboard');
    // }
    console.log('launching');
  };

  return (
    <>
      <div className="mb-4 bg-blue-600 table-card" style={{ width: '800px', minHeight: '400px' }}>
        <div className="flex flex-row items-center justify-between pl-8 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance configuration</h5>
        </div>
        <MaterialTable
          components={{
            Container: props => <Paper {...props} elevation={0} />,
          }}
          columns={[
            { title: 'Type', field: 'Type' },
            { title: 'Processor', field: 'Processor' },
            { title: 'OS', field: 'OS' },
            {
              title: '',
              field: 'Launch',
              render: data => (
                <button
                  className="flex flex-row items-center justify-around w-24 pr-4 btn-gray selected:outline-none"
                  type="button"
                  onClick={event => handleLaunch(event, data)}
                >
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
          data={instanceConfigurations}
        />
      </div>
    </>
  );
};

LaunchTable.propTypes = {
  history: ReactRouterPropTypes.history,
};

export default LaunchTable;
