import React from 'react';
import { Redirect } from 'react-router-dom';

const NoMatch = () => <Redirect to={{ pathname: '/' }} />;
export default NoMatch;
