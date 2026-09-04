import React, { createContext, useContext, useState } from 'react';

const SportContext = createContext();

export const useSport = () => {
  const context = useContext(SportContext);
  if (!context) {
    throw new Error('useSport must be used within a SportProvider');
  }
  return context;
};

export const SportProvider = ({ children }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [sports, setSports] = useState([
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'rugby', name: 'Rugby', icon: '🏈' },
    { id: 'hockey', name: 'Hockey', icon: '🏒' }
  ]);

  const setSport = (sportId) => {
    const sport = sports.find(s => s.id === sportId);
    setSelectedSport(sport || null);
  };

  return (
    <SportContext.Provider value={{
      selectedSport,
      sports,
      setSport
    }}>
      {children}
    </SportContext.Provider>
  );
};
