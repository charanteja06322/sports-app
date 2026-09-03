/**
 * Supabase Configuration
 * Initialize Supabase client for authentication and database
 * NOTE: Migrated to Neon - Supabase no longer used
 */
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy Supabase config - not actually used
// Real backend is at FastAPI/Neon
const SUPABASE_URL = 'https://dummy.supabase.co';
const SUPABASE_ANON_KEY = 'dummy-key-for-compatibility';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
