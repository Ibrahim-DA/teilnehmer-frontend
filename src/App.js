import React, { useState, useEffect } from 'react';
import ParticipantList from './components/ParticipantList';
import ParticipantForm from './components/ParticipantForm';
import { supabase } from './services/supabase';

function App() {
  const [participants, setParticipants] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'create'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Teilnehmer mit Teilnahme- und Kursdaten abrufen
      const { data: participantsData, error: participantsError } = await supabase
        .from('teilnahme')
        .select(`
          id,
          aktiv_start,
          aktiv_ende,
          status,
          teilnehmer:teilnehmer_id (id, vorname, nachname, email),
          kurs:kurs_id (id, name)
        `);
      
      if (participantsError) throw participantsError;
      
      // Kurse für Dropdowns abrufen
      const { data: coursesData, error: coursesError } = await supabase
        .from('kurs')
        .select('*');
      
      if (coursesError) throw coursesError;
      
      setParticipants(participantsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Teilnehmerverwaltung</h1>
      
      {view === 'list' && (
        <>
          <button 
            className="btn btn-primary mb-3"
            onClick={() => {
              setSelectedParticipant(null);
              setView('create');
            }}
          >
            Neuen Teilnehmer anlegen
          </button>
          <ParticipantList 
            participants={participants}
            onSelect={(participant) => {
              setSelectedParticipant(participant);
              setView('detail');
            }}
          />
        </>
      )}
      
      {(view === 'detail' || view === 'create') && (
        <ParticipantForm
          participant={selectedParticipant}
          courses={courses}
          onSave={() => {
            fetchData();
            setView('list');
          }}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  );
}

export default App;