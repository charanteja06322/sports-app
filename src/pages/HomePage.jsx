import { useState, useEffect } from 'react';
import { useSport } from '../context/SportContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { selectedSport, sports } = useSport();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample content based on sports
  const sampleContent = {
    football: [
      { title: "Weekend Football Match", description: "Join our casual game", type: "match" },
      { title: "Football Skills Workshop", description: "Improve your techniques", type: "event" }
    ],
    basketball: [
      { title: "Basketball Pickup Game", description: "Half-court game", type: "match" },
      { title: "Shooting Practice Session", description: "Work on your shot", type: "event" }
    ],
    tennis: [
      { title: "Tennis Doubles Match", description: "Join our doubles match", type: "match" },
      { title: "Serve Improvement Clinic", description: "Work on your serve", type: "event" }
    ],
    cricket: [
      { title: "Weekend Cricket Match", description: "Join our T20 game", type: "match" },
      { title: "Batting Practice Session", description: "Work on your cover drive", type: "event" }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      const sportContent = sampleContent[selectedSport?.id] || [
        { title: "Select a Sport", description: "Choose your favorite sport in profile to see personalized content", type: "info" }
      ];
      setContent(sportContent);
      setLoading(false);
    }, 500);
  }, [selectedSport]);

  const handleCreateMatch = () => {
    navigate('/matches/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with user info and actions */}
      {currentUser && (
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{currentUser.displayName || 'User'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateMatch}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
              >
                Create Match
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Welcome to SportsApp
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Find, create, and join sports teams in your area. Connect with players who share your passion for the game.
            </p>
          </div>
          
          {/* For You Section - Sport Specific */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              For You ({selectedSport ? sports.find(s => s.id === selectedSport.id)?.name : 'All Sports'})
            </h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading personalized content...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {content.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-0.5 text-xs {item.type === 'match' ? 'bg-blue-100 text-blue-800' : item.type === 'event' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'} rounded">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span>{selectedSport ? sports.find(s => s.id === selectedSport.id)?.name : 'All Sports'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Create Team
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start your own sports team and invite friends to play.
              </p>
              <Link
                to="/teams/create"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded block text-center"
              >
                Create Team
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Join Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse and join existing teams in your favorite sports.
              </p>
              <Link
                to="/teams"
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded block text-center"
              >
                Browse Teams
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Find Players
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with other players and build your sports network.
              </p>
              <Link
                to="/friends"
                className="w-full bg-info-600 hover:bg-info-700 text-white py-2 px-4 rounded block text-center"
              >
                Find Players
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
