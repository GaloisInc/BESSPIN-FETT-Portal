import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsIcon from '@material-ui/icons/Details';
import { CircularProgress } from '@material-ui/core';
import alert from '../../assets/alert.svg';
import { ec2StatusUpdate } from '../../services/launcher';

const InstanceDetail = ({ environment, index, fetchEnvironments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const updateInstanceStatus = async (event, newStatus) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await ec2StatusUpdate(environment, newStatus);
      fetchEnvironments();
      setIsLoading(false);
    } catch (error) {
      console.log(`Error updating instance${error}`);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8 ">
          <p className="text-base text-teal-500 uppercase">Launched Date</p>
        </div>
        <p className="text-base text-200-gray">{environment.created_at && moment(environment.created_at).format('MM/DD/YY')}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8 ">
          <p className="text-base text-teal-500 uppercase">Launched Time</p>
        </div>
        <p className="text-base text-200-gray">{environment.created_at && moment(environment.created_at).format('HH:mm')}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Status</p>
        </div>
        <p className="text-base uppercase text-200-gray">{environment.Status}</p>
        {environment && environment.Status !== 'running' && <img src={alert} className="w-4 ml-4" alt="" />}
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Idle Time</p>
        </div>
        <p className="text-base text-200-gray">{environment.IdleTime && moment(environment.IdleTime).format('HH:mm')}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Elapsed Time</p>
        </div>
        <p className="text-base uppercase text-200-gray" />
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Researchers Using</p>
        </div>
        <p className="text-base text-200-gray" />
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Environment ID</p>
        </div>
        <p className="text-base uppercase text-200-gray">{environment.F1EnvironmentId}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Fett target</p>
        </div>
        <p className="text-base text-200-gray">{environment.IpAddress}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">private key</p>
        </div>
        <p className="text-base underline uppercase text-200-gray">{environment.PrivateKeyStore}</p>
      </div>
      <div className="flex flex-row items-center justify-end py-2 my-10 bg-blue-600">
        <button
          className={`w-48 px-2 py-1 mr-10 text-sm font-medium text-blue-700 uppercase rounded ${
            environment.Status === 'running' ? 'bg-gray-600 ' : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
          }`}
          type="submit"
          onClick={event => updateInstanceStatus(event, 'running')}
          disabled={isLoading || environment.Status === 'running'}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Restart Instance'}
        </button>
        <button
          className={`w-48 px-2 py-1 mr-10 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded ${
            environment.Status === 'paused' ? 'bg-gray-600 ' : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
          }`}
          type="submit"
          onClick={event => updateInstanceStatus(event, 'paused')}
          disabled={isLoading || environment.Status === 'paused'}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Stop Instance'}
        </button>
      </div>
    </>
  );
};

export default InstanceDetail;

InstanceDetail.propTypes = {
  environment: PropTypes.object,
  index: PropTypes.number,
  fetchEnvironments: PropTypes.func,
};
