import React from 'react';
import InstanceManagement from '../Instance/InstanceManagement';

export default function AdminDash() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to view all instances provisioned by any research team as well as to connect to AWS
        logs/metrics for specific instances.
      </p>
      <div className="flex flex-row w-full mt-4">
        <InstanceManagement />
      </div>
    </div>
  );
}
