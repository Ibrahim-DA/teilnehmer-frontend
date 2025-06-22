# Kurs-Teilnehmer-Management

![Hauptoberfläche](screenshots/Teilnehmerverwaltung.png)

## 1. Einführung
Verwaltungssystem für Kurse, Teilnehmer und Zahlungen mit:
- Teilnehmerstammdaten
- Kursplanung
- Zahlungstracking

## 2. Bedienung

### 2.1 Teilnehmer anlegen
![Neuer Teilnehmer](screenshots/Neuteilnehmer.png)

**Schritte:**
1. "+ Neuer Teilnehmer" klicken
2. Pflichtfelder ausfüllen:
   - Vorname
   - Nachname
   - E-Mail
3. Kurs zuweisen
4. Speichern

### 2.2 Kurse verwalten
![Kurs anlegen](screenshots/Neuenkurs.png)

**Felder:**
| Feld | Typ | Beschreibung |
|------|-----|--------------|
| Name | Text | Kursbezeichnung |
| Start | Datum | Kursbeginn |
| Ende | Datum | Optional |

## 3. Datenbank
![Datenbankschema](screenshots/supabase-schema.png)

**Wichtige Tabellen:**
```sql
CREATE TABLE teilnehmer (
  id UUID PRIMARY KEY,
  vorname TEXT NOT NULL,
  email TEXT UNIQUE
);