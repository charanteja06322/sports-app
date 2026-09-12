import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Team Store
 * Manages teams and user team memberships
 */
export const useTeamStore = create(
  devtools((set, get) => ({
    // State
    teams: [],
    userTeams: [],
    selectedTeam: null,
    loading: false,
    error: null,

    // Actions
    setTeams: (teams) => set(() => ({ teams })),

    setUserTeams: (teams) => set(() => ({ userTeams: teams })),

    setSelectedTeam: (team) => set(() => ({ selectedTeam: team })),

    setLoading: (loading) => set(() => ({ loading })),

    setError: (error) => set(() => ({ error })),

    clearError: () => set(() => ({ error: null })),

    addTeam: (team) =>
      set((state) => ({
        teams: [...state.teams, team],
      })),

    updateTeam: (teamId, updates) =>
      set((state) => ({
        teams: state.teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t)),
      })),

    deleteTeam: (teamId) =>
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== teamId),
        userTeams: state.userTeams.filter((t) => t.id !== teamId),
      })),

    joinTeam: (teamId) =>
      set((state) => {
        const team = state.teams.find((t) => t.id === teamId);
        if (team && !state.userTeams.find((t) => t.id === teamId)) {
          return {
            userTeams: [...state.userTeams, team],
          };
        }
        return state;
      }),

    leaveTeam: (teamId) =>
      set((state) => ({
        userTeams: state.userTeams.filter((t) => t.id !== teamId),
      })),

    getTeamById: (teamId) => {
      return get().teams.find((t) => t.id === teamId);
    },

    getUserTeamById: (teamId) => {
      return get().userTeams.find((t) => t.id === teamId);
    },
  }))
);
