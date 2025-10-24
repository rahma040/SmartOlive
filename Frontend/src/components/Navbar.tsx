import { Link } from './Router';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-90 transition-opacity">
            <Leaf className="w-6 h-6" />
            <span>SmartOlive AI</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/" className="hover:text-green-200 transition-colors">Dashboard</Link>
                <Link to="/irrigation" className="hover:text-green-200 transition-colors">Irrigation</Link>
                <Link to="/fertilization" className="hover:text-green-200 transition-colors">Fertilization</Link>
                <Link to="/pest" className="hover:text-green-200 transition-colors">Pest Detector</Link>
                <Link to="/history" className="hover:text-green-200 transition-colors">History</Link>
                <Link to="/profile" className="hover:text-green-200 transition-colors">{profile?.name}</Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-green-800 hover:bg-green-900 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 transition-colors">Login</Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-green-800 hover:bg-green-900 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-green-600">
            {user ? (
              <>
                <Link to="/" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/irrigation" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Irrigation</Link>
                <Link to="/fertilization" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Fertilization</Link>
                <Link to="/pest" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Pest Detector</Link>
                <Link to="/history" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>History</Link>
                <Link to="/profile" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>{profile?.name}</Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-2 hover:text-green-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="block py-2 hover:text-green-200 transition-colors" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
