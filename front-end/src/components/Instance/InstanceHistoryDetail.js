import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsIcon from '@material-ui/icons/Details';
import alert from '../../assets/alert.svg';

const InstanceDetail = ({ environment, index }) => (
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
  </>
);

export default InstanceDetail;

InstanceDetail.propTypes = {
  environment: PropTypes.object,
  index: PropTypes.number,
};
