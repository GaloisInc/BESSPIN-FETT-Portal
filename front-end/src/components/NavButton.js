import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function NavButton({ icon, routeName, path, currentRoute }) {
  return (
    <li className={`flex flex-row h-8 items-center hover:bg-blue-600 ${currentRoute.includes(routeName) && 'bg-blue-600'}`}>
      <div className={`w-1 h-8 ${currentRoute.includes(routeName) && 'bg-blue-300'}`} />
      <img className="pr-3 ml-3 w-6" src={icon} alt="" />
      <Link className="uppercase" to={path}>
        <h6>{routeName}</h6>
      </Link>
    </li>
  );
}

NavButton.propTypes = {
  routeName: PropTypes.string,
  path: PropTypes.string,
  currentRoute: PropTypes.string,
  icon: PropTypes.any,
};
