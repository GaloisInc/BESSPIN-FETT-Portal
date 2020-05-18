import React, { useState } from 'react';
import DetailsIcon from '@material-ui/icons/Details';

export default function InstanceDetail() {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(prevOpened => !prevOpened);
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 py-2 bg-blue-900">
        <div className="flex flex-row">
          <button type="button" onClick={toggleOpen} className="flex flex-row text-teal-500 outline-none">
            <p className="text-base text-teal-500 uppercase">Instance 1</p>
            <div className="w-1 text-base">
              <DetailsIcon fontSize="inherit" color="inherit" />
            </div>
          </button>
          <div className="flex flex-row justify-between ml-24 ">
            <p className="text-base text-200-gray">LMCO</p>
            <p className="text-base text-200-gray">|</p>
            <p className="text-base text-200-gray">RV32</p>
            <p className="text-base text-200-gray">|</p>
            <p className="text-base text-200-gray">FreeRTOS</p>
          </div>
        </div>
        <div className="flex items-center">
          <button className="px-4 bg-gray-200" type="button">
            <p className="text-sm text-blue-900 uppercase">view on aws</p>
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="flex flex-row py-2 bg-blue-600">
            <div className="w-48 ml-8 mr-8 ">
              <p className="text-base text-teal-500 uppercase">Start of Engagment</p>
            </div>
            <p className="text-base text-200-gray">2:53</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-500">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Total Compute Time</p>
            </div>
            <p className="text-base text-200-gray">0:30</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-600">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Idle Time</p>
            </div>
            <p className="text-base text-200-gray">2:23</p>
          </div>
          <div className="flex flex-row py-2 bg-blue-500">
            <div className="w-48 ml-8 mr-8">
              <p className="text-base text-teal-500 uppercase">Status</p>
            </div>
            <p className="text-base text-200-gray">Running</p>
          </div>
        </>
      )}
    </>
  );
}
