import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import alert from '../../assets/alert.svg';
import greenAlert from '../../assets/greenAlert.png';
import amberAlert from '../../assets/amberAlert.png';
import clock from '../../assets/clock.svg';

const Alert = ({ status }) => {
  const statusColorSelect = () => {
    switch (status) {
      case 'running':
        return <img src={greenAlert} alt="green exclamation" />;
      case 'provisioning':
        return <img src={clock} alt="clock" />;
      case 'terminating':
        return <img src={amberAlert} alt="amber exclamation" />;
      case 'queueing':
        return (
          <Icon className="align-middle" style={{ fontSize: 15, color: '#deb200' }}>
            hourglass_full
          </Icon>
        );
      case 'terminated':
        return (
          <Icon className="align-middle" style={{ fontSize: 20, color: '#e10000' }}>
            stop
          </Icon>
        );
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
