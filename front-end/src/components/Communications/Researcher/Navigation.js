/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';

const Navigation = ({update, setNav}) => {
	console.log(setNav);
	console.log(update);
	
	const NavStyle = 'border-solid border-b-4 border-teal-600'

return(
  <ul className="flex flex-column justify-start">
    <li className={`mr-4 cursor-pointer ${setNav==="Announcements"? NavStyle : ''}`}  onClick={() => update('Announcements')}>Announcements</li>
    <li className={`mr-4 cursor-pointer ${setNav==="ResMessages"? NavStyle : ''}`}  onClick={() => update('ResMessages')}>Messages</li>
  </ul>
);
}

export default Navigation;

Navigation.propTypes = {
  update: PropTypes.function,
  setNav: PropTypes.string,
};