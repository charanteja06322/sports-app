import React from 'react';

const TeamDetailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Team Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          View and manage your sports team details.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Team Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Team Name: FC Barcelona
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Sport: Football
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Members: 15/20
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Type: Public Team
          </p>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => alert('Edit team functionality would be here')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors mr-2"
          >
            Edit Team
          </button>
          
          <button
            onClick={() => alert('Invite players functionality would be here')}
            className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition-colors mr-2"
          >
            Invite Players
          </button>
          
          <button
            onClick={() => alert('Team settings functionality would be here')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
          >
            Team Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
