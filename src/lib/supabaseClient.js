
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://biekxrgpjivpgsbbfdkg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZWt4cmdwaml2cGdzYmJmZGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQ0NjYsImV4cCI6MjA2NTM0MDQ2Nn0.FdFGTvuGsMPYeh6PjXke_ROss020C_kiQbPKn5T0_iw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

