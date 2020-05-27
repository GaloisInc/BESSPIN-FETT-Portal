/* eslint-disable */

import React from 'react';

const Navigation = props => (
  <ul>
    <li onClick={() => props.update('Broadcast')}>Broadcast</li>
    <li onClick={() => props.update('History')}>History</li>
    <li onClick={() => props.update('Messages')}>Messages</li>
  </ul>
);

export default Navigation;
