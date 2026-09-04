import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSport } from '../context/SportContext';
import { FiLogOut, FiMoon, FiSun, FiUser, FiPlus, FiSearch } from 'react-icons/fi';

const Header = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedSport, setSport } = useSport();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // In a real app, you would call the logout function from auth context
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Link to="/" className="text-xl font-bold flex items-center space-x-2">
            <span>⚽</span>
            <span>SportsApp</span>
          </Link>
          
          {/* Sport selector - moved from home page to here as requested */}
          <div className="relative">
            <label htmlFor="sport-select" className="block text-sm font-medium mb-1">
              Select Sport
            </label>
            <select
              id="sport-select"
              value={selectedSport ? selectedSport.id : ''}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Sports</option>
              {[{ id: 'football', name: 'Football', icon: '⚽' },
               { id: 'basketball', name: 'Basketball', icon: '🏀' },
               { id: 'tennis', name: 'Tennis', icon: '🎾' },
               { id: 'cricket', name: 'Cricket', icon: '🏏' },
               { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
               { id: 'baseball', name: 'Baseball', icon: '⚾' },
               { id: 'rugby', name: 'Rugby', icon: '🏈' },
               { id: 'hockey', name: 'Hockey', icon: '🏒' }].map(sport => (
                <option key={sport.id} value={sport.id}>
                  {sport.icon} {sport.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // In real app, this would toggle a dropdown menu
                    alert('Profile menu would open here');
                  }}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <img
                    src={currentUser.photoURL || 'https://via.placeholder.com/40'}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:inline">{currentUser.displayName || 'User'}</span>
                </button>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <FiMoon /> : <FiSun />}
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
