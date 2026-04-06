import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          💰 ExpenseManager
        </Link>

        {user && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-5 items-center text-sm">
              <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
              <Link to="/transactions" className="hover:text-indigo-200 transition">Transactions</Link>
              <Link to="/add" className="hover:text-indigo-200 transition">Add</Link>
              <Link to="/analytics" className="hover:text-indigo-200 transition">Analytics</Link>
              <span className="text-indigo-300 text-xs">Hi, {user.name} 👋</span>
              <button onClick={handleLogout}
                className="bg-white text-indigo-700 px-3 py-1 rounded-lg font-semibold hover:bg-indigo-100 transition text-xs">
                Logout
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}>
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {user && menuOpen && (
        <div className="md:hidden bg-indigo-800 px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-200 transition py-1">Dashboard</Link>
          <Link to="/transactions" onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-200 transition py-1">Transactions</Link>
          <Link to="/add" onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-200 transition py-1">Add Transaction</Link>
          <Link to="/analytics" onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-200 transition py-1">Analytics</Link>
          <div className="border-t border-indigo-600 pt-2 flex justify-between items-center">
            <span className="text-indigo-300 text-xs">Hi, {user.name} 👋</span>
            <button onClick={handleLogout}
              className="bg-white text-indigo-700 px-3 py-1 rounded-lg font-semibold text-xs">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}