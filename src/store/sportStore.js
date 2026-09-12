import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const SPORTS_LIST = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'rugby', name: 'Rugby', icon: '🏈' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
];

/**
 * Sport Store
 * Manages sports selection and preferences
 */
export const useSportStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        sports: SPORTS_LIST,
        selectedSport: null,
        favoriteSports: [],

        // Actions
        setSport: (sportId) => {
          set(() => {
            const sport = SPORTS_LIST.find((s) => s.id === sportId);
            return {
              selectedSport: sport || null,
            };
          });
        },

        addFavoriteSport: (sportId) =>
          set((state) => {
            if (!state.favoriteSports.includes(sportId)) {
              return {
                favoriteSports: [...state.favoriteSports, sportId],
              };
            }
            return state;
          }),

        removeFavoriteSport: (sportId) =>
          set((state) => ({
            favoriteSports: state.favoriteSports.filter((s) => s !== sportId),
          })),

        isFavoriteSport: (sportId) => {
          const state = get();
          return state.favoriteSports.includes(sportId);
        },

        getSportById: (sportId) => {
          return SPORTS_LIST.find((s) => s.id === sportId);
        },

        getAllSports: () => get().sports,
      }),
      {
        name: 'sport-store',
      }
    )
  )
);
