import React from 'react';

const MatchesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Matches
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          View and manage your sports matches.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => alert('Matches functionality would be here')}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
          >
            View Matches
          </button>
          
          <button
            onClick={() => alert('Create match functionality would be here')}
            className="w-full px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition-colors"
          >
            Create Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
