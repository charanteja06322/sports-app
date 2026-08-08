/**
 * Authentication Service (DEPRECATED — use AuthContext)
 * NOT imported by any screen. Kept as reference.
 */
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../config/supabase';

// GoogleSignin.configure() is NOT called here — already configured in AuthContext.js.

class AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error; return data;
  }
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) throw error; return data;
  }
  async signInWithGoogle() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    if ((userInfo as any)?.type === 'cancelled') return null;
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens?.idToken || (userInfo as any)?.data?.idToken;
    if (!idToken) throw new Error('No ID token from Google');
    const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    if (error) throw error; return data;
  }
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    try { await GoogleSignin.signOut(); } catch {}
  }
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null; return user;
  }
}
export const authService = new AuthService();