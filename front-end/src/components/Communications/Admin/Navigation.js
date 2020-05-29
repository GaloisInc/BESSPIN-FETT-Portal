/* eslint-disable */

import React from 'react';

const Navigation = props => (
  <ul className="flex flex-column justify-start">
    <li className="mr-4" onClick={() => props.update('Broadcast')}>Broadcast</li>
    <li className="mr-4" onClick={() => props.update('History')}>History</li>
	<li className="mr-4" onClick={() => props.update('Messages')}>Messages</li>
  </ul>
);

export default Navigation;
