import React from 'react';
import Button from './Button';
import './Navbar.css';

interface NavbarProps {
  onProfileClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-actions">
        <Button variant="secondary" className="icon-btn" onClick={onProfileClick} title="Impostazioni">
          ⚙️
        </Button>
        <Button variant="secondary" className="icon-btn" onClick={onLogout} title="Logout">
          🚪
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
