import React from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to="/" className="navbar-title">Seat-X</Link> 
      
      </div>
      <div className="navbar-right">
        <FaUserCircle className="icon" title="Profile" />
        <FaSignOutAlt className="icon" title="Logout" />
      </div>
    </nav>
  );
};

export default Navbar;
