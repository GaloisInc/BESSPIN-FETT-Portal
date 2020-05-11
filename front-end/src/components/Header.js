import React from 'react';
import fettLogo from '../assets/fettLogo.png';

export default function Header() {
  return (
    <div className="bg-blue-800 h-24 flex flex-row justify-between items-center flex-initial">
      <img className="h-16 pl-4" src={fettLogo} alt="Fett Logo Arc" />
      <h6 className="text-white pr-20">Name</h6>
    </div>
  );
}
