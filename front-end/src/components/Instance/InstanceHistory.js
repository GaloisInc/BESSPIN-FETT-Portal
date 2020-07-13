/* eslint-disable react/display-name */

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import moment from 'moment';
import settings from '../../assets/settings.svg';
import rocketDark from '../../assets/rocketDark.svg';
import { getMyEnvironments } from '../../services/api/environment';
import InstanceHistoryModal from './InstanceHistoryModal';
import Spinner from '../Spinner.js';
import Alert from './Alert';

const InstanceHistory = params => {
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [updateTime, setUpdateTime] = useState('');

  const handleOpen = async data => {
    setIsModalLoading(true);
    setModalData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLaunch = event => {
    event.preventDefault();
    params.history.push('/bountyportal/launch');
  };

  const fetchEnvironments = async load => {
    if (load) setIsModalLoading(true);
    try {
      if (load) setIsLoading(true);
      setUpdateTime(new Date().toLocaleString());
      const response = await getMyEnvironments();
      setEnvironments(response);
      if (load) {
        setIsLoading(false);
        setIsModalLoading(false);
      }
    } catch (error) {
      console.log(`Error fetching Environments: ${error}`);
      setIsModalLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments('load');
    const interval = setInterval(() => {
      console.log('This will run every second!');
      fetchEnvironments();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(environments);
    console.log(modalData);
    if (environments && environments.length > 0 && modalData && Object.keys(modalData).length > 0) {
      const newModalData = environments.filter(env => env.F1EnvironmentId === modalData.F1EnvironmentId);
      console.log(newModalData);
      setModalData({ ...newModalData[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environments]);

  return (
    <>
      <div className="relative mb-4 mr-6 bg-blue-600 table-card" style={{ width: '700px', minHeight: '' }}>
        <div className="flex flex-row items-center justify-between w-full pl-2 pr-2 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance history</h5>
          <button
            className="flex flex-row items-center justify-around whitespace-no-wrap pl-4 pr-4 pt-1 pb-1 selected:outline-none btn-gray hover:bg-teal-500 hover:text-gray-200"
            type="button"
            onClick={event => handleLaunch(event)}
          >
            <img src={rocketDark} alt="" className="pr-2" />
            <p className="self-center text-sm font-medium text-blue-900 uppercase">launch instance</p>
          </button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <MaterialTable
            components={{
              Container: props => <Paper {...props} elevation={0} />,
            }}
            columns={[
              {
                title: '',
                field: 'alert',
                width: '1em',
                sorting: false,
                render: data => (
                  <div className="w-3">
                    <Alert status={data.Status} />
                  </div>
                ),
              },
              {
                title: 'F1 Instance',
                field: 'instance',
                width: '14em',
                render: data => (
                  <p>
                    {data.Type} | {data.OS} | {data.Processor}
                  </p>
                ),
              },
              { title: 'CodeName', field: 'CodeName', width: '7em' },
              {
                title: 'Launched',
                field: 'Created',
                render: data => <p>{moment(data.Created).format('MM/DD/YY hh:mm A')}</p>,
              },
              { title: 'Status', field: 'Status' },
              {
                title: '',
                field: 'launch',
                sorting: false,
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
              draggable: false,
            }}
            data={environments}
          />
        )}
        <div className="flex flex-row justify-end p-1">
          <p className="text-xs text-gray-500">Last Updated: {updateTime}</p>
        </div>
        <p className="pt-4 pl-2 text-gray-200">
          Provisioned instances are limited to two (2), and automatic instance shutdown will occur after an instance has
          been active for eight (8) hours.
        </p>
        <Modal open={open} onClose={handleClose}>
          <InstanceHistoryModal
            handleClose={handleClose}
            isModalLoading={isModalLoading}
            modalData={modalData}
            fetchEnvironments={fetchEnvironments}
          />
        </Modal>
      </div>
    </>
  );
};

// DashTable.propTypes = {};

export default withRouter(InstanceHistory);
