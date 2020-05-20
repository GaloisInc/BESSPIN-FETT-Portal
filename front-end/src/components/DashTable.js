import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import rocketDark from '../assets/rocketDark.svg';
import settings from '../assets/settings.svg';

const DashTable = () => {
  const dummyInstances = [
    {
      instance: 'Baseline | RV64 | FreeBSD',
      launched: '11:52 am',
      status: 'Running',
    },
  ];
  return (
    <>
      <div className="mb-4 mr-8 bg-blue-600 table-card" style={{ width: '600px', minHeight: '400px' }}>
        <div className="flex flex-row items-center justify-between pl-8 pr-4 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance history</h5>
          <Link to="/bountyportal/launch" activeClassName="active">
            <button className="flex flex-row items-center justify-around w-40 pr-2 btn-gray selected:outline-none" type="button">
              <img src={rocketDark} alt="" className="w-3" />
              <p className="self-center text-sm font-medium text-blue-900 uppercase">launch instance</p>
            </button>
          </Link>
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
              field: 'settings',
              render: data => (
                <button type="button" className="focus:outline-none">
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
      </div>
    </>
  );
};

// DashTable.propTypes = {};

export default DashTable;
