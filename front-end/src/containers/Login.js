/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import { CircularProgress } from '@material-ui/core';

import backgroundCity from '../assets/fett_cityscape.png';
import backgroundLogo from '../assets/fett_logo_login.png';
import backgroundPlanet from '../assets/fett_planets.png';

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const user = await Auth.signIn(username, password);

      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        await Auth.completeNewPassword(user, password);
      }

      props.login();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setPassword('');
      if (error.code === 'PasswordResetRequiredException') {
        // The error happens when the password is reset in the Cognito console
        console.log(error.code);
      } else if (error.code === 'NotAuthorizedException') {
        // The error happens when the incorrect password is provided
        console.log(error.code);
      } else if (error.code === 'UserNotFoundException') {
        console.log(error.code);
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
        console.log(error.code);
      }
    }
  };

  return (
    <div
      className="bg-blue-700 min-h-screen flex justify-center"
      style={{
        backgroundImage: `url(${backgroundCity}), url(${backgroundPlanet})`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'bottom center, 90% 5%',
      }}
    >
      <div className="w-64 flex-col self-center">
        <h1 className="bg-no-repeat" style={{ backgroundImage: `url(${backgroundLogo})`, height: '90px', width: '266px' }}>
          <span className="hidden">FETT Portal</span>
        </h1>
        <p className="text-teal-500 uppercase text-center mb-8">Sign in to access FETT Portal</p>

        <label htmlFor="username" className="text-gray-200 font-body mt-8">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1 rounded"
        />
        <label htmlFor="password" className="text-gray-200 font-body mt-8">
          Password
        </label>
        <input
          id="password"
          value={password}
          type="password"
          onChange={event => setPassword(event.target.value)}
          className="w-full bg-blue-600 border-solid border border-gray-200 text-gray-200 p-1 rounded"
        />
        <button
          className="bg-gray-200 hover:bg-teal-500 text-blue-700 hover:text-gray-200 font-medium py-1 px-2 rounded uppercase w-full mt-8"
          type="submit"
          onClick={event => handleSubmit(event)}
        >
          {isLoading ? <CircularProgress size={12} style={{ color: '#F4F4F4' }} /> : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default withRouter(Login);
Login.propTypes = {
  login: PropTypes.func,
  // history: ReactRouterPropTypes.history,
  // loggedIn: PropTypes.bool.isRequired,
};
