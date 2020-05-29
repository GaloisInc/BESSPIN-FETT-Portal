/* eslint-disable */

import React from 'react';

const Navigation = props => (
  <ul>
    <li onClick={() => props.update('Announcements')}>Announcements</li>
    <li onClick={() => props.update('ResMessages')}>Messages</li>
  </ul>
);

export default Navigation;
