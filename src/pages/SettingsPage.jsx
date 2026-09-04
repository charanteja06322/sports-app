import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // In a real app, you would call logout from auth context
    window.location.href = '/login';
  };

  if (!currentUser) {
    return <div>Please log in to access settings</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Settings
            </h1>
            
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <FiSettings className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                      Appearance
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Choose your preferred color scheme
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Light Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={theme === 'light'}
                    onChange={(e) => {
                      if (e.target.checked) toggleTheme();
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                    Dark Mode
                  </span>
                </div>
              </div>
              
              {/* Account Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <FiUser className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                      Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Manage your profile and security settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              
              {/* Logout */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center space-x-3">
                  <FiLogOut className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                      Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Securely sign out of your account
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
