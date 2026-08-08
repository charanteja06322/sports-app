/**
 * Authentication Context
 * Global state management for authentication with Supabase
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '587530106324-knlifam9o70uc46nimg0hgpfut3faavu.apps.googleusercontent.com',
  iosClientId: '587530106324-knlifam9o70uc46nimg0hgpfut3faavu.apps.googleusercontent.com', // Optional: Add iOS client ID if you have one
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  // Email/Password Sign Up
  const signUp = async ({ email, password, full_name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });
    if (error) throw error;

    // If email confirmations are enabled, Supabase may return `session: null`.
    // In that case, keep the user unauthenticated until they verify and sign in.
    if (data?.session?.user) {
      setUser(data.session.user);
      setIsAuthenticated(true);
    } else if (data?.user) {
      setUser(data.user);
      setIsAuthenticated(false);
    }

    return data;
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Google Sign In flow (v13+ returns { type, data })
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type === 'cancelled') {
        return null; // User dismissed the Google sheet
      }

      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens?.idToken || userInfo?.data?.idToken;

      if (!idToken) throw new Error('No ID token received from Google');

      // Sign in to Supabase with Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw error;

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Sign out from Google if signed in (v13+: hasPreviousSignIn is sync)
      try {
        if (GoogleSignin.hasPreviousSignIn()) {
          await GoogleSignin.signOut();
        }
      } catch (googleError) {
        console.log('Google sign-out skipped:', googleError?.message);
      }

      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
