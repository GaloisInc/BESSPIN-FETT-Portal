import React from 'react';
import InstanceHistory from '../Instance/InstanceHistory';
import Comms from '../Communications/Card';

export default function BountyDash() {
  const handleScroll = e => e.target.classList.add('fettScroll');
  return (
    <div className="pt-6 px-12 overflow-y-scroll" style={{ height: '85vh', maxWidth: 1440 }} onScroll={handleScroll}>
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        Use the interface below to understand the status of any instances you have launched, and to manipulate them.
      </p>
      <div className="mt-4 grid grid-cols-12 gap-4">
        <InstanceHistory />
        <Comms userType="researcher" />
      </div>
    </div>
  );
}
