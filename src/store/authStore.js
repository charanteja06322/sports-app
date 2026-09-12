import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Auth Store
 * Manages user authentication state
 */
export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        currentUser: null,
        loading: true,
        error: null,
        isAuthenticated: false,

        // Actions
        setUser: (user) =>
          set(() => ({
            currentUser: user,
            isAuthenticated: !!user,
            loading: false,
            error: null,
          })),

        setLoading: (loading) => set(() => ({ loading })),

        setError: (error) =>
          set(() => ({
            error,
            loading: false,
          })),

        clearError: () => set(() => ({ error: null })),

        login: async (email, password) => {
          set(() => ({ loading: true, error: null }));
          try {
            // Firebase auth would be called here
            // For now, this is a placeholder
            set(() => ({ loading: false }));
          } catch (error) {
            set(() => ({
              error: error.message,
              loading: false,
            }));
            throw error;
          }
        },

        logout: () =>
          set(() => ({
            currentUser: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          })),

        updateUserProfile: (updates) =>
          set((state) => ({
            currentUser: state.currentUser
              ? { ...state.currentUser, ...updates }
              : null,
          })),
      }),
      {
        name: 'auth-store',
      }
    )
  )
);
