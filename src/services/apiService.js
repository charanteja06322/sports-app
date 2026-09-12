const API_BASE_URL = 'http://localhost:8000/api/v1';

export const sportsApi = {
  // Get live matches from Neon DB
  async getLiveMatches() {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/live`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('Backend offline or fetching local live engine');
      return null;
    }
  },

  // Get player profile by Player ID (e.g. PL-10001)
  async getPlayerByPlayerId(playerId) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/player/${playerId}`);
      if (!res.ok) throw new Error('Player not found');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Create real match in Neon DB
  async createMatch(matchData) {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Join match by code
  async joinMatch(matchCode, playerId, teamSide) {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_code: matchCode, player_id: playerId, team_side: teamSide }),
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }
};

export default sportsApi;
