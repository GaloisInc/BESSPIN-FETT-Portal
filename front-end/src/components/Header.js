import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, MenuList, Popper, Grow, Paper, ClickAwayListener } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import fettLogo from '../assets/fettLogo.png';

const Header = ({ history }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen(prevOpened => !prevOpened);
  };

  const handleClose = (event, isLoggingOut) => {
    console.log(isLoggingOut);
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    if (isLoggingOut) {
      history.push('/logout');
    }
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className="bg-blue-800 h-24 flex flex-row justify-between items-center flex-initial">
      <img className="h-16 pl-4" src={fettLogo} alt="Fett Logo Arc" />
      <div>
        <button type="button" ref={anchorRef} onClick={handleToggle} className="text-gray-200 text-lg font-body uppercase mr-20">
          Name
        </button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
              <Paper>
                <ClickAwayListener onClickAway={event => handleClose(event, false)}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                    <MenuItem onClick={event => handleClose(event, true)}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default withRouter(Header);

Header.propTypes = {
  history: ReactRouterPropTypes.history,
};
