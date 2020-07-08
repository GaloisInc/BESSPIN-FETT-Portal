/* eslint-disable react/display-name */

import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import rocketDark from '../../../assets/rocketDark.svg';
import { getInstanceConfigurations } from '../../../services/api/instanceConfiguration';
import { ec2Launcher } from '../../../services/launcher';
import Spinner from '../../Spinner.js';
import { getRunningInstanceCount } from '../../../services/api/environment';

const LaunchTable = ({ history, handleOpen }) => {
  const [instanceConfigurations, setInstanceConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState('');

  const fetchConfigurations = async () => {
    try {
      const configurations = await getInstanceConfigurations();
      setInstanceConfigurations(configurations);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  const fetchInstanceCount = async () => {
    try {
      const instanceCount = await getRunningInstanceCount();
      console.log(instanceCount);
      const user = await Auth.currentSession();
      const id = await user.getIdToken();
      const name = id.payload['cognito:username'];
      if (name === 'ftsresearcher') {
        setCount(0);
      } else if (Array.isArray(instanceCount) && instanceCount[0].ActiveCount) setCount(instanceCount[0].ActiveCount);
      setIsLoading(false);
    } catch (error) {
      console.log(`Error fetching count${error}`);
    }
  };

  useEffect(() => {
    fetchInstanceCount();
    fetchConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLaunch = async (event, configuration) => {
    setIsLoading(true);
    event.preventDefault();
    const response = await ec2Launcher(configuration);
    console.log(response);
    if (response && response.serverStatus === 2) {
      console.log('success');
      handleOpen();
      history.push('./');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative mb-4 bg-blue-600 table-card" style={{ width: '800px', minHeight: '400px' }}>
        <div className="flex flex-row items-center justify-between pl-8 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance configuration</h5>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <MaterialTable
            components={{
              Container: props => <Paper {...props} elevation={0} />,
            }}
            columns={[
              { title: 'CodeName', field: 'CodeName' },
              { title: 'Type', field: 'Type', cellStyle: { paddingLeft: '2em' }, headerStyle: { paddingLeft: '2em' } },
              { title: 'Processor', field: 'Processor' },
              { title: 'OS', field: 'OS' },
              {
                title: '',
                field: 'Launch',
                render: data => (
                  <button
                    className={`flex flex-row items-center justify-around whitespace-no-wrap w-24 px-4 selected:outline-none ${
                      typeof count === 'number' && count > 1
                        ? 'bg-gray-600 cursor-default'
                        : 'btn-gray hover:bg-teal-500 hover:text-gray-200'
                    }`}
                    type="button"
                    onClick={event => handleLaunch(event, data)}
                    disabled={count > 1}
                  >
                    <img src={rocketDark} alt="" className="w-3 mr-2" />
                    <p className="self-center text-sm font-medium text-blue-900 uppercase">launch</p>
                  </button>
                ),
              },
            ]}
            options={{
              headerStyle: {
                backgroundColor: '#1E2B34',
                color: '#46878E',
                fontWeight: '500',
                fontSize: '1em',
                textTransform: 'uppercase',
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
        )}
        <p className="py-4 pl-2 ml-6 text-gray-200">
          * Provisioned instances are limited to (2) and a running time of 8 hours before automatic instance shutdown.
          New instances may not be launched until prior instances are being terminated.
        </p>
      </div>
    </>
  );
};

LaunchTable.propTypes = {
  history: ReactRouterPropTypes.history,
  handleOpen: PropTypes.func,
};

export default withRouter(LaunchTable);
