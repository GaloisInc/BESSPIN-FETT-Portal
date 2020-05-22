import React, { useState } from 'react';

export default function Card() {
  const [team, setTeam] = useState('');
  const [vulnurability, setVulnurability] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log('submitting vulnurability');
    // Todo implement ==> search
  };
  return (
    <div className="bg-blue-600" style={{ width: '500px', minHeight: '630px' }}>
      <div className="flex flex-row justify-between pl-4 mt-2 items-center mb-4">
        <h5 className="uppercase text-gray-200">Title</h5>
      </div>
      <div className="self-center bg-blue-700 m-8" style={{ minHeight: '500px' }} />
    </div>
  );
}
