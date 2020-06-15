/* eslint-disable */

import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable from 'material-table';
import { Paper, Modal } from '@material-ui/core';
import moment from 'moment';
import settings from '../../assets/settings.svg';
import rocketDark from '../../assets/rocketDark.svg';
import {getMyEnvironments} from '../../services/api/environment';
import InstanceHistoryModal from './InstanceHistoryModal';
import Spinner from '../Spinner.js';


const InstanceHistory = (params) => {
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
	
  const handleOpen = async data => {
    setIsModalLoading(true);
    setModalData(data);
    setOpen(true);
  };
	
  const handleClose = () => {
	setOpen(false);
	};
  
  const handleLaunch = (event) => {
    console.log(params);
    event.preventDefault();
    params.history.push("/bountyportal/launch");
  }

  const fetchEnvironments = async (id) => {
    setIsModalLoading(true);
    try {
	  setIsLoading(true);
      const response = await getMyEnvironments();
      setEnvironments(response);
      setIsLoading(false);
      setIsModalLoading(false)

    } catch (error) {
      console.log(`Error fetching Environments: ${error}`);
      setIsModalLoading(false)

    }
  };

  useEffect(() => {
    fetchEnvironments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(environments)
    console.log(modalData)
    if (environments && environments.length > 0 && modalData && Object.keys(modalData).length > 0 ){
      const newModalData  = environments.filter(env => 
        env.F1EnvironmentId === modalData.F1EnvironmentId
      )
      console.log(newModalData)
      setModalData({...newModalData[0]});
    }
  }, [environments])


  return (
    <>
      <div className="relative mb-4 mr-6 bg-blue-600 table-card" style={{ width: '600px', minHeight: '' }}>
        <div className="flex flex-row items-center justify-between pl-2 mt-2 mb-2">
          <h5 className="text-gray-200 uppercase">instance history</h5>
          <button className="flex flex-row items-center justify-around w-auto pr-4 pl-4 selected:outline-none btn-gray hover:bg-teal-500 hover:text-gray-200"
                  type="button"
                  onClick={event => handleLaunch(event)}>
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
              fontWeight: '500',
              fontSize: '1em',
              textTransform: 'uppercase'
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
        )};
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

export default withRouter(InstanceHistory);
