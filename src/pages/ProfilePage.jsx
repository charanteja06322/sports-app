import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSport } from '../context/SportContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { sports, setSport } = useSport();
  const navigate = useNavigate();
  const [favoriteSport, setFavoriteSport] = useState(currentUser?.favoriteSport || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        favoriteSport: favoriteSport || null
      });
      
      if (favoriteSport) {
        setSport(favoriteSport);
      }
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {currentUser && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Welcome, {currentUser.displayName || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser.email}
              </p>
            </div>
            
            {message && (
              <div className={`p-4 mb-4 rounded ${message.includes('successfully') ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                {message}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Sport Preferences
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Favorite Sport
                    </label>
                    <select
                      value={favoriteSport}
                      onChange={(e) => setFavoriteSport(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select a sport</option>
                      {sports.map(sport => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </form>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Account Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Account Settings
                  </button>
                  
                  <button
                    onClick={() => navigate('/friends')}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Manage Friends
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
