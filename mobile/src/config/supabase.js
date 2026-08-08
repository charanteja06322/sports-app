/**
 * Supabase Configuration
 * Initialize Supabase client for authentication and database
 */
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://pbfmcwldsqsnrareqfvq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZm1jd2xkc3FzbnJhcmVxZnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDEzOTgsImV4cCI6MjEwMDk3NzM5OH0.3eHq3m7QjRL-FdWr8KJKIRVvM4xWo8usvZhmxgegtY0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
