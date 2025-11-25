// src/database/db.ts
import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('aktiviteettiapp.db');

      // Aktiviteettitaulu
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          time TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL
        );
      `);

      // Osallistujataulu
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS participants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          activityId INTEGER NOT NULL,
          name TEXT NOT NULL
        );
      `);

      // Suosikkitaulu (vain activityId)
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
          activityId INTEGER PRIMARY KEY
        );
      `);

      return db;
    })();
  }

  return dbPromise;
};
