/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';

const Navigation = ({update, setNav}) => {
	
	const NavStyle = 'border-solid border-b-4 border-teal-600';
	
	return (
	  <ul className="flex flex-column flex-wrap justify-start">
	    <li className={`mr-4 cursor-pointer ${setNav==="Broadcast"? NavStyle : ''}`} onClick={() => update('Broadcast')}>Broadcast</li>
	    <li className={`mr-4 cursor-pointer ${setNav==="History"? NavStyle : ''}`} onClick={() => update('History')}>History</li>
		<li className={`mr-4 cursor-pointer ${setNav==="Messages"? NavStyle : ''}`} onClick={() => update('Messages')}>Messages</li>
	  </ul>
	);
}
export default Navigation;

Navigation.propTypes = {
  update: PropTypes.func,
  setNav: PropTypes.string,
};