import React from 'react';
import DashTable from './DashTable';
import DashSide from './DashSide';

export default function BountyDash() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <div className="flex flex-row w-full mt-4">
        <DashTable />
        <DashSide />
      </div>
    </div>
  );
}
