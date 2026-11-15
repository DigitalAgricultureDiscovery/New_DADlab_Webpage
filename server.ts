import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  db,
  initDb,
  getSessionSecret,
  hashPassword,
  verifyPassword,
  sanitizeHtml,
  slugify,
  UPLOADS_DIR,
} from './server/db.ts';
import type {
  UserRole,
  SiteProfile,
  NewsItem,
  PublicationItem,
  CourseItem,
  ResearchProjectItem,
  OpportunityItem,
} from './src/types/cms.ts';

initDb();

const SESSION_SECRET = getSessionSecret();
const COOKIE_NAME = 'purdue_lab_session';
const PORT = 3000;

interface SessionPayload {
  uid: number;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

interface AuthedRequest extends Request {
  user?: SessionPayload;
}

function signSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifySession(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
    if (!decoded.exp || decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) {
      const k = part.slice(0, idx).trim();
      const v = decodeURIComponent(part.slice(idx + 1).trim());
      out[k] = v;
    }
  }
  return out;
}

function attachSession(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  const session = verifySession(token);
  if (session) {
    // Verify user still exists in DB so revoked users lose access immediately
    const userRow = db
      .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
      .get(session.uid) as { id: number; email: string; name: string; role: UserRole } | undefined;
    if (userRow) {
      req.user = {
        uid: userRow.id,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role,
        exp: session.exp,
      };
    }
  }
  next();
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Administrator privileges required for this action' });
    return;
  }
  next();
}

