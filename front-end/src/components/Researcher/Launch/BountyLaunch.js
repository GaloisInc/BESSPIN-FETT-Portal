import React from 'react';
import LaunchTable from './LaunchTable';

export default function BountyLaunch() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">launch instance</h3>
      <p className="pt-4 text-gray-200">
        This interface may be used to launch new instances. Select the desired Type/Processor/OS combination and click Launch. A maximum of one
        running instance is enforced.
      </p>
      <div className="flex flex-row w-full mt-4">
        <LaunchTable />
      </div>
    </div>
  );
}
