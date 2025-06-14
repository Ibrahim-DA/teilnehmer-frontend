import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ParticipantForm = ({ participant, courses, onSave, onCancel }) => {
  const isEditMode = !!participant;
  const [formMode, setFormMode] = useState('existing'); // 'existing' oder 'new'
  
  // Zustände für Formularfelder
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [kursId, setKursId] = useState('');
  const [newKursName, setNewKursName] = useState('');
  const [newKursStart, setNewKursStart] = useState('');
  const [newKursEnde, setNewKursEnde] = useState('');
  const [aktivStart, setAktivStart] = useState('');
  const [aktivEnde, setAktivEnde] = useState('');
  const [status, setStatus] = useState('aktiv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setVorname(participant.teilnehmer.vorname);
      setNachname(participant.teilnehmer.nachname);
      setEmail(participant.teilnehmer.email);
      setKursId(participant.kurs.id);
      setAktivStart(participant.aktiv_start);
      setAktivEnde(participant.aktiv_ende || '');
      setStatus(participant.status);
    }
  }, [participant, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalKursId = kursId;

      // Neuen Kurs anlegen, wenn im "manuellen" Modus
      if (formMode === 'new') {
        if (!newKursName || !newKursStart) {
          throw new Error('Kursname und Startdatum sind erforderlich');
        }
        
        const { data: newCourse, error: courseError } = await supabase
          .from('kurs')
          .insert([{ 
            name: newKursName, 
            startdatum: newKursStart, 
            enddatum: newKursEnde || null 
          }])
          .select()
          .single();
        
        if (courseError) throw courseError;
        finalKursId = newCourse.id;
      }

      if (isEditMode) {
        // Aktualisiere Teilnehmer
        await supabase
          .from('teilnehmer')
          .update({ vorname, nachname, email })
          .eq('id', participant.teilnehmer.id);

        // Aktualisiere Teilnahme
        await supabase
          .from('teilnahme')
          .update({
            kurs_id: finalKursId,
            aktiv_start: aktivStart,
            aktiv_ende: aktivEnde || null,
            status
          })
          .eq('id', participant.id);
      } else {
        // Neuen Teilnehmer anlegen
        const { data: newTeilnehmer, error: teilnehmerError } = await supabase
          .from('teilnehmer')
          .insert([{ vorname, nachname, email }])
          .select()
          .single();
        
        if (teilnehmerError) throw teilnehmerError;

        // Neue Teilnahme anlegen
        await supabase
          .from('teilnahme')
          .insert([{
            teilnehmer_id: newTeilnehmer.id,
            kurs_id: finalKursId,
            aktiv_start: aktivStart,
            status
          }]);
      }
      
      onSave();
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">
          {isEditMode ? 'Teilnehmer bearbeiten' : 'Neuen Teilnehmer anlegen'}
        </h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Teilnehmerdaten (unverändert) */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Vorname *</label>
              <input
                type="text"
                className="form-control"
                value={vorname}
                onChange={(e) => setVorname(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nachname *</label>
              <input
                type="text"
                className="form-control"
                value={nachname}
                onChange={(e) => setNachname(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Kursauswahl-Optionen */}
          {!isEditMode && (
            <div className="mb-3">
              <label className="form-label">Kursoption *</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="courseOption"
                  id="existingCourse"
                  checked={formMode === 'existing'}
                  onChange={() => setFormMode('existing')}
                />
                <label className="form-check-label" htmlFor="existingCourse">
                  Existierenden Kurs auswählen
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="courseOption"
                  id="newCourse"
                  checked={formMode === 'new'}
                  onChange={() => setFormMode('new')}
                />
                <label className="form-check-label" htmlFor="newCourse">
                  Neuen Kurs anlegen
                </label>
              </div>
            </div>
          )}
          
          {/* Existierender Kurs (Dropdown) */}
          {(formMode === 'existing' || isEditMode) && (
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Kurs auswählen *</label>
                <select
                  className="form-select"
                  value={kursId}
                  onChange={(e) => setKursId(e.target.value)}
                  required={formMode === 'existing' || isEditMode}
                >
                  <option value="">Bitte wählen</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({new Date(course.startdatum).toLocaleDateString('de-DE')} -{' '}
                      {course.enddatum ? new Date(course.enddatum).toLocaleDateString('de-DE') : 'laufend'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Status *</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="aktiv">Aktiv</option>
                  <option value="abgebrochen">Abgebrochen</option>
                  <option value="abgeschlossen">Abgeschlossen</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Manuelle Kurseingabe */}
          {!isEditMode && formMode === 'new' && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h5 className="mb-3">Neuen Kurs anlegen</h5>
              
              <div className="mb-3">
                <label className="form-label">Kursname *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newKursName}
                  onChange={(e) => setNewKursName(e.target.value)}
                  required
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Startdatum *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newKursStart}
                    onChange={(e) => setNewKursStart(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Enddatum</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newKursEnde}
                    onChange={(e) => setNewKursEnde(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Aktivitätszeitraum */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Aktivitätsstart *</label>
              <input
                type="date"
                className="form-control"
                value={aktivStart}
                onChange={(e) => setAktivStart(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Aktivitätsende</label>
              <input
                type="date"
                className="form-control"
                value={aktivEnde}
                onChange={(e) => setAktivEnde(e.target.value)}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-1"></span>
              ) : null}
              {isEditMode ? 'Speichern' : 'Anlegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;