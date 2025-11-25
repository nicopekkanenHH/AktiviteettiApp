// src/services/activityService.ts
import { getDb } from 'database/db';
import { Activity } from 'models/Activity';

// -----------------------------
// ACTIVITIES
// -----------------------------

export const fetchActivities = async (): Promise<Activity[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>('SELECT * FROM activities;');

  return rows.map((row: any) => ({
    id: String(row.id),
    name: row.name,
    description: row.description,
    category: row.category,
    time: row.time,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    participants: [],
  }));
};

export const getActivityById = async (
  activityId: string
): Promise<Activity | null> => {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM activities WHERE id = ?;',
    activityId
  );

  if (!row) return null;

  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    category: row.category,
    time: row.time,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    participants: [],
  };
};

export const createActivity = async (
  activity: Omit<Activity, 'id' | 'participants'>
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO activities (name, description, category, time, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?);`,
    activity.name,
    activity.description,
    activity.category,
    activity.time,
    activity.location.latitude,
    activity.location.longitude
  );
};

export const updateActivity = async (
  activity: Omit<Activity, 'participants'>
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE activities
     SET name = ?, description = ?, category = ?, time = ?, latitude = ?, longitude = ?
     WHERE id = ?;`,
    activity.name,
    activity.description,
    activity.category,
    activity.time,
    activity.location.latitude,
    activity.location.longitude,
    activity.id
  );
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync('DELETE FROM participants WHERE activityId = ?;', activityId);
  await db.runAsync('DELETE FROM favorites WHERE activityId = ?;', activityId);
  await db.runAsync('DELETE FROM activities WHERE id = ?;', activityId);
};

// -----------------------------
// PARTICIPANTS
// -----------------------------

export const fetchParticipants = async (
  activityId: string
): Promise<string[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT name FROM participants WHERE activityId = ?;',
    activityId
  );
  return rows.map((row: any) => row.name);
};

export const joinActivity = async (
  activityId: string,
  name: string
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO participants (activityId, name) VALUES (?, ?);',
    activityId,
    name
  );
};

export const leaveActivity = async (
  activityId: string,
  name: string
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM participants WHERE activityId = ? AND name = ?;',
    activityId,
    name
  );
};

// -----------------------------
// FAVORITES
// -----------------------------

// HUOM: varmista, että favorites-taulu luodaan database/db.ts:ssä
// CREATE TABLE IF NOT EXISTS favorites (activityId TEXT PRIMARY KEY);

export const addFavorite = async (activityId: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR IGNORE INTO favorites (activityId) VALUES (?);',
    activityId
  );
};

export const removeFavorite = async (activityId: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync('DELETE FROM favorites WHERE activityId = ?;', activityId);
};

export const isFavorite = async (activityId: string): Promise<boolean> => {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    'SELECT * FROM favorites WHERE activityId = ?;',
    activityId
  );
  return !!row;
};

export const fetchFavoriteActivities = async (): Promise<Activity[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT a.*
     FROM activities a
     JOIN favorites f ON f.activityId = a.id;`
  );

  return rows.map((row: any) => ({
    id: String(row.id),
    name: row.name,
    description: row.description,
    category: row.category,
    time: row.time,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
    participants: [],
  }));
};

// "Omat aktiviteetit" – ei kirjautumista → nyt kaikki
export const fetchUserActivities = async (): Promise<Activity[]> => {
  return fetchActivities();
};
