import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsIcon from '@material-ui/icons/Details';
import alert from '../../assets/alert.svg';

const InstanceDetail = ({ environment, index }) => {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(prevOpened => !prevOpened);
  console.log(moment(environment.Created).format('HH:mm'));
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-2 bg-blue-900">
        <div className="flex flex-row">
          <button type="button" onClick={toggleOpen} className="flex flex-row items-center text-teal-500 focus:outline-none">
            <p className="text-base text-teal-500 uppercase">Environment {index + 1}</p>
            <div className="flex items-center w-1 text-base">
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
          <button className="px-4 bg-gray-200" type="button">
            <p className="text-sm text-blue-900 uppercase">view on aws</p>
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
            <p className="text-base text-200-gray">{environment.Created && moment(environment.Created).format('MM/DD/YY hh:mm A')}</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-600">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Idle Time</p>
            </div>
            <p className="text-base text-200-gray">{environment.IdleTime && moment(environment.IdleTime).format('HH:mm')}</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-700">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Total Compute Time</p>
            </div>
            <p className="text-base text-200-gray">{environment.IdleTime && moment(environment.IdleTime).format('HH:mm')}</p>
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
        </>
      )}
    </>
  );
};

export default InstanceDetail;

InstanceDetail.propTypes = {
  environment: PropTypes.object,
  index: PropTypes.number,
};