// Row mappers
function mapNewsRow(row: Record<string, unknown>): NewsItem {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: row.category as NewsItem['category'],
    published_date: String(row.published_date),
    summary: String(row.summary),
    content_html: String(row.content_html),
    image_url: String(row.image_url || ''),
    image_caption: String(row.image_caption || ''),
    featured_on_home: Boolean(row.featured_on_home),
    status: row.status as NewsItem['status'],
    author_name: String(row.author_name),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapPubRow(row: Record<string, unknown>): PublicationItem {
  return {
    id: Number(row.id),
    title: String(row.title),
    authors: String(row.authors),
    year: Number(row.year),
    venue: String(row.venue),
    pub_type: row.pub_type as PublicationItem['pub_type'],
    topic: String(row.topic),
    abstract: String(row.abstract),
    doi_url: String(row.doi_url || ''),
    publisher_url: String(row.publisher_url || ''),
    pdf_url: String(row.pdf_url || ''),
    bibtex: String(row.bibtex || ''),
    featured_on_home: Boolean(row.featured_on_home),
    status: row.status as PublicationItem['status'],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapCourseRow(row: Record<string, unknown>): CourseItem {
  return {
    id: Number(row.id),
    course_number: String(row.course_number),
    title: String(row.title),
    semester: String(row.semester),
    academic_year: String(row.academic_year),
    description_html: String(row.description_html),
    topics: JSON.parse(String(row.topics_json || '[]')),
    objectives: JSON.parse(String(row.objectives_json || '[]')),
    syllabus_url: String(row.syllabus_url || ''),
    materials: JSON.parse(String(row.materials_json || '[]')),
    university_catalog_url: String(row.university_catalog_url || ''),
    status: row.status as CourseItem['status'],
    featured_on_home: Boolean(row.featured_on_home),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapProjectRow(row: Record<string, unknown>): ResearchProjectItem {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    research_area: String(row.research_area),
    overview: String(row.overview),
    objectives_html: String(row.objectives_html),
    methodology_html: String(row.methodology_html),
    progress_notes: String(row.progress_notes || ''),
    image_url: String(row.image_url || ''),
    image_caption: String(row.image_caption || ''),
    project_status: row.project_status as ResearchProjectItem['project_status'],
    related_publication_ids: JSON.parse(String(row.related_publication_ids_json || '[]')),
    collaborators: String(row.collaborators || ''),
    funding_info: String(row.funding_info || ''),
    featured_on_home: Boolean(row.featured_on_home),
    publish_status: row.publish_status as ResearchProjectItem['publish_status'],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapOpportunityRow(row: Record<string, unknown>): OpportunityItem {
  return {
    id: Number(row.id),
    title: String(row.title),
    appointment_type: row.appointment_type as OpportunityItem['appointment_type'],
    description_html: String(row.description_html),
    qualifications_html: String(row.qualifications_html),
    responsibilities_html: String(row.responsibilities_html),
    application_instructions: String(row.application_instructions),
    application_url: String(row.application_url || ''),
    deadline: String(row.deadline || ''),
    position_status: row.position_status as OpportunityItem['position_status'],
    featured_on_home: Boolean(row.featured_on_home),
    publish_status: row.publish_status as OpportunityItem['publish_status'],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function getProfile(): SiteProfile {
  const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('profile') as
    | { value: string }
    | undefined;
  if (!row) {
    throw new Error('Site profile missing from database');
  }
  return JSON.parse(row.value) as SiteProfile;
}

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(attachSession);

// Serve uploaded media files
app.use('/uploads', express.static(UPLOADS_DIR));

// Legacy URL Redirect Middleware
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
    const rule = db
      .prepare('SELECT to_path FROM redirects WHERE from_path = ?')
      .get(req.path) as { to_path: string } | undefined;
    if (rule) {
      res.redirect(301, rule.to_path);
      return;
    }
  }
  next();
});

// ========================
// PUBLIC API ROUTES
// ========================

app.get('/api/public/bootstrap', (_req, res) => {
  try {
    const profile = getProfile();
    const allProjects = (
      db
        .prepare(
          "SELECT * FROM projects WHERE publish_status = 'published' ORDER BY CASE WHEN project_status = 'ongoing' THEN 0 ELSE 1 END, updated_at DESC"
        )
        .all() as Record<string, unknown>[]
    ).map(mapProjectRow);

    const allNews = (
      db
        .prepare(
          "SELECT * FROM news WHERE status IN ('published', 'archived') ORDER BY published_date DESC, id DESC"
        )
        .all() as Record<string, unknown>[]
    ).map(mapNewsRow);

    const allPublications = (
      db
        .prepare("SELECT * FROM publications WHERE status = 'published' ORDER BY year DESC, id DESC")
        .all() as Record<string, unknown>[]
    ).map(mapPubRow);

    const courses = (
      db
        .prepare(
          "SELECT * FROM courses WHERE status IN ('active', 'archived') ORDER BY CASE WHEN status = 'active' THEN 0 ELSE 1 END, academic_year DESC, course_number ASC"
        )
        .all() as Record<string, unknown>[]
    ).map(mapCourseRow);

    const opportunities = (
      db
        .prepare(
          "SELECT * FROM opportunities WHERE publish_status = 'published' AND position_status != 'Archived' ORDER BY CASE WHEN position_status = 'Open' THEN 0 ELSE 1 END, updated_at DESC"
        )
        .all() as Record<string, unknown>[]
    ).map(mapOpportunityRow);

    const featuredProjects = allProjects
      .filter((p) => p.featured_on_home)
      .slice(0, profile.homeLimits?.projects ?? 3);

    const featuredNews = allNews
      .filter((n) => n.status === 'published' && n.featured_on_home)
      .slice(0, profile.homeLimits?.news ?? 3);

    const featuredPublications = allPublications
      .filter((p) => p.featured_on_home)
      .slice(0, profile.homeLimits?.publications ?? 4);

    res.json({
      profile,
      featuredProjects: featuredProjects.length ? featuredProjects : allProjects.slice(0, 3),
      allProjects,
      featuredNews:
        featuredNews.length
          ? featuredNews
          : allNews.filter((n) => n.status === 'published').slice(0, 3),
      allNews,
      featuredPublications: featuredPublications.length
        ? featuredPublications
        : allPublications.slice(0, 4),
      allPublications,
      courses,
      opportunities,
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load public data' });
  }
});

app.post('/api/public/contact', (req, res) => {
  const { name, email, subject, inquiry_type, message } = req.body ?? {};
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    return;
  }
  const now = new Date().toISOString();
  const result = db
    .prepare(
      'INSERT INTO contact_inquiries (name, email, subject, inquiry_type, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      String(name).slice(0, 140),
      String(email).slice(0, 180),
      String(subject).slice(0, 200),
      String(inquiry_type || 'General Inquiry').slice(0, 80),
      String(message).slice(0, 4000),
      'unread',
      now
    );
  res.status(201).json({ id: Number(result.lastInsertRowid), created_at: now });
});

// ========================
// AUTHENTICATION ROUTES
// ========================

app.get('/api/auth/me', (req: AuthedRequest, res) => {
  if (!req.user) {
    res.json({ user: null });
    return;
  }
  res.json({
    user: {
      id: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }
  const user = db
    .prepare('SELECT id, email, name, role, password_hash FROM users WHERE LOWER(email) = LOWER(?)')
    .get(String(email).trim()) as
    | { id: number; email: string; name: string; role: UserRole; password_hash: string }
    | undefined;

  if (!user || !verifyPassword(String(password), user.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const payload: SessionPayload = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const token = signSession(payload);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );
  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

app.post('/api/auth/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});

app.post('/api/auth/change-password', requireAuth, (req: AuthedRequest, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword || String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters.' });
    return;
  }
  const user = db
    .prepare('SELECT id, password_hash FROM users WHERE id = ?')
    .get(req.user!.uid) as { id: number; password_hash: string } | undefined;
  if (!user || !verifyPassword(String(currentPassword), user.password_hash)) {
    res.status(400).json({ error: 'Current password is incorrect.' });
    return;
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
    hashPassword(String(newPassword)),
    user.id
  );
  res.json({ ok: true });
});

// ========================
// ADMIN CMS ROUTES
// ========================

app.get('/api/admin/workspace', requireAuth, (_req, res) => {
  const profile = getProfile();
  const news = (db.prepare('SELECT * FROM news ORDER BY published_date DESC, id DESC').all() as Record<string, unknown>[]).map(mapNewsRow);
  const publications = (db.prepare('SELECT * FROM publications ORDER BY year DESC, id DESC').all() as Record<string, unknown>[]).map(mapPubRow);
  const courses = (db.prepare('SELECT * FROM courses ORDER BY academic_year DESC, course_number ASC').all() as Record<string, unknown>[]).map(mapCourseRow);
  const projects = (db.prepare('SELECT * FROM projects ORDER BY updated_at DESC, id DESC').all() as Record<string, unknown>[]).map(mapProjectRow);
  const opportunities = (db.prepare('SELECT * FROM opportunities ORDER BY updated_at DESC, id DESC').all() as Record<string, unknown>[]).map(mapOpportunityRow);
  const media = db.prepare('SELECT * FROM media_assets ORDER BY created_at DESC, id DESC').all();
  const redirects = db.prepare('SELECT * FROM redirects ORDER BY id DESC').all();
  const inquiries = db.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC, id DESC').all();
  const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY id ASC').all();

  res.json({
    profile,
    news,
    publications,
    courses,
    projects,
    opportunities,
    media,
    redirects,
    inquiries,
    users,
  });
});

// NEWS CRUD
app.post('/api/admin/news', requireAuth, (req: AuthedRequest, res) => {
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const baseSlug = slugify(String(b.slug || b.title || 'news-item')) || `news-${Date.now()}`;
  let slug = baseSlug;
  if (db.prepare('SELECT id FROM news WHERE slug = ?').get(slug)) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  const status = b.status === 'published' || b.status === 'archived' ? b.status : 'draft';
  const pubDate = b.published_date || now.slice(0, 10);

  const result = db
    .prepare(
      `INSERT INTO news (slug, title, category, published_date, summary, content_html, image_url, image_caption, featured_on_home, status, author_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      String(b.title || 'Untitled Announcement'),
      String(b.category || 'Announcement'),
      String(pubDate),
      String(b.summary || ''),
      sanitizeHtml(String(b.content_html || '')),
      String(b.image_url || ''),
      String(b.image_caption || ''),
      b.featured_on_home ? 1 : 0,
      status,
      String(b.author_name || req.user!.name),
      now,
      now
    );
  const created = db.prepare('SELECT * FROM news WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
  res.status(201).json(mapNewsRow(created));
});

app.put('/api/admin/news/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'News item not found' });
    return;
  }
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const status = b.status ?? existing.status;
  // Automatic publication date recording when transitioning draft -> published if none set
  const pubDate =
    b.published_date ||
    (existing.status === 'draft' && status === 'published' ? now.slice(0, 10) : existing.published_date);

  db.prepare(
    `UPDATE news SET title=?, category=?, published_date=?, summary=?, content_html=?, image_url=?, image_caption=?, featured_on_home=?, status=?, author_name=?, updated_at=? WHERE id=?`
  ).run(
    String(b.title ?? existing.title),
    String(b.category ?? existing.category),
    String(pubDate),
    String(b.summary ?? existing.summary),
    sanitizeHtml(String(b.content_html ?? existing.content_html)),
    String(b.image_url ?? existing.image_url),
    String(b.image_caption ?? existing.image_caption),
    b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : Number(existing.featured_on_home),
    String(status),
    String(b.author_name ?? existing.author_name),
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapNewsRow(updated));
});

app.delete('/api/admin/news/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM news WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// PUBLICATIONS CRUD
app.post('/api/admin/publications', requireAuth, (req, res) => {
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO publications (title, authors, year, venue, pub_type, topic, abstract, doi_url, publisher_url, pdf_url, bibtex, featured_on_home, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.title || 'Untitled Publication'),
      String(b.authors || ''),
      Number(b.year || new Date().getFullYear()),
      String(b.venue || ''),
      String(b.pub_type || 'Journal Article'),
      String(b.topic || 'General'),
      String(b.abstract || ''),
      String(b.doi_url || ''),
      String(b.publisher_url || ''),
      String(b.pdf_url || ''),
      String(b.bibtex || ''),
      b.featured_on_home ? 1 : 0,
      b.status === 'draft' ? 'draft' : 'published',
      now,
      now
    );
  const created = db.prepare('SELECT * FROM publications WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
  res.status(201).json(mapPubRow(created));
});

app.put('/api/admin/publications/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM publications WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Publication not found' });
    return;
  }
  const b = req.body ?? {};
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE publications SET title=?, authors=?, year=?, venue=?, pub_type=?, topic=?, abstract=?, doi_url=?, publisher_url=?, pdf_url=?, bibtex=?, featured_on_home=?, status=?, updated_at=? WHERE id=?`
  ).run(
    String(b.title ?? existing.title),
    String(b.authors ?? existing.authors),
    Number(b.year ?? existing.year),
    String(b.venue ?? existing.venue),
    String(b.pub_type ?? existing.pub_type),
    String(b.topic ?? existing.topic),
    String(b.abstract ?? existing.abstract),
    String(b.doi_url ?? existing.doi_url),
    String(b.publisher_url ?? existing.publisher_url),
    String(b.pdf_url ?? existing.pdf_url),
    String(b.bibtex ?? existing.bibtex),
    b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : Number(existing.featured_on_home),
    String(b.status ?? existing.status),
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM publications WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapPubRow(updated));
});

app.delete('/api/admin/publications/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM publications WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// COURSES CRUD
app.post('/api/admin/courses', requireAuth, (req, res) => {
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO courses (course_number, title, semester, academic_year, description_html, topics_json, objectives_json, syllabus_url, materials_json, university_catalog_url, status, featured_on_home, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.course_number || 'ECE 50000'),
      String(b.title || 'Untitled Course'),
      String(b.semester || 'Fall'),
      String(b.academic_year || '2026–2027'),
      sanitizeHtml(String(b.description_html || '')),
      JSON.stringify(Array.isArray(b.topics) ? b.topics : []),
      JSON.stringify(Array.isArray(b.objectives) ? b.objectives : []),
      String(b.syllabus_url || ''),
      JSON.stringify(Array.isArray(b.materials) ? b.materials : []),
      String(b.university_catalog_url || ''),
      String(b.status || 'active'),
      b.featured_on_home ? 1 : 0,
      now,
      now
    );
  const created = db.prepare('SELECT * FROM courses WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
  res.status(201).json(mapCourseRow(created));
});

app.put('/api/admin/courses/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  const b = req.body ?? {};
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE courses SET course_number=?, title=?, semester=?, academic_year=?, description_html=?, topics_json=?, objectives_json=?, syllabus_url=?, materials_json=?, university_catalog_url=?, status=?, featured_on_home=?, updated_at=? WHERE id=?`
  ).run(
    String(b.course_number ?? existing.course_number),
    String(b.title ?? existing.title),
    String(b.semester ?? existing.semester),
    String(b.academic_year ?? existing.academic_year),
    sanitizeHtml(String(b.description_html ?? existing.description_html)),
    b.topics !== undefined ? JSON.stringify(b.topics) : String(existing.topics_json),
    b.objectives !== undefined ? JSON.stringify(b.objectives) : String(existing.objectives_json),
    String(b.syllabus_url ?? existing.syllabus_url),
    b.materials !== undefined ? JSON.stringify(b.materials) : String(existing.materials_json),
    String(b.university_catalog_url ?? existing.university_catalog_url),
    String(b.status ?? existing.status),
    b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : Number(existing.featured_on_home),
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapCourseRow(updated));
});

app.delete('/api/admin/courses/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM courses WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// RESEARCH PROJECTS CRUD
app.post('/api/admin/projects', requireAuth, (req, res) => {
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const baseSlug = slugify(String(b.slug || b.title || 'project')) || `project-${Date.now()}`;
  let slug = baseSlug;
  if (db.prepare('SELECT id FROM projects WHERE slug = ?').get(slug)) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  const result = db
    .prepare(
      `INSERT INTO projects (slug, title, research_area, overview, objectives_html, methodology_html, progress_notes, image_url, image_caption, project_status, related_publication_ids_json, collaborators, funding_info, featured_on_home, publish_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      String(b.title || 'Untitled Research Project'),
      String(b.research_area || 'Autonomous Systems'),
      String(b.overview || ''),
      sanitizeHtml(String(b.objectives_html || '')),
      sanitizeHtml(String(b.methodology_html || '')),
      String(b.progress_notes || ''),
      String(b.image_url || ''),
      String(b.image_caption || ''),
      b.project_status === 'completed' ? 'completed' : 'ongoing',
      JSON.stringify(Array.isArray(b.related_publication_ids) ? b.related_publication_ids : []),
      String(b.collaborators || ''),
      String(b.funding_info || ''),
      b.featured_on_home ? 1 : 0,
      b.publish_status === 'draft' ? 'draft' : 'published',
      now,
      now
    );
  const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
  res.status(201).json(mapProjectRow(created));
});

app.put('/api/admin/projects/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  const b = req.body ?? {};
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE projects SET title=?, research_area=?, overview=?, objectives_html=?, methodology_html=?, progress_notes=?, image_url=?, image_caption=?, project_status=?, related_publication_ids_json=?, collaborators=?, funding_info=?, featured_on_home=?, publish_status=?, updated_at=? WHERE id=?`
  ).run(
    String(b.title ?? existing.title),
    String(b.research_area ?? existing.research_area),
    String(b.overview ?? existing.overview),
    sanitizeHtml(String(b.objectives_html ?? existing.objectives_html)),
    sanitizeHtml(String(b.methodology_html ?? existing.methodology_html)),
    String(b.progress_notes ?? existing.progress_notes),
    String(b.image_url ?? existing.image_url),
    String(b.image_caption ?? existing.image_caption),
    String(b.project_status ?? existing.project_status),
    b.related_publication_ids !== undefined
      ? JSON.stringify(b.related_publication_ids)
      : String(existing.related_publication_ids_json),
    String(b.collaborators ?? existing.collaborators),
    String(b.funding_info ?? existing.funding_info),
    b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : Number(existing.featured_on_home),
    String(b.publish_status ?? existing.publish_status),
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapProjectRow(updated));
});

app.delete('/api/admin/projects/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// OPPORTUNITIES CRUD
app.post('/api/admin/opportunities', requireAuth, (req, res) => {
  const b = req.body ?? {};
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO opportunities (title, appointment_type, description_html, qualifications_html, responsibilities_html, application_instructions, application_url, deadline, position_status, featured_on_home, publish_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.title || 'Untitled Lab Position'),
      String(b.appointment_type || 'Graduate Research'),
      sanitizeHtml(String(b.description_html || '')),
      sanitizeHtml(String(b.qualifications_html || '')),
      sanitizeHtml(String(b.responsibilities_html || '')),
      String(b.application_instructions || ''),
      String(b.application_url || ''),
      String(b.deadline || ''),
      String(b.position_status || 'Open'),
      b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : 1,
      b.publish_status === 'draft' ? 'draft' : 'published',
      now,
      now
    );
  const created = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
  res.status(201).json(mapOpportunityRow(created));
});

app.put('/api/admin/opportunities/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }
  const b = req.body ?? {};
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE opportunities SET title=?, appointment_type=?, description_html=?, qualifications_html=?, responsibilities_html=?, application_instructions=?, application_url=?, deadline=?, position_status=?, featured_on_home=?, publish_status=?, updated_at=? WHERE id=?`
  ).run(
    String(b.title ?? existing.title),
    String(b.appointment_type ?? existing.appointment_type),
    sanitizeHtml(String(b.description_html ?? existing.description_html)),
    sanitizeHtml(String(b.qualifications_html ?? existing.qualifications_html)),
    sanitizeHtml(String(b.responsibilities_html ?? existing.responsibilities_html)),
    String(b.application_instructions ?? existing.application_instructions),
    String(b.application_url ?? existing.application_url),
    String(b.deadline ?? existing.deadline),
    String(b.position_status ?? existing.position_status),
    b.featured_on_home !== undefined ? (b.featured_on_home ? 1 : 0) : Number(existing.featured_on_home),
    String(b.publish_status ?? existing.publish_status),
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(id) as Record<string, unknown>;
  res.json(mapOpportunityRow(updated));
});

app.delete('/api/admin/opportunities/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM opportunities WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// MEDIA UPLOAD & MANAGEMENT
app.post('/api/admin/media', requireAuth, (req: AuthedRequest, res) => {
  const { filename, mimeType, dataBase64 } = req.body ?? {};
  if (!filename || !dataBase64) {
    res.status(400).json({ error: 'File name and data are required.' });
    return;
  }

  const allowedExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.pdf', '.txt', '.bib', '.docx']);
  const origName = path.basename(String(filename));
  const ext = path.extname(origName).toLowerCase();
  if (!allowedExt.has(ext)) {
    res.status(400).json({ error: `Unsupported file extension (${ext}). Allowed: images, PDF, TXT, BIB, DOCX.` });
    return;
  }

  const cleanBase64 = String(dataBase64).replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');
  if (buffer.length > 12 * 1024 * 1024) {
    res.status(400).json({ error: 'File exceeds 12 MB upload limit.' });
    return;
  }

  const safeBase = origName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storedName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${safeBase}`;
  const destPath = path.join(UPLOADS_DIR, storedName);
  fs.writeFileSync(destPath, buffer);

  const category =
    ext === '.pdf'
      ? 'pdf'
      : ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)
      ? 'image'
      : 'document';

  const url = `/uploads/${storedName}`;
  const now = new Date().toISOString();
  const result = db
    .prepare(
      'INSERT INTO media_assets (filename, original_name, mime_type, size_bytes, url, category, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      storedName,
      origName,
      String(mimeType || 'application/octet-stream'),
      buffer.length,
      url,
      category,
      req.user!.email,
      now
    );

  const created = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(Number(result.lastInsertRowid));
  res.status(201).json(created);
});

app.delete('/api/admin/media/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT filename FROM media_assets WHERE id = ?').get(id) as
    | { filename: string }
    | undefined;
  if (row) {
    const target = path.join(UPLOADS_DIR, row.filename);
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    db.prepare('DELETE FROM media_assets WHERE id = ?').run(id);
  }
  res.json({ ok: true });
});

// SITE PROFILE & TEAM SETTINGS (Admin-only)
app.put('/api/admin/profile', requireAdmin, (req, res) => {
  const incoming = req.body as SiteProfile;
  if (!incoming || !incoming.labName) {
    res.status(400).json({ error: 'Invalid profile payload' });
    return;
  }
  if (incoming.piBioHtml) {
    incoming.piBioHtml = sanitizeHtml(incoming.piBioHtml);
  }
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)').run(
    'profile',
    JSON.stringify(incoming),
    now
  );
  res.json(incoming);
});

// CONTACT INQUIRIES
app.put('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status || 'read');
  db.prepare('UPDATE contact_inquiries SET status = ? WHERE id = ?').run(status, id);
  res.json({ ok: true });
});

app.delete('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM contact_inquiries WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// USERS & RBAC (Admin-only)
app.post('/api/admin/users', requireAdmin, (req, res) => {
  const { email, name, role, password } = req.body ?? {};
  if (!email || !name || !password || String(password).length < 8) {
    res.status(400).json({ error: 'Email, name, and password (min 8 chars) are required.' });
    return;
  }
  const validRole: UserRole = role === 'admin' ? 'admin' : 'editor';
  const now = new Date().toISOString();
  try {
    const result = db
      .prepare('INSERT INTO users (email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(String(email).trim(), String(name).trim(), validRole, hashPassword(String(password)), now);
    const created = db
      .prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?')
      .get(Number(result.lastInsertRowid));
    res.status(201).json(created);
  } catch {
    res.status(400).json({ error: 'A user with that email already exists.' });
  }
});

app.delete('/api/admin/users/:id', requireAdmin, (req: AuthedRequest, res) => {
  const targetId = Number(req.params.id);
  if (targetId === req.user!.uid) {
    res.status(400).json({ error: 'Cannot delete the currently signed-in administrator account.' });
    return;
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
  res.json({ ok: true });
});

// REDIRECTS (Admin-only)
app.post('/api/admin/redirects', requireAdmin, (req, res) => {
  const { from_path, to_path, note } = req.body ?? {};
  if (!from_path || !to_path) {
    res.status(400).json({ error: 'Source path and destination path are required.' });
    return;
  }
  const cleanFrom = String(from_path).startsWith('/') ? String(from_path).trim() : `/${String(from_path).trim()}`;
  const cleanTo = String(to_path).startsWith('/') ? String(to_path).trim() : `/${String(to_path).trim()}`;
  const now = new Date().toISOString();
  try {
    const result = db
      .prepare('INSERT INTO redirects (from_path, to_path, note, created_at) VALUES (?, ?, ?, ?)')
      .run(cleanFrom, cleanTo, String(note || ''), now);
    const created = db.prepare('SELECT * FROM redirects WHERE id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json(created);
  } catch {
    res.status(400).json({ error: 'Redirect for that source path already exists.' });
  }
});

app.delete('/api/admin/redirects/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM redirects WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// BACKUP & RECOVERY (Admin-only)
app.get('/api/admin/backup/export', requireAdmin, (_req, res) => {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profile: getProfile(),
    news: db.prepare('SELECT * FROM news').all(),
    publications: db.prepare('SELECT * FROM publications').all(),
    courses: db.prepare('SELECT * FROM courses').all(),
    projects: db.prepare('SELECT * FROM projects').all(),
    opportunities: db.prepare('SELECT * FROM opportunities').all(),
    redirects: db.prepare('SELECT * FROM redirects').all(),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="purdue-lab-cms-backup-${new Date().toISOString().slice(0, 10)}.json"`
  );
  res.send(JSON.stringify(snapshot, null, 2));
});

app.post('/api/admin/backup/restore', requireAdmin, (req, res) => {
  const snap = req.body;
  if (!snap || !snap.profile || !Array.isArray(snap.news) || !Array.isArray(snap.publications)) {
    res.status(400).json({ error: 'Invalid backup snapshot format.' });
    return;
  }
  const now = new Date().toISOString();
  try {
    db.exec('BEGIN TRANSACTION');
    db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)').run(
      'profile',
      JSON.stringify(snap.profile),
      now
    );

    db.exec('DELETE FROM news; DELETE FROM publications; DELETE FROM courses; DELETE FROM projects; DELETE FROM opportunities; DELETE FROM redirects;');

    const insNews = db.prepare(
      'INSERT INTO news (id, slug, title, category, published_date, summary, content_html, image_url, image_caption, featured_on_home, status, author_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const n of snap.news) {
      insNews.run(n.id, n.slug, n.title, n.category, n.published_date, n.summary, sanitizeHtml(n.content_html), n.image_url || '', n.image_caption || '', n.featured_on_home ? 1 : 0, n.status, n.author_name, n.created_at, n.updated_at);
    }

    const insPub = db.prepare(
      'INSERT INTO publications (id, title, authors, year, venue, pub_type, topic, abstract, doi_url, publisher_url, pdf_url, bibtex, featured_on_home, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const p of snap.publications) {
      insPub.run(p.id, p.title, p.authors, p.year, p.venue, p.pub_type, p.topic, p.abstract, p.doi_url || '', p.publisher_url || '', p.pdf_url || '', p.bibtex || '', p.featured_on_home ? 1 : 0, p.status, p.created_at, p.updated_at);
    }

    if (Array.isArray(snap.courses)) {
      const insCourse = db.prepare(
        'INSERT INTO courses (id, course_number, title, semester, academic_year, description_html, topics_json, objectives_json, syllabus_url, materials_json, university_catalog_url, status, featured_on_home, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const c of snap.courses) {
        insCourse.run(c.id, c.course_number, c.title, c.semester, c.academic_year, sanitizeHtml(c.description_html), c.topics_json || '[]', c.objectives_json || '[]', c.syllabus_url || '', c.materials_json || '[]', c.university_catalog_url || '', c.status, c.featured_on_home ? 1 : 0, c.created_at, c.updated_at);
      }
    }

    if (Array.isArray(snap.projects)) {
      const insProj = db.prepare(
        'INSERT INTO projects (id, slug, title, research_area, overview, objectives_html, methodology_html, progress_notes, image_url, image_caption, project_status, related_publication_ids_json, collaborators, funding_info, featured_on_home, publish_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const pr of snap.projects) {
        insProj.run(pr.id, pr.slug, pr.title, pr.research_area, pr.overview, sanitizeHtml(pr.objectives_html), sanitizeHtml(pr.methodology_html), pr.progress_notes || '', pr.image_url || '', pr.image_caption || '', pr.project_status, pr.related_publication_ids_json || '[]', pr.collaborators || '', pr.funding_info || '', pr.featured_on_home ? 1 : 0, pr.publish_status, pr.created_at, pr.updated_at);
      }
    }

    if (Array.isArray(snap.opportunities)) {
      const insOpp = db.prepare(
        'INSERT INTO opportunities (id, title, appointment_type, description_html, qualifications_html, responsibilities_html, application_instructions, application_url, deadline, position_status, featured_on_home, publish_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      );
      for (const o of snap.opportunities) {
        insOpp.run(o.id, o.title, o.appointment_type, sanitizeHtml(o.description_html), sanitizeHtml(o.qualifications_html), sanitizeHtml(o.responsibilities_html), o.application_instructions, o.application_url || '', o.deadline || '', o.position_status, o.featured_on_home ? 1 : 0, o.publish_status, o.created_at, o.updated_at);
      }
    }

    if (Array.isArray(snap.redirects)) {
      const insRed = db.prepare('INSERT INTO redirects (id, from_path, to_path, note, created_at) VALUES (?, ?, ?, ?, ?)');
      for (const r of snap.redirects) {
        insRed.run(r.id, r.from_path, r.to_path, r.note || '', r.created_at);
      }
    }

    db.exec('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: err instanceof Error ? err.message : 'Restore failed' });
  }
});

// ========================
// VITE / PRODUCTION STATIC
// ========================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Purdue Research Lab CMS running at http://localhost:${PORT}`);
  });
}

startServer();
