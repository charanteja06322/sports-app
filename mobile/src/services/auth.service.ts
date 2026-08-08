/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../config/supabase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '587530106324-knlifam9o70uc46nimg0hgpfut3faavu.apps.googleusercontent.com',
  iosClientId: '587530106324-knlifam9o70uc46nimg0hgpfut3faavu.apps.googleusercontent.com',
});

class AuthService {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  }

  async signInWithGoogle() {
    try {
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign in with Google (native, v13+ returns { type, data })
      const userInfo = await GoogleSignin.signIn();
      if ((userInfo as any)?.type === 'cancelled') {
        return null; // User dismissed the Google sheet
      }

      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens?.idToken || (userInfo as any)?.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Sign in to Supabase with Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Google Sign In failed');
    }
  }

  async signOut() {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Sign out from Google if signed in
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // Google not signed in, ignore
      }
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      return null;
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated() {
    return this.getSession().then(session => !!session);
  }
}

export const authService = new AuthService();
