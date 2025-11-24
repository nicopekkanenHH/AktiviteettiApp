
// activityService.ts
import * as SQLite from 'expo-sqlite';
import { Activity } from 'models/Activity';  // varmista että polku on oikein

type SQLiteDatabase = SQLite.SQLiteDatabase;

let db: SQLiteDatabase | null = null;

const openDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  const database = await SQLite.openDatabaseAsync('aktiviteettiapp.db');
  db = database;
  return db;
};

const createTables = async (): Promise<void> => {
  const database = await openDb();
  database.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        date TEXT NOT NULL,
        createdByUserId TEXT,
        participants TEXT,
        maxParticipants INTEGER
      );
    `, [], 
    () => { /* success */ }, 
    (_, error): boolean => {
      console.error('Error creating table activities:', error);
      return false;
    });
  });
};

const serializeParticipants = (participants?: string[]): string | null =>
  participants ? JSON.stringify(participants) : null;

const deserializeParticipants = (participantsStr: string | null): string[] =>
  participantsStr ? JSON.parse(participantsStr) : [];

export const activityService = {
  initialize: async (): Promise<void> => {
    await createTables();
  },

  async getAllActivities(): Promise<Activity[]> {
    const database = await openDb();
    return new Promise<Activity[]>((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM activities;',
          [],
          (_tx, result) => {
            const rows = (result.rows as any)._array;
            const activities: Activity[] = rows.map((row: any) => ({
              id: row.id.toString(),
              title: row.title,
              description: row.description ?? '',
              location: { latitude: row.latitude, longitude: row.longitude },
              date: new Date(row.date),
              createdByUserId: row.createdByUserId,
              participants: deserializeParticipants(row.participants),
              maxParticipants: row.maxParticipants ?? undefined,
            }));
            resolve(activities);
          },
          (_tx, error) => {
            console.error('Error fetching activities from SQLite:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  },

  async createActivity(activity: Omit<Activity, 'id'>): Promise<void> {
    const database = await openDb();
    return new Promise<void>((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          `INSERT INTO activities 
            (title, description, latitude, longitude, date, createdByUserId, participants, maxParticipants)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            activity.title,
            activity.description,
            activity.location.latitude,
            activity.location.longitude,
            activity.date.toISOString(),
            activity.createdByUserId,
            serializeParticipants(activity.participants),
            activity.maxParticipants ?? null,
          ],
          () => {
            resolve();
          },
          (_tx, error) => {
            console.error('Error inserting activity into SQLite:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  },
};
