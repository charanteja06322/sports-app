import React from 'react';

const TeamsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Teams
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Browse and join sports teams in your area.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => alert('Teams functionality would be here')}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
          >
            View Available Teams
          </button>
          
          <button
            onClick={() => alert('Create team functionality would be here')}
            className="w-full px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition-colors"
          >
            Create New Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
