import React from 'react';
import PaymentStatus from './PaymentStatus';

const ParticipantList = ({ participants, onSelect }) => {
  if (!participants.length) return <div>Keine Teilnehmer gefunden</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Kurs</th>
            <th>Aktiv seit</th>
            <th>Status</th>
            <th>Offene Raten</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participation) => (
            <tr key={participation.id}>
              <td>{participation.teilnehmer.vorname}</td>
              <td>{participation.teilnehmer.nachname}</td>
              <td>{participation.kurs.name}</td>
              <td>{new Date(participation.aktiv_start).toLocaleDateString('de-DE')}</td>
              <td>
                <span className={`badge ${
                  participation.status === 'aktiv' ? 'bg-success' : 
                  participation.status === 'abgebrochen' ? 'bg-danger' : 'bg-secondary'
                }`}>
                  {participation.status}
                </span>
              </td>
              <td>
                <PaymentStatus teilnahmeId={participation.id} />
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onSelect(participation)}
                >
                  Bearbeiten
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantList;