import { createClient } from '@supabase/supabase-js'

// Initialize with environment variables
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
  {
    auth: {
      persistSession: false, // More secure for production
      autoRefreshToken: false
    }
  }
)

export default supabase