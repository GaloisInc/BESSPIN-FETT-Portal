import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

const LoginReceiver = props => {
  const { auth, location, history, setStorage } = props;
  auth.parseCognitoWebResponse(location.hash);
  return <div />;
  // return <Redirect to={{ pathname: '/home' }} />;
};

export default withRouter(LoginReceiver);

LoginReceiver.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  auth: PropTypes.any.isRequired,
  history: ReactRouterPropTypes.history,
  setStorage: PropTypes.func.isRequired,
};
