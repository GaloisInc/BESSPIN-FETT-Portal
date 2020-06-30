import React from 'react';
import InstanceHistory from '../Instance/InstanceHistory';
import Comms from '../Communications/Card';

export default function BountyDash() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        Use the interface below to understand the status of any instances you have launched, and to manipulate them.
      </p>
      <div className="flex flex-row w-full mt-4 ">
        <InstanceHistory />
        <Comms userType="researcher" />
      </div>
    </div>
  );
}
