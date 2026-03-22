import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold tracking-wider flex items-center gap-2">
            🌱 FarmToWindow
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
              {user.role === 'FARMER' && (
                <Link to="/farmer" className="text-white hover:text-green-200 font-medium">Dashboard</Link>
              )}
              {user.role === 'CUSTOMER' && (
                <>
                  <Link to="/customer" className="text-white hover:text-green-200 font-medium">Shop</Link>
                  <Link to="/customer/orders" className="text-white hover:text-green-200 font-medium">My Orders</Link>
                  <Link to="/customer/cart" className="text-white hover:text-green-200 font-medium">Cart</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-white hover:text-green-200 font-medium">Admin Panel</Link>
              )}
              
              <Link to="/profile" className="text-white hover:text-green-200 font-medium">Profile</Link>
              
              <div className="flex items-center gap-2 pl-4 border-l border-green-400">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-white hover:text-red-200 transition-colors text-sm font-bold"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 font-medium">Login</Link>
                <Link to="/register" className="bg-white text-green-600 px-4 py-2 rounded-md font-bold hover:bg-green-50 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
