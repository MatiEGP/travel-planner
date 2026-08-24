import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DiscoveryNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-soft' : 'bg-transparent'
      }`}
      data-testid="discovery-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/">
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Travel Planner
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/planificaciones" className={`hover:text-ocean-500 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}>
              Planner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DiscoveryNavbar;
