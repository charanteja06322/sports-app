import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * UI Store
 * Manages application UI state
 */
export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        theme: 'light',
        sidebarOpen: false,
        notifications: [],
        modals: {},

        // Theme Actions
        setTheme: (theme) => {
          set(() => ({ theme }));
          // Apply theme to DOM
          document.documentElement.classList.toggle('dark', theme === 'dark');
        },

        toggleTheme: () =>
          set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return { theme: newTheme };
          }),

        // Sidebar Actions
        setSidebarOpen: (open) => set(() => ({ sidebarOpen: open })),

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // Notification Actions
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                id: Date.now(),
                duration: 5000,
                ...notification,
              },
            ],
          })),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set(() => ({ notifications: [] })),

        // Modal Actions
        openModal: (modalName, data = null) =>
          set((state) => ({
            modals: {
              ...state.modals,
              [modalName]: { isOpen: true, data },
            },
          })),

        closeModal: (modalName) =>
          set((state) => ({
            modals: {
              ...state.modals,
              [modalName]: { isOpen: false, data: null },
            },
          })),

        closeAllModals: () =>
          set(() => ({
            modals: {},
          })),

        isModalOpen: (modalName) => {
          return (state) => state.modals[modalName]?.isOpen || false;
        },

        getModalData: (modalName) => {
          return (state) => state.modals[modalName]?.data || null;
        },
      }),
      {
        name: 'ui-store',
      }
    )
  )
);

// Helper functions
export const useNotification = () => {
  const { addNotification, removeNotification } = useUIStore();

  return {
    success: (message, duration = 5000) => {
      const id = addNotification({
        type: 'success',
        message,
        duration,
      });
      setTimeout(() => removeNotification(id), duration);
    },
    error: (message, duration = 5000) => {
      const id = addNotification({
        type: 'error',
        message,
        duration,
      });
      setTimeout(() => removeNotification(id), duration);
    },
    info: (message, duration = 5000) => {
      const id = addNotification({
        type: 'info',
        message,
        duration,
      });
      setTimeout(() => removeNotification(id), duration);
    },
    warning: (message, duration = 5000) => {
      const id = addNotification({
        type: 'warning',
        message,
        duration,
      });
      setTimeout(() => removeNotification(id), duration);
    },
  };
};
