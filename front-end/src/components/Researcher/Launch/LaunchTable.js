import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import rocketDark from '../../../assets/rocketDark.svg';
import { getInstanceConfigurations } from '../../../services/api/instanceConfiguration';
import { ec2Launcher } from '../../../services/launcher';
import Spinner from '../../Spinner.js';
import { getRunningInstanceCount } from '../../../services/api/environment';

const LaunchTable = ({ history }) => {
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
      if (Array.isArray(instanceCount) && instanceCount[0].ActiveCount) setCount(instanceCount[0].ActiveCount);
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
      history.push('./');
      setIsLoading(false);
    }
    console.log('launching');
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
              { title: 'Type', field: 'Type', cellStyle: { paddingLeft: '2em' }, headerStyle: { paddingLeft: '2em' } },
              { title: 'Processor', field: 'Processor' },
              { title: 'OS', field: 'OS' },
              {
                title: '',
                field: 'Launch',
                render: data => (
                  <button
                    className={`flex flex-row items-center justify-around w-24 pr-4 selected:outline-none ${
                      typeof count === 'number' && count > 1 ? 'bg-gray-600 cursor-default' : 'btn-gray hover:bg-teal-500 hover:text-gray-200'
                    }`}
                    type="button"
                    onClick={event => handleLaunch(event, data)}
                    disabled={typeof count !== 'number' || count > 1}
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
        )}
      </div>
    </>
  );
};

LaunchTable.propTypes = {
  history: ReactRouterPropTypes.history,
};

export default withRouter(LaunchTable);
