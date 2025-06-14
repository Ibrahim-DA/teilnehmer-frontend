import { createClient } from '@supabase/supabase-js';

// DEINE SUPABASE-DATEN HIER EINTRAGEN
const SUPABASE_URL = "https://biekxrgpjivpgsbbfdkg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZWt4cmdwaml2cGdzYmJmZGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQ0NjYsImV4cCI6MjA2NTM0MDQ2Nn0.FdFGTvuGsMPYeh6PjXke_ROss020C_kiQbPKn5T0_iw";

// Erstelle den Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportiere als benannten Export
export { supabase };