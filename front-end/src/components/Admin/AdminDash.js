import React from 'react';
import InstanceManagement from '../Instance/InstanceManagement';
import Comms from '../Communications/Card';

export default function AdminDash() {
  return (
    <div className="h-full pt-6 pl-12">
      <h3 className="text-gray-200 uppercase">dashboard</h3>
      <p className="pt-4 text-gray-200">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <h5 className="mt-4 text-teal-500 underline uppercase cursor-pointer">view on AWS</h5>
      <div className="flex flex-row w-full mt-4">
        <InstanceManagement />
        <Comms userType="admin" />
      </div>
    </div>
  );
}
