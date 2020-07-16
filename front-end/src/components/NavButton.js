import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

export default function NavButton({ icon, routeName, path, currentRoute }) {
  return (
    <li
      className={`flex flex-row h-8 pr-2 items-center hover:bg-blue-600 ${
        currentRoute.includes(routeName) ? 'bg-blue-600' : ''
      }`}
    >
      <div className={`w-1 h-8 ${currentRoute.includes(routeName) && 'bg-blue-300'}`} />
      {routeName === 'broadcast' ? (
        <div className="pr-3 ml-3">
          <ChatBubbleOutlineIcon style={{ fontSize: 15 }} />
        </div>
      ) : null}
      <Link className="uppercase" to={path}>
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-3">
            <img className="pr-3 ml-3 w-6" src={icon} alt="" />
          </div>
          <div className="col-span-9">
            <h6 style={{ fontSize: 'calc(10px + (20 - 10) * ((100vw - 600px) / (2560 - 600)))' }}>{routeName}</h6>
          </div>
        </div>
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
