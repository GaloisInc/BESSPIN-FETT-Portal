/* eslint-disable */

import React from 'react';

const Navigation = props => (
  <ul className="flex flex-column justify-start">
    <li className="mr-4" onClick={() => props.update('Announcements')}>Announcements</li>
    <li className="mr-4" onClick={() => props.update('ResMessages')}>Messages</li>
  </ul>
);

export default Navigation;
