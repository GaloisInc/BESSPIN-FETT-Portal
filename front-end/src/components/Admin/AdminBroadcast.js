import React from 'react';
import Comms from '../Communications/Card';

export default function AdminBroadcast() {
  return (
    <div className="h-full pt-6 pl-12 pr-12">
      <h3 className="text-gray-200 uppercase">broadcast</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to broadcast messages visible within the FETT-Portal interface to logged in research
        teams.
      </p>
      <div className="grid grid-cols-5 mt-4">
        <Comms userType="admin" />
      </div>
    </div>
  );
}
