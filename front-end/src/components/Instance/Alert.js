import React from 'react';
import PropTypes from 'prop-types';
import alert from '../../assets/alert.svg';
import greenAlert from '../../assets/greenAlert.png';
import amberAlert from '../../assets/amberAlert.png';
import clock from '../../assets/clock.svg';
import stop from '../../assets/stop.svg';

const Alert = ({ status }) => {
  const statusColorSelect = () => {
    switch (status) {
      case 'running':
        return <img src={greenAlert} alt="green exclamation" />;
      case 'queueing':
      case 'provisioning':
        return <img src={clock} alt="clock" />;
      case 'terminating':
        return <img src={amberAlert} alt="amber exclamation" />;
      case 'terminated':
        return <img src={stop} alt="stop" />;
      case 'failed':
      case 'error':
        return <img src={alert} alt="red exclamation" />;
      default:
        return null;
    }
  };

  const alertIcon = statusColorSelect();
  return <>{alertIcon}</>;
};

export default Alert;

Alert.propTypes = {
  status: PropTypes.string,
};
