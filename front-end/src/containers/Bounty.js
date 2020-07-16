import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from '@material-ui/core';
import BountyDash from '../components/Researcher/BountyDash';
import BountyLaunch from '../components/Researcher/Launch/BountyLaunch';
import Learn from '../components/Researcher/Learn/Learn';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import close from '../assets/close.svg';
import CrashReports from '../components/Researcher/Learn/CrashReports';

const Bounty = props => {
  const { isLoggedIn, name } = props;
  const [open, setOpen] = useState(false);
  const checkAuth = isLoggedIn;

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex-col h-full portal-container">
      <Header name={name} />
      <div style={{ minHeight: 'calc(100vh - 6em)' }} className="flex flex-row">
        <Sidebar />
        <div className="bg-blue-700" style={{ width: '88%' }}>
          {checkAuth ? (
            <>
              <Route path="/bountyportal/dashboard" component={BountyDash} />
              <Route path="/bountyportal/launch" component={() => <BountyLaunch handleOpen={handleOpen} />} />
              <Route path="/bountyportal/crashreports" component={CrashReports} />
              <Route path="/bountyportal/learn" component={Learn} />
              <Route exact path="/bountyportal" render={() => <Redirect to="/bountyportal/dashboard" />} />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </div>
        <Modal open={open} handleClose={handleClose}>
          <div
            className="absolute p-8 text-4xl text-gray-200 bg-blue-600 outline-none"
            style={{ width: '800px', top: '30%', left: '50%', marginLeft: '-400px' }}
          >
            <div className="grid grid-cols-12 items-center pb-4">
              <div className="col-span-11">
                <h3>Your SSITH target connection is being provisioned</h3>
              </div>
              <div className="col-span-1">
                <button type="button" onClick={handleClose} className="focus:outline-none">
                  <img src={close} alt="" />
                </button>
              </div>
            </div>
            <div className="pb-4">
              <div>
                <h6>
                  Please be patient as this process can take up to 20 minutes. Once provisioned, if applicable, your SSH
                  credentials are the same as your portal credentials.
                </h6>
              </div>
              <div className="flex flex-row justify-center">
                <button
                  className="self-center w-16 px-2 py-1 mt-8 text-sm font-medium text-blue-700 uppercase bg-gray-200 rounded hover:bg-teal-500 hover:text-gray-200"
                  type="submit"
                  onClick={handleClose}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Bounty;

Bounty.propTypes = {
  isLoggedIn: PropTypes.bool,
  name: PropTypes.string,
};
