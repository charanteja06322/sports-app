import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateTeamPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Team created successfully!');
      navigate('/teams');
    }, 1500);
  };

  if (!currentUser) {
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Create a New Team
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter team name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Sport
              </label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a sport</option>
                <option value="football">⚽ Football</option>
                <option value="basketball">🏀 Basketball</option>
                <option value="tennis">🎾 Tennis</option>
                <option value="cricket">🏏 Cricket</option>
                <option value="volleyball">🏐 Volleyball</option>
                <option value="baseball">⚾ Baseball</option>
                <option value="rugby">🏈 Rugby</option>
                <option value="hockey">🏒 Hockey</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="4"
                placeholder="Describe your team"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamPage;
