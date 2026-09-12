import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Friend Store
 * Manages friends and friend requests
 */
export const useFriendStore = create(
  devtools((set, get) => ({
    // State
    friends: [],
    friendRequests: [],
    blockedUsers: [],
    loading: false,
    error: null,

    // Actions
    setFriends: (friends) => set(() => ({ friends })),

    setFriendRequests: (requests) => set(() => ({ friendRequests: requests })),

    setBlockedUsers: (users) => set(() => ({ blockedUsers: users })),

    setLoading: (loading) => set(() => ({ loading })),

    setError: (error) => set(() => ({ error })),

    clearError: () => set(() => ({ error: null })),

    addFriend: (user) =>
      set((state) => {
        if (!state.friends.find((f) => f.id === user.id)) {
          return {
            friends: [...state.friends, user],
            friendRequests: state.friendRequests.filter((r) => r.id !== user.id),
          };
        }
        return state;
      }),

    removeFriend: (userId) =>
      set((state) => ({
        friends: state.friends.filter((f) => f.id !== userId),
      })),

    sendFriendRequest: (user) =>
      set((state) => {
        if (!state.friendRequests.find((r) => r.id === user.id)) {
          return {
            friendRequests: [...state.friendRequests, user],
          };
        }
        return state;
      }),

    acceptFriendRequest: (userId) => {
      const { friendRequests } = get();
      const request = friendRequests.find((r) => r.id === userId);
      if (request) {
        set((state) => ({
          friends: [...state.friends, request],
          friendRequests: state.friendRequests.filter((r) => r.id !== userId),
        }));
      }
    },

    rejectFriendRequest: (userId) =>
      set((state) => ({
        friendRequests: state.friendRequests.filter((r) => r.id !== userId),
      })),

    blockUser: (userId) =>
      set((state) => {
        if (!state.blockedUsers.includes(userId)) {
          return {
            blockedUsers: [...state.blockedUsers, userId],
            friends: state.friends.filter((f) => f.id !== userId),
          };
        }
        return state;
      }),

    unblockUser: (userId) =>
      set((state) => ({
        blockedUsers: state.blockedUsers.filter((id) => id !== userId),
      })),

    isFriend: (userId) => {
      return get().friends.some((f) => f.id === userId);
    },

    isBlocked: (userId) => {
      return get().blockedUsers.includes(userId);
    },

    hasFriendRequest: (userId) => {
      return get().friendRequests.some((r) => r.id === userId);
    },
  }))
);
