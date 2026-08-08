/**
 * FastAPI Backend Configuration
 * Configure API base URL for backend communication
 */

// FastAPI Backend URL
// For local development on physical device or emulator
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.105:8000/api/v1'  // Development - your machine's IP
  : 'https://your-production-api.com/api/v1';  // Production (deploy backend first)

// For EAS build preview/production, use deployed backend URL
// export const API_BASE_URL = 'https://YOUR_DEPLOYED_URL/api/v1';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    ME: '/auth/me',
    PUBLIC: '/auth/public',
  },
  
  // Teams
  TEAMS: {
    LIST: '/teams',
    CREATE: '/teams',
    DETAIL: (id: string) => `/teams/${id}`,
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    JOIN: (id: string) => `/teams/${id}/join`,
    LEAVE: (id: string) => `/teams/${id}/leave`,
    MEMBERS: (id: string) => `/teams/${id}/members`,
    MY_TEAMS: '/teams/user/my-teams',
  },
  
  // Tournaments
  TOURNAMENTS: {
    LIST: '/tournaments',
    CREATE: '/tournaments',
    DETAIL: (id: string) => `/tournaments/${id}`,
    UPDATE: (id: string) => `/tournaments/${id}`,
    DELETE: (id: string) => `/tournaments/${id}`,
    TEAMS: (id: string) => `/tournaments/${id}/teams`,
    ADD_TEAM: (tournamentId: string, teamId: string) => `/tournaments/${tournamentId}/teams/${teamId}`,
    REMOVE_TEAM: (tournamentId: string, teamId: string) => `/tournaments/${tournamentId}/teams/${teamId}`,
    MY_TOURNAMENTS: '/tournaments/user/my-tournaments',
  },
  
  // Matches
  MATCHES: {
    LIST: '/matches',
    CREATE: '/matches',
    DETAIL: (id: string) => `/matches/${id}`,
    LIVE: '/matches/live',
    UPCOMING: '/matches/upcoming',
    COMPLETED: '/matches/completed',
    BY_TEAM: (teamId: string) => `/matches/team/${teamId}`,
    BY_TOURNAMENT: (tournamentId: string) => `/matches/tournament/${tournamentId}`,
  },
};

// API Request Headers Helper
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const getHeaders = () => ({
  'Content-Type': 'application/json',
});
