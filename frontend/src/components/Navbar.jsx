import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from '../assets/img/Asset 5Whisper.svg';

const Navbar = () => (
  <nav className="nav">
    <div className="flex justify-evenly space-x-6 w-1/3">
      {/* Use Link component for navigation */}
      <Link to="/encode" className="glitch-button">
        <p className='font-black'>Encode</p>
      </Link>
    </div>
    <div className='p-12 '>
      <img src={logo} alt="Logo" className="h-36 w-36" />
    </div>
    <div className="flex justify-evenly space-x-6 w-1/3">
      {/* Use Link component for navigation */}
      <Link to="/decode" className="glitch-button-right">
        <p className='font-black'>Decode</p>
      </Link>
    </div>
  </nav>
);

export default Navbar;
