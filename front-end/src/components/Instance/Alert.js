import React from 'react';
import PropTypes from 'prop-types';
import alert from '../../assets/alert.svg';
import greenAlert from '../../assets/greenAlert.png';
import amberAlert from '../../assets/amberAlert.png';

const Alert = ({ status }) => {
  const statusColorSelect = () => {
    if (status === 'running') {
      return <img src={greenAlert} alt="green exclamation" />;
    }
    if (status === 'provisioning' || status === 'terminating' || status === 'queueing') {
      return <img src={amberAlert} alt="amber exclamation" />;
    }
    if (status === 'terminated' || status === 'failed') {
      return <img src={alert} alt="red exclamation" />;
    }
  };

  const alertIcon = statusColorSelect();
  return <>{alertIcon}</>;
};

export default Alert;

Alert.propTypes = {
  status: PropTypes.string,
};
