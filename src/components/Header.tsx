import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-gray-800">TaskMaster</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-full">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-700">{user.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;