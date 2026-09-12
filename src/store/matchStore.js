import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Match Store
 * Manages matches and match details
 */
export const useMatchStore = create(
  devtools((set, get) => ({
    // State
    matches: [],
    userMatches: [],
    selectedMatch: null,
    loading: false,
    error: null,
    filters: {
      sport: null,
      status: null,
      dateRange: null,
    },

    // Actions
    setMatches: (matches) => set(() => ({ matches })),

    setUserMatches: (matches) => set(() => ({ userMatches: matches })),

    setSelectedMatch: (match) => set(() => ({ selectedMatch: match })),

    setLoading: (loading) => set(() => ({ loading })),

    setError: (error) => set(() => ({ error })),

    clearError: () => set(() => ({ error: null })),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

    clearFilters: () =>
      set(() => ({
        filters: {
          sport: null,
          status: null,
          dateRange: null,
        },
      })),

    addMatch: (match) =>
      set((state) => ({
        matches: [...state.matches, match],
      })),

    updateMatch: (matchId, updates) =>
      set((state) => ({
        matches: state.matches.map((m) => (m.id === matchId ? { ...m, ...updates } : m)),
      })),

    deleteMatch: (matchId) =>
      set((state) => ({
        matches: state.matches.filter((m) => m.id !== matchId),
        userMatches: state.userMatches.filter((m) => m.id !== matchId),
      })),

    joinMatch: (matchId) =>
      set((state) => {
        const match = state.matches.find((m) => m.id === matchId);
        if (match && !state.userMatches.find((m) => m.id === matchId)) {
          return {
            userMatches: [...state.userMatches, match],
          };
        }
        return state;
      }),

    leaveMatch: (matchId) =>
      set((state) => ({
        userMatches: state.userMatches.filter((m) => m.id !== matchId),
      })),

    getMatchById: (matchId) => {
      return get().matches.find((m) => m.id === matchId);
    },

    getFilteredMatches: () => {
      const { matches, filters } = get();
      return matches.filter((match) => {
        if (filters.sport && match.sport !== filters.sport) return false;
        if (filters.status && match.status !== filters.status) return false;
        return true;
      });
    },
  }))
);
