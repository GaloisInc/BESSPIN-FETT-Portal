import React from 'react';
import InstanceManagement from '../Instance/InstanceManagement';

export default function AdminDash() {
  const handleScroll = e => e.target.classList.add('fettScroll');
  return (
    <div className="pt-6 pl-12 overflow-y-scroll" style={{ height: '85vh', maxWidth: 1440 }} onScroll={handleScroll}>
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to view all instances provisioned by any research team as well as to connect to AWS
        logs/metrics for specific instances.
      </p>
      <div className="mt-8 grid grid-cols-1 pr-8">
        <InstanceManagement />
      </div>
    </div>
  );
}
