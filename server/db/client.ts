import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const DB_PATH = './data/cnpa-ge.sqlite'

mkdirSync('data', { recursive: true })

const sqlite = new Database(DB_PATH, { create: true })
export const db = drizzle(sqlite, { schema })

sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ean TEXT NOT NULL UNIQUE,
  plu TEXT NOT NULL,
  description TEXT NOT NULL,
  sublinea TEXT NOT NULL,
  sales REAL NOT NULL DEFAULT 0,
  iabc TEXT NOT NULL DEFAULT 'C'
);
CREATE TABLE IF NOT EXISTS dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS gondolas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dependency_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  UNIQUE(dependency_id, code),
  FOREIGN KEY(dependency_id) REFERENCES dependencies(id)
);
CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  dependency_id INTEGER NOT NULL,
  gondola_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  c INTEGER NOT NULL,
  n INTEGER NOT NULL,
  p INTEGER NOT NULL,
  a INTEGER NOT NULL,
  username TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(dependency_id) REFERENCES dependencies(id),
  FOREIGN KEY(gondola_id) REFERENCES gondolas(id)
);
`)
