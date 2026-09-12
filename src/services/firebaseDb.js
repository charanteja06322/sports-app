import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

/**
 * USERS SERVICE
 */

export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      preferences: {
        favoritesSports: [],
        theme: 'light',
        notifications: true,
      },
    });
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateUserPreferences = async (userId, preferences) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      preferences: { ...preferences },
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

/**
 * TEAMS SERVICE
 */

export const createTeam = async (teamData, userId) => {
  try {
    const newTeamRef = doc(collection(db, 'teams'));
    await setDoc(newTeamRef, {
      ...teamData,
      ownerId: userId,
      members: [userId],
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, teamId: newTeamRef.id };
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const getTeam = async (teamId) => {
  try {
    const docSnap = await getDoc(doc(db, 'teams', teamId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
};

export const getTeams = async (filters = {}) => {
  try {
    let q = collection(db, 'teams');
    const constraints = [];

    if (filters.sport) {
      constraints.push(where('sport', '==', filters.sport));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.userId) {
      constraints.push(where('members', 'array-contains', filters.userId));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(
      query(q, ...constraints)
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting teams:', error);
    throw error;
  }
};

export const updateTeam = async (teamId, updates) => {
  try {
    await updateDoc(doc(db, 'teams', teamId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

export const joinTeam = async (teamId, userId) => {
  try {
    await updateDoc(doc(db, 'teams', teamId), {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error joining team:', error);
    throw error;
  }
};

export const leaveTeam = async (teamId, userId) => {
  try {
    await updateDoc(doc(db, 'teams', teamId), {
      members: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
};

export const deleteTeam = async (teamId) => {
  try {
    await deleteDoc(doc(db, 'teams', teamId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

/**
 * MATCHES SERVICE
 */

export const createMatch = async (matchData, userId) => {
  try {
    const newMatchRef = doc(collection(db, 'matches'));
    await setDoc(newMatchRef, {
      ...matchData,
      createdBy: userId,
      status: 'scheduled',
      score: { home: 0, away: 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, matchId: newMatchRef.id };
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const getMatch = async (matchId) => {
  try {
    const docSnap = await getDoc(doc(db, 'matches', matchId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting match:', error);
    throw error;
  }
};

export const getMatches = async (filters = {}) => {
  try {
    let q = collection(db, 'matches');
    const constraints = [];

    if (filters.teamId) {
      constraints.push(where('teamId', '==', filters.teamId));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    constraints.push(orderBy('date', 'desc'));
    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    const querySnapshot = await getDocs(query(q, ...constraints));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export const updateMatchScore = async (matchId, homeScore, awayScore) => {
  try {
    await updateDoc(doc(db, 'matches', matchId), {
      score: { home: homeScore, away: awayScore },
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating match score:', error);
    throw error;
  }
};

export const updateMatchStatus = async (matchId, status) => {
  try {
    await updateDoc(doc(db, 'matches', matchId), {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
};

export const deleteMatch = async (matchId) => {
  try {
    await deleteDoc(doc(db, 'matches', matchId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

/**
 * FRIENDS SERVICE
 */

export const addFriendRequest = async (fromUserId, toUserId) => {
  try {
    const requestRef = doc(
      collection(db, 'friends', toUserId, 'pending')
    );
    await setDoc(requestRef, {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return { success: true, requestId: requestRef.id };
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (userId, requestId, fromUserId) => {
  try {
    const batch = writeBatch(db);

    // Remove from pending
    batch.delete(doc(db, 'friends', userId, 'pending', requestId));

    // Add to connections for both users
    batch.set(doc(db, 'friends', userId, 'connections', fromUserId), {
      userId: fromUserId,
      connectedAt: serverTimestamp(),
      status: 'active',
    });

    batch.set(doc(db, 'friends', fromUserId, 'connections', userId), {
      userId,
      connectedAt: serverTimestamp(),
      status: 'active',
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (userId, requestId) => {
  try {
    await deleteDoc(doc(db, 'friends', userId, 'pending', requestId));
    return { success: true };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'friends', userId, 'pending'))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error;
  }
};

export const getFriends = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'friends', userId, 'connections'))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'friends', userId, 'connections', friendId));
    batch.delete(doc(db, 'friends', friendId, 'connections', userId));
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

/**
 * NOTIFICATIONS SERVICE
 */

export const addNotification = async (userId, notification) => {
  try {
    const notifRef = doc(collection(db, 'notifications', userId, 'items'));
    await setDoc(notifRef, {
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    });
    return { success: true, notificationId: notifRef.id };
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId, unreadOnly = false) => {
  try {
    let q = collection(db, 'notifications', userId, 'items');
    const constraints = [];

    if (unreadOnly) {
      constraints.push(where('read', '==', false));
    }

    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(20));

    const querySnapshot = await getDocs(query(q, ...constraints));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    await updateDoc(
      doc(db, 'notifications', userId, 'items', notificationId),
      { read: true }
    );
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const deleteNotification = async (userId, notificationId) => {
  try {
    await deleteDoc(
      doc(db, 'notifications', userId, 'items', notificationId)
    );
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * BATCH OPERATIONS
 */

export const getUserWithTeams = async (userId) => {
  try {
    const user = await getUserProfile(userId);
    const teams = await getTeams({ userId });
    return { user, teams };
  } catch (error) {
    console.error('Error getting user with teams:', error);
    throw error;
  }
};

export const getTeamWithMatches = async (teamId) => {
  try {
    const team = await getTeam(teamId);
    const matches = await getMatches({ teamId });
    return { team, matches };
  } catch (error) {
    console.error('Error getting team with matches:', error);
    throw error;
  }
};
