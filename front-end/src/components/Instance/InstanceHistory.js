/* eslint-disable */

import React, {useEffect, useState} from 'react';
// import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import moment from 'moment';
import rocketDark from '../../assets/rocketDark.svg';
import settings from '../../assets/settings.svg';
import {getEnvironments} from '../../services/api/environment';
import { ec2StatusUpdate } from '../../services/launcher';
import InstanceHistoryModal from './InstanceHistoryModal';

const InstanceHistory = () => {
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [environments, setEnvironments] = useState([]);
	
  const handleOpen = async data => {
    setIsModalLoading(true);
    setModalData(data);
    setOpen(true);
  };
	
  const handleClose = () => {
	setOpen(false);
	};
  
  const fetchEnvironments = async () => {
    try {
      const response = await getEnvironments();
      setEnvironments(response);
    } catch (error) {
      console.log(`Error fetching configurations${error}`);
    }
  };

  useEffect(() => {
    fetchEnvironments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
            { title: 'F1 Instance', field: 'instance', width: '14em', render: data => (
              <p>
                {data.Type} | {data.OS} | {data.Processor}
              </p>
            ), },
            { title: 'Launched Time', field: 'Created', render: data => (
                <p>
                  {moment(data.Created).format('hh:mm A')}
                </p> 
              )},
            { title: 'Status', field: 'Status' },
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
          data={environments}
        />
        <p className="pt-4 pl-2 text-gray-200">
          Provisioned instances are limited to (2) and a duration of idle activity (TBD) before automatic instance shutdown.
        </p>
		
		<Modal open={open} onClose={handleClose}>
        	<InstanceHistoryModal handleClose={handleClose} isModalLoading={isModalLoading} modalData={modalData} fetchEnvironments={fetchEnvironments} />
      	</Modal>
		
      </div>
    </>
  );
};

// DashTable.propTypes = {};

export default InstanceHistory;
