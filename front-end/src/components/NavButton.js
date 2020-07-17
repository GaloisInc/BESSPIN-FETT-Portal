import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';

export default function NavButton({ icon, routeName, path, currentRoute }) {
  const Icon = () => {
    if (routeName === 'broadcast') {
      return (
        <div className="pr-3 ml-3">
          <ChatBubbleOutlineIcon style={{ fontSize: 15 }} />
        </div>
      );
    }
    if (routeName === 'metrics') {
      return (
        <div className="pr-3 ml-3">
          <AssessmentOutlinedIcon style={{ fontSize: 15 }} />
        </div>
      );
    }
    return <img className="pr-3 ml-3 w-6" src={icon} alt="" />;
  };

  return (
    <li
      className={`flex flex-row h-8 pr-2 items-center hover:bg-blue-600 ${currentRoute.includes(routeName) &&
        'bg-blue-600'}`}
    >
      <div className={`w-1 h-8 ${currentRoute.includes(routeName) && 'bg-blue-300'}`} />
      <Icon />
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
