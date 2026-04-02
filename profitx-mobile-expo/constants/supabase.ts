import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const extra = (Constants.expoConfig && (Constants.expoConfig.extra as any)) || (Constants.manifest && (Constants.manifest.extra as any)) || {};
const supabaseUrl = envUrl ?? extra.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? extra.SUPABASE_URL;
const supabaseAnonKey = envKey ?? extra.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseKey ?? extra.SUPABASE_KEY ?? extra.anonKey;

let _supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase configuration. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment or app.json extra.');

  // Provide a minimal stub so the app can handle missing config at runtime
  // without crashing during module evaluation.
  _supabase = {
    auth: {
      signUp: async () => ({ data: null, error: { message: 'Missing Supabase configuration' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Missing Supabase configuration' } }),
      signOut: async () => ({ error: { message: 'Missing Supabase configuration' } }),
    },
  };
} else {
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = _supabase;
