import { supabase } from './services/supabase';

// Test-Abfrage
async function testConnection() {
  console.log('Teste Supabase-Verbindung...');
  
  const { data, error } = await supabase
    .from('teilnehmer')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Fehler:', error.message);
  } else {
    console.log('✅ Verbindung erfolgreich! Daten:', data);
  }
}

// Ausführen
testConnection();