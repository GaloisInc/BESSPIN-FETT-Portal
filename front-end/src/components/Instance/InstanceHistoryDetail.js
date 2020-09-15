import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { CircularProgress } from '@material-ui/core';
import { ec2StatusUpdate } from '../../services/launcher';
import Alert from './Alert';

const InstanceDetail = ({ environment, fetchEnvironments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const updateInstanceStatus = async (event, newStatus) => {
    event.preventDefault();
    setIsDisabled(true);
    setIsResetDisabled(true);
    setIsLoading(true);
    try {
      await ec2StatusUpdate(environment, newStatus);
      fetchEnvironments();
      setIsLoading(false);
      if (newStatus === 'resetting') setIsDisabled(false);
    } catch (error) {
      console.log(`Error updating instance${error}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { Status } = environment;
    if (Status === 'running') setIsResetDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment.Status]);

  return (
    <>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8 ">
          <p className="text-base text-teal-500 uppercase">Launched Date</p>
        </div>
        <p className="text-base text-200-gray">{environment.Created && moment(environment.Created).format('l')}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8 ">
          <p className="text-base text-teal-500 uppercase">Launched Time</p>
        </div>
        <p className="text-base text-200-gray">{environment.Created && moment(environment.Created).format('LTS')}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Status</p>
        </div>
        <p className="text-base uppercase text-200-gray">{environment.Status}</p>
        <div className="w-4 h-4 mt-1 ml-4">
          <Alert status={environment.Status} />
        </div>
      </div>
      <div className="flex flex-row py-2 bg-blue-700">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Environment ID</p>
        </div>
        <p className="text-base uppercase text-200-gray">{environment.F1EnvironmentId}</p>
      </div>
      <div className="flex flex-row py-2 bg-blue-600">
        <div className="w-48 ml-8 mr-8">
          <p className="text-base text-teal-500 uppercase">Fett target</p>
        </div>
        <p className="text-base text-200-gray">{environment.FPGAIp}</p>
      </div>
      <div className="flex flex-row items-center justify-end py-2 my-10 bg-blue-600">
        <button
          className={`w-48 px-2 py-1 mr-10 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded ${
            isLoading || isDisabled || isResetDisabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            environment.Status !== 'running'
              ? 'bg-gray-600 cursor-default'
              : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
          }`}
          type="submit"
          onClick={event => updateInstanceStatus(event, 'resetting')}
          disabled={isLoading || isResetDisabled || isDisabled || environment.Status !== 'running'}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Reset Target'}
        </button>
        <button
          className={`w-48 px-2 py-1 mr-10 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded ${
            isLoading || isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            environment.Status === 'terminated' ||
            environment.Status === 'terminating' ||
            environment.Status === 'queueing'
              ? 'bg-gray-600 cursor-default'
              : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
          }`}
          type="submit"
          onClick={event => updateInstanceStatus(event, 'terminating')}
          disabled={
            isLoading ||
            isDisabled ||
            environment.Status === 'terminated' ||
            environment.Status === 'terminating' ||
            environment.Status === 'queueing'
          }
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Terminate Instance'}
        </button>
      </div>
    </>
  );
};

export default InstanceDetail;

InstanceDetail.propTypes = {
  environment: PropTypes.object,
  fetchEnvironments: PropTypes.func,
};
