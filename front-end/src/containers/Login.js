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
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsDisabled(true);
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
        setError(error.code);
      } else if (error.code === 'NotAuthorizedException' || username === '') {
        // The error happens when the incorrect password is provided
        setError('NotAuthorizedException');
      } else if (error.code === 'UserNotFoundException') {
        setError(error.code);
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
        console.log(error.code);
      }
      setIsDisabled(false);
    }
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  return (
    <div
      className="flex justify-center min-h-screen bg-blue-700"
      style={{
        backgroundImage: `url(${backgroundCity}), url(${backgroundPlanet})`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'bottom center, 90% 5%',
      }}
    >
      <div className="flex-col self-center w-64">
        <h1
          className="bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundLogo})`, height: '90px', width: '266px' }}
        >
          <span className="hidden">FETT Portal</span>
        </h1>
        <p className="mb-8 text-center text-teal-500 uppercase">Sign in to access FETT Portal</p>

        <label htmlFor="username" className="mt-8 text-gray-200 font-body">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          className="w-full p-1 text-gray-200 bg-blue-600 border border-gray-200 border-solid rounded"
        />
        <label htmlFor="password" className="mt-8 text-gray-200 font-body">
          Password
        </label>
        <input
          id="password"
          value={password}
          type="password"
          onChange={event => setPassword(event.target.value)}
          className={`w-full p-1 text-gray-200 bg-blue-600 border ${
            error && error === 'NotAuthorizedException' ? 'border-red-500' : 'border-gray-200'
          } border-solid rounded`}
          onKeyPress={handleKeyPress}
        />
        {error && error === 'NotAuthorizedException' && (
          <p className="text-sm text-red-500">Incorrect username or password</p>
        )}
        <button
          className={`w-full px-2 py-1 mt-8 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded hover:bg-teal-500 hover:text-gray-200 ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={isDisabled}
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
