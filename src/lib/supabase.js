import { createClient } from '@supabase/supabase-js'

// Agora o sistema é OBRIGADO a usar as chaves que você colocou na Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Isso vai te avisar no console se a Vercel não estiver lendo as chaves
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variáveis de ambiente não encontradas!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
