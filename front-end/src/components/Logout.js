import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const Logout = ({ logout }) => {
  useEffect(() => {
    logout();
  });
  return <Redirect to={{ pathname: '/' }} />;
};
export default Logout;

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};
