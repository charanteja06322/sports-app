/**
 * Profile Service
 * Handle user profile operations with Supabase
 */
import { supabase } from '../config/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  cricket_role?: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  batting_style?: 'right-hand' | 'left-hand';
  bowling_style?: 'fast' | 'medium' | 'spin';
  created_at: string;
  updated_at: string;
}

class ProfileService {
  /**
   * Get current user's profile
   */
  async getMyProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  /**
   * Get profile by ID
   */
  async getProfileById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  /**
   * Update profile
   */
  async updateProfile(updates: Partial<Profile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      await this.updateProfile({ avatar_url: data.publicUrl });

      return data.publicUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload avatar');
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          *,
          match:match_id (
            id,
            match_date,
            match_type,
            team1:team1_id (name),
            team2:team2_id (name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch player stats');
    }
  }
}

export const profileService = new ProfileService();
