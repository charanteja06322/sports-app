/**
 * Authentication Context
 * Global state management for authentication with Supabase
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

let googleConfigApplied = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Configure Google Sign-In safely after mount (prevents cold-start crashes)
    if (!googleConfigApplied) {
      try {
        GoogleSignin.configure({
          webClientId: '587530106324-knlifam9o70uc46nimg0hgpfut3faavu.apps.googleusercontent.com',
        });
        googleConfigApplied = true;
      } catch (e) {
        console.error('[Auth] GoogleSignin.configure failed:', e);
      }
    }

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (__DEV__) console.log('[Auth] Event:', event);
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
      console.error('[Auth] Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const signUp = async ({ email, password, full_name }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name } } });
    if (error) throw error;
    if (data?.session?.user) { setUser(data.session.user); setIsAuthenticated(true); }
    else if (data?.user) { setUser(data.user); setIsAuthenticated(false); }
    return data;
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type === 'cancelled') return null;
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens?.idToken || userInfo?.data?.idToken;
      if (!idToken) throw new Error('No ID token from Google');
      const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
      if (error) throw error;
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      try { if (GoogleSignin.hasPreviousSignIn()) { await GoogleSignin.signOut(); } } catch {}
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) { throw error; }
  };

  const value = { user, loading, isAuthenticated, signIn, signUp, signInWithGoogle, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};