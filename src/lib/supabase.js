/**
 * Supabase Client Configuration
 * 
 * This module initializes the Supabase client with environment variables.
 * Replace the placeholder values with your actual Supabase credentials.
 * 
 * @see https://supabase.com/docs/guides/client-auth
 */

// Supabase URL and Anon Key from your Supabase project
// Replace these with your actual credentials from Supabase Dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrveddjgzgweauaufvdd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SGdpfGXMiAuTmVcS_w4vsg_wl3JSxX'

export const supabase = createClient(supabaseUrl, supabaseKey)
/**
 * Creates the Supabase client instance
 * This client is used for all database operations and authentication
 */
  // Fallback/mock client for development without Supabase
  from: (table) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
}

export default supabase

