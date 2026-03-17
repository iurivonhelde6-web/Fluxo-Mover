/**
 * Supabase Client Configuration
 * 
 * This module initializes the Supabase client with environment variables.
 * Replace the placeholder values with your actual Supabase credentials.
 * @see https://supabase.com/docs/guides/client-auth
 */
import { createClient } from '@supabase/supabase-js'
// Supabase URL and Anon Key from your Supabase project
// Replace these with your actual credentials from Supabase Dashboard
const supabaseUrl= import.meta.env.VITE_SUPABASE_URL || 'https://rrveddjgzgweauaufvdd.supabase.co'
const supabaseAnonKey= import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SGdpfGXMiAuTmVcS_w4vsg_wl3JSxX'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



export default supabase

