import React from 'react';
import InstanceManagement from './InstanceManagement';
import Broadcast from './Broadcast';

export default function AdminDash() {
  return (
    <div className="pl-6 pt-4 h-full">
      <h3 className="uppercase text-gray-200">dashboard</h3>
      <p className="text-gray-200 pt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id consectetur
        purus ut faucibus pulvinar elementum integer.
      </p>
      <a href="">
        <h5 className="text-teal-500 uppercase mt-4 underline">view on AWS</h5>
      </a>
      <div className="flex flex-row flex-wrap justify-around w-full mt-4">
        <InstanceManagement />
        <Broadcast />
      </div>
    </div>
  );
}
