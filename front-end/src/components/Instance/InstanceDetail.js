import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsIcon from '@material-ui/icons/Details';
import { CircularProgress } from '@material-ui/core';
import { ec2StatusUpdate } from '../../services/launcher';
import Alert from './Alert';

const InstanceDetail = ({ environment, index, fetchEnvironments }) => {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isForceDisabled, setIsForceDisabled] = useState(false);

  const updateInstanceStatus = async (event, newStatus) => {
    event.preventDefault();
    setIsLoading(true);
    if (newStatus === 'terminating') {
      setIsDisabled(true);
    } else if (newStatus === 'forcing') {
      setIsForceDisabled(true);
    }
    try {
      await ec2StatusUpdate(environment, newStatus);
      fetchEnvironments();
      setIsLoading(false);
    } catch (error) {
      console.log(`Error updating instance${error}`);
      setIsLoading(false);
    }
  };
  const toggleOpen = () => setOpen(prevOpened => !prevOpened);

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-2 bg-blue-900">
        <div className="flex flex-row">
          <button
            type="button"
            onClick={toggleOpen}
            className="flex flex-row items-center text-teal-500 focus:outline-none"
          >
            <p className="text-base text-teal-500 uppercase">Environment {index + 1}</p>
            <div className={`flex items-center w-1 text-base ${!open && 'transform -rotate-90 ml-2 mt-2'}`}>
              <DetailsIcon fontSize="inherit" color="inherit" />
            </div>
          </button>
          <div className="flex flex-row justify-between" style={{ marginLeft: '4.25em' }}>
            <p className="text-base text-200-gray">{environment.Type}</p>
            <p className="text-base text-200-gray"> | </p>
            <p className="text-base text-200-gray">{environment.Processor}</p>
            <p className="text-base text-200-gray"> | </p>
            <p className="text-base text-200-gray">{environment.OS}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            disabled={
              environment.Status === 'provisioning' || environment.Status === 'terminated' || !environment.FPGAIp
            }
            className={`px-4 ${
              environment.Status === 'provisioning' || environment.Status === 'terminated' || !environment.FPGAIp
                ? 'bg-gray-600 cursor-default'
                : 'bg-gray-200'
            } rounded`}
            type="button"
          >
            <p className="text-sm text-blue-900 uppercase">
              {environment.Status === 'provisioning' || environment.Status === 'terminated' || !environment.FPGAIp ? (
                'View On AWS'
              ) : (
                <a
                  href={`https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#dashboards:name=FettPortal${
                    environment.F1EnvironmentId
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View On AWS
                </a>
              )}
            </p>
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="flex flex-row py-2 bg-blue-600">
            <div className="w-48 ml-8 mr-8 ">
              <p className="text-base text-teal-500 uppercase">Environment id</p>
            </div>
            <p className="text-base text-200-gray">{environment.F1EnvironmentId}</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-700">
            <div className="w-48 ml-8 mr-8 ">
              <p className="text-base text-teal-500 uppercase">Start of Engagment</p>
            </div>
            <p className="text-base text-200-gray">
              {environment.Created && moment(environment.Created).format('MM/DD/YY hh:mm A')}
            </p>
          </div>
          {/* <div className="flex flex-row py-2 bg-blue-600">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Idle Time</p>
            </div>
            <p className="text-base text-200-gray">
              {environment.IdleTime && moment(environment.IdleTime).format('HH:mm')}
            </p>
          </div>
          <div className="flex flex-row py-2 bg-blue-700">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Total Compute Time</p>
            </div>
            <p className="text-base text-200-gray">
              {environment.IdleTime && moment(environment.IdleTime).format('HH:mm')}
            </p>
          </div> */}
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
              <p className="text-base text-teal-500 uppercase">Fett target</p>
            </div>
            <p className="text-base text-200-gray">{environment.FPGAIp}</p>
          </div>
          <div className="flex flex-row justify-end">
            <button
              className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-56 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDisabled || environment.Status === 'terminated' || environment.Status === 'terminating'
                  ? 'bg-gray-600 cursor-default'
                  : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
              }`}
              type="submit"
              onClick={event => updateInstanceStatus(event, 'terminating')}
              disabled={
                isLoading || isDisabled || environment.Status === 'terminated' || environment.Status === 'terminating'
              }
            >
              {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Terminate Instance'}
            </button>
            <button
              className={` px-2 mr-10 mt-4 mb-4 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded w-56 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isForceDisabled || environment.Status === 'terminated' || environment.Status === 'forcing'
                  ? 'bg-gray-600 cursor-default'
                  : 'bg-gray-200 hover:bg-teal-500 hover:text-gray-200'
              }`}
              type="submit"
              onClick={event => updateInstanceStatus(event, 'forcing')}
              disabled={
                isLoading || isForceDisabled || environment.Status === 'terminated' || environment.Status === 'forcing'
              }
            >
              {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Force Terminate Instance'}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default InstanceDetail;

InstanceDetail.propTypes = {
  environment: PropTypes.object,
  index: PropTypes.number,
  fetchEnvironments: PropTypes.func,
};
