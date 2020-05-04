import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ isLoading }) =>
  isLoading ? (
    <span className="spinner-container">
      <h1 className="loading-text">Loading</h1>
      <div className="spinner-inner-container">
        <div className="spinner" />
      </div>
    </span>
  ) : null;
export default Loading;

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
