import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not found. App is running in Local Mock Mode.');
}

// Helper to create a dummy promise that resolves to standard empty responses
const mockResponse = (data: any = null, error: any = null) => {
  return Promise.resolve({ data, error });
};

// Mock client that prevents crashes when Supabase is not configured
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => mockResponse(),
    signInWithPassword: () => mockResponse(),
    signOut: () => Promise.resolve({ error: null }),
    verifyOtp: () => mockResponse(),
    resend: () => mockResponse(),
  },
  from: () => {
    const chain = {
      select: () => chain,
      insert: () => mockResponse([]),
      update: () => chain,
      upsert: () => mockResponse([]),
      delete: () => chain,
      eq: () => chain,
      single: () => Promise.resolve({ data: null, error: new Error('Mock Mode') }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
    };
    return chain;
  }
};

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (mockSupabase as any);

export const isSupabaseConfigured = isConfigured;
