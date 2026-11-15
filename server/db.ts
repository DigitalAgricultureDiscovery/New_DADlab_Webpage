import sanitize from 'sanitize-html';
import { initialProfile, initialRecords } from './initial-content.ts';
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { SiteProfile } from '../src/types/cms.ts';

const DATA_DIR = path.resolve(process.env.CMS_DATA_DIR || path.join(process.cwd(), 'data'));
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'purdue_lab_cms.db');
const SECRET_PATH = path.join(DATA_DIR, '.session_secret');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export function getSessionSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  if (fs.existsSync(SECRET_PATH)) {
    return fs.readFileSync(SECRET_PATH, 'utf8').trim();
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_PATH, secret, { mode: 0o600 });
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export function sanitizeHtml(input: string): string {
  return sanitize(input || '', { allowedTags: sanitize.defaults.allowedTags.concat(['img']), allowedAttributes: { ...sanitize.defaults.allowedAttributes, img: ['src', 'alt', 'width', 'height'] } });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const db = new DatabaseSync(DB_PATH);

export function initDb(): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor')),
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      published_date TEXT NOT NULL,
      summary TEXT NOT NULL,
      content_html TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      image_caption TEXT NOT NULL DEFAULT '',
      featured_on_home INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
      author_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      year INTEGER NOT NULL,
      venue TEXT NOT NULL,
      pub_type TEXT NOT NULL,
      topic TEXT NOT NULL,
      abstract TEXT NOT NULL,
      doi_url TEXT NOT NULL DEFAULT '',
      publisher_url TEXT NOT NULL DEFAULT '',
      pdf_url TEXT NOT NULL DEFAULT '',
      bibtex TEXT NOT NULL DEFAULT '',
      featured_on_home INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published')) DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_number TEXT NOT NULL,
      title TEXT NOT NULL,
      semester TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      description_html TEXT NOT NULL,
      topics_json TEXT NOT NULL,
      objectives_json TEXT NOT NULL,
      syllabus_url TEXT NOT NULL DEFAULT '',
      materials_json TEXT NOT NULL DEFAULT '[]',
      university_catalog_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK(status IN ('draft', 'active', 'archived')) DEFAULT 'active',
      featured_on_home INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      research_area TEXT NOT NULL,
      overview TEXT NOT NULL,
      objectives_html TEXT NOT NULL,
      methodology_html TEXT NOT NULL,
      progress_notes TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      image_caption TEXT NOT NULL DEFAULT '',
      project_status TEXT NOT NULL CHECK(project_status IN ('ongoing', 'completed', 'archived')) DEFAULT 'ongoing',
      related_publication_ids_json TEXT NOT NULL DEFAULT '[]',
      collaborators TEXT NOT NULL DEFAULT '',
      funding_info TEXT NOT NULL DEFAULT '',
      featured_on_home INTEGER NOT NULL DEFAULT 0,
      publish_status TEXT NOT NULL CHECK(publish_status IN ('draft', 'published')) DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      appointment_type TEXT NOT NULL,
      description_html TEXT NOT NULL,
      qualifications_html TEXT NOT NULL,
      responsibilities_html TEXT NOT NULL,
      application_instructions TEXT NOT NULL,
      application_url TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL DEFAULT '',
      position_status TEXT NOT NULL CHECK(position_status IN ('Open', 'Closed', 'Filled', 'Archived')) DEFAULT 'Open',
      featured_on_home INTEGER NOT NULL DEFAULT 1,
      publish_status TEXT NOT NULL CHECK(publish_status IN ('draft', 'published')) DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS redirects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_path TEXT UNIQUE NOT NULL,
      to_path TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      inquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at TEXT NOT NULL
    );
  `);

  // SQLite requires a table rebuild to extend an existing CHECK constraint.
  const projectSchema = (db.prepare("SELECT sql FROM sqlite_master WHERE name='projects'").get() as {sql: string}).sql;
  if (!projectSchema.includes("'archived'")) {
    db.exec('BEGIN');
    try {
      db.exec(projectSchema.replace('CREATE TABLE projects', 'CREATE TABLE projects_updated').replace("'ongoing', 'completed'", "'ongoing', 'completed', 'archived'"));
      db.exec('INSERT INTO projects_updated SELECT * FROM projects; DROP TABLE projects; ALTER TABLE projects_updated RENAME TO projects; COMMIT;');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  const newsColumns = (db.prepare('PRAGMA table_info(news)').all() as {name:string}[]).map(c=>c.name);
  if (!newsColumns.includes('source_url')) db.exec("ALTER TABLE news ADD COLUMN source_url TEXT NOT NULL DEFAULT ''");
  if (!newsColumns.includes('attachments_json')) db.exec("ALTER TABLE news ADD COLUMN attachments_json TEXT NOT NULL DEFAULT '[]'");
  seedInitialData();
}

function seedInitialData(): void {
  if (db.prepare("SELECT 1 FROM site_settings WHERE key='profile'").get()) return;
  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    db.prepare('INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)').run('profile', JSON.stringify(initialProfile), now);
    for (const [table, records] of Object.entries(initialRecords)) {
      for (const record of records) {
        const row = { ...record, created_at: now, updated_at: now };
        const columns = Object.keys(row);
        db.prepare(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`).run(...Object.values(row));
      }
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
