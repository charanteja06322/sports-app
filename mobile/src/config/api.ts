/**
 * FastAPI Backend Configuration
 * Configure API base URL for backend communication
 */

// FastAPI Backend URL
// For local development on physical device or emulator
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1'  // Try localhost first (works with some setups)
  : 'https://your-production-api.com/api/v1';  // Production (deploy backend first)

// Alternative URLs if localhost doesn't work:
// iOS simulator: http://localhost:8000/api/v1
// Android emulator: http://10.0.2.2:8000/api/v1 (add firewall exception if needed)
// Physical device: http://YOUR_MACHINE_IP:8000/api/v1 (e.g., http://192.168.x.x:8000/api/v1 or http://10.10.4.16:8000/api/v1)
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
