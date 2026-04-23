import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqlite = SQLite.openDatabaseSync("jobtrack.db");
export const db = drizzle(sqlite, { schema });

export async function initDB() {
  // doing the table setup here so the app can just call this once on startup
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      colour TEXT NOT NULL,
      icon TEXT NOT NULL,
      user_id INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      role_name TEXT NOT NULL,
      date TEXT NOT NULL,
      metric INTEGER NOT NULL DEFAULT 1,
      category_id INTEGER NOT NULL,
      notes TEXT,
      user_id INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      changed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      goal INTEGER NOT NULL,
      category_id INTEGER,
      user_id INTEGER NOT NULL
    );
  `);
}
