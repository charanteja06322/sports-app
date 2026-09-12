/**
 * Central export point for all Zustand stores
 */

export { useAuthStore } from './authStore';
export { useSportStore } from './sportStore';
export { useTeamStore } from './teamStore';
export { useMatchStore } from './matchStore';
export { useFriendStore } from './friendStore';
export { useUIStore, useNotification } from './uiStore';

// Export all stores as a combined hook for convenience
export const useStore = () => ({
  auth: useAuthStore(),
  sport: useSportStore(),
  team: useTeamStore(),
  match: useMatchStore(),
  friend: useFriendStore(),
  ui: useUIStore(),
});
