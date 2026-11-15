import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { SiteProfile } from '../src/types/cms.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
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
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '#blocked:');
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
      project_status TEXT NOT NULL CHECK(project_status IN ('ongoing', 'completed')) DEFAULT 'ongoing',
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

  seedInitialData();
}

function seedInitialData(): void {
  const now = new Date().toISOString();
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;

  if (userCount === 0) {
    const insertUser = db.prepare(
      'INSERT INTO users (email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    insertUser.run(
      'saraswat@purdue.edu',
      'Dr. Elena Saraswat (Principal Investigator)',
      'admin',
      hashPassword('PurdueLab2026!'),
      now
    );
    insertUser.run(
      'researcher@purdue.edu',
      'Marcus Chen (Graduate Lab Editor)',
      'editor',
      hashPassword('LabEditor2026!'),
      now
    );
  }

  const settingCount = (db.prepare('SELECT COUNT(*) as c FROM site_settings').get() as { c: number }).c;
  if (settingCount === 0) {
    const defaultProfile: SiteProfile = {
      labName: 'Autonomous Cyber-Physical Systems Laboratory',
      shortTitle: 'Purdue ACPS Lab',
      department: 'Elmore Family School of Electrical and Computer Engineering',
      college: 'College of Engineering',
      institution: 'Purdue University',
      heroEyebrow: 'Purdue University · West Lafayette, Indiana',
      heroHeadline: 'Advancing Resilient Autonomy and Photonic Sensing Systems',
      heroSubheadline:
        'An interdisciplinary research laboratory investigating formal verification, embedded machine intelligence, and integrated silicon-photonic instrumentation for safety-critical physical systems.',
      heroImageUrl: '/src/assets/images/hero_purdue_lab_1794777660038.jpg',
      missionStatement:
        'Our laboratory bridges theoretical control, real-time embedded architectures, and experimental testbeds to deliver provably dependable autonomous platforms.',
      piName: 'Prof. Elena Saraswat, Ph.D.',
      piTitle: 'Associate Professor of Electrical and Computer Engineering',
      piEmail: 'saraswat@purdue.edu',
      piPhone: '(765) 494-0000',
      piOffice: 'Materials and Electrical Engineering Building (MSEE), Room 342',
      piPortraitUrl: '/src/assets/images/pi_portrait_faculty_1794777661027.jpg',
      piBioHtml:
        '<p>Dr. Elena Saraswat leads the Autonomous Cyber-Physical Systems Laboratory at Purdue University. Her research focuses on verified control synthesis, real-time sensor fusion, and ultra-low-power photonic interconnects for autonomous vehicles and industrial robotics.</p><p>Prior to joining Purdue Engineering, she completed her doctorate at MIT and held visiting research appointments with national metrology and aerospace laboratories. Her work is supported by the National Science Foundation, the Office of Naval Research, and industry consortium partners.</p>',
      piEducation: [
        'Ph.D., Electrical Engineering and Computer Science — Massachusetts Institute of Technology',
        'M.S., Mechanical and Aerospace Engineering — Princeton University',
        'B.S., Electrical Engineering (Summa Cum Laude) — University of Michigan',
      ],
      piHonors: [
        'NSF CAREER Award, Cyber-Physical Systems Directorate (2024)',
        'Purdue College of Engineering Outstanding Faculty Mentor Award (2025)',
        'IEEE Control Systems Society Best Paper Finalist (2025)',
        'Senior Member, IEEE & Member, ACM SIGBED',
      ],
      labAddress: '465 Northwestern Ave, MSEE 342, West Lafayette, IN 47907',
      officeHours: 'Tuesdays & Thursdays, 2:00 PM – 4:00 PM EST (or by appointment)',
      googleScholarUrl: 'https://scholar.google.com',
      orcidUrl: 'https://orcid.org',
      githubUrl: 'https://github.com',
      homeLimits: {
        projects: 3,
        news: 3,
        publications: 4,
        opportunities: 3,
      },
      teamMembers: [
        {
          id: 'tm-1',
          name: 'Prof. Elena Saraswat',
          role: 'Principal Investigator & Lab Director',
          category: 'Faculty',
          focus: 'Formal Verification, Cyber-Physical Control, Photonic Sensing',
          email: 'saraswat@purdue.edu',
        },
        {
          id: 'tm-2',
          name: 'Marcus Chen',
          role: 'Ph.D. Candidate',
          category: 'PhD Student',
          focus: 'Safe Reinforcement Learning for Multi-Agent Gantry Robotics',
        },
        {
          id: 'tm-3',
          name: 'Priya Nair',
          role: 'Ph.D. Candidate',
          category: 'PhD Student',
          focus: 'Silicon Nitride Photonic Resonators & Cryogenic Optical Readout',
        },
        {
          id: 'tm-4',
          name: 'David Kowalski',
          role: 'M.S. Research Assistant',
          category: 'MS Student',
          focus: 'Deterministic Real-Time FPGA Sensor Fusion',
        },
        {
          id: 'tm-5',
          name: 'Hannah Alverez',
          role: 'Undergraduate SURF Researcher',
          category: 'Undergraduate',
          focus: 'Hardware-in-the-Loop Validation Bench Automation',
        },
        {
          id: 'tm-6',
          name: 'Dr. Julian Park (Ph.D. 2025)',
          role: 'Senior Autonomy Systems Engineer, Jet Propulsion Lab',
          category: 'Alumni',
          focus: 'Dissertation: Bounded-Latency Reachability for Aerial Swarms',
        },
      ],
    };

    db.prepare('INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)').run(
      'profile',
      JSON.stringify(defaultProfile),
      now
    );
  }

  const pubCount = (db.prepare('SELECT COUNT(*) as c FROM publications').get() as { c: number }).c;
  if (pubCount === 0) {
    const insertPub = db.prepare(`
      INSERT INTO publications
      (title, authors, year, venue, pub_type, topic, abstract, doi_url, publisher_url, pdf_url, bibtex, featured_on_home, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPub.run(
      'Deterministic Reachability Guarantees for Vision-Guided Multi-Axis Gantry Systems',
      'M. Chen, E. Saraswat, and D. Kowalski',
      2026,
      'IEEE Transactions on Control Systems Technology',
      'Journal Article',
      'Autonomous Control',
      'We present a certified control-barrier architecture that couples high-frequency optical encoder feedback with bounded-latency neural perception pipelines, ensuring zero constraint violations under actuator saturation and sensor dropout.',
      'https://doi.org/10.1109/TCST.2026.019283',
      'https://ieeexplore.ieee.org',
      '',
      '@article{chen2026deterministic,\n  author={Chen, Marcus and Saraswat, Elena and Kowalski, David},\n  title={Deterministic Reachability Guarantees for Vision-Guided Multi-Axis Gantry Systems},\n  journal={IEEE Transactions on Control Systems Technology},\n  year={2026}\n}',
      1,
      'published',
      now,
      now
    );

    insertPub.run(
      'Sub-Picosecond Integrated Silicon Nitride Waveguide Interferometry for Embedded Tactile Arrays',
      'P. Nair and E. Saraswat',
      2026,
      'Optica / CLEO Conference on Lasers and Electro-Optics',
      'Conference Paper',
      'Photonic Sensing',
      'This paper demonstrates a monolithically packaged silicon-nitride micro-ring array capable of resolving micro-Newton force distributions across robotic end-effectors with negligible electromagnetic susceptibility.',
      'https://doi.org/10.1364/CLEO.2026.SF1A.4',
      'https://opg.optica.org',
      '',
      '@inproceedings{nair2026subpicosecond,\n  author={Nair, Priya and Saraswat, Elena},\n  title={Sub-Picosecond Integrated Silicon Nitride Waveguide Interferometry},\n  booktitle={CLEO},\n  year={2026}\n}',
      1,
      'published',
      now,
      now
    );

    insertPub.run(
      'Hardware-in-the-Loop Falsification of Time-Sensitive Embedded Firmware',
      'D. Kowalski, H. Alverez, and E. Saraswat',
      2025,
      'ACM/IEEE International Conference on Cyber-Physical Systems (ICCPS)',
      'Conference Paper',
      'Formal Verification',
      'We introduce an automated fault-injection and temporal-logic falsification framework deployed directly on FPGA-accelerated cyber-physical testbeds, uncovering worst-case execution anomalies 14x faster than software simulation.',
      'https://doi.org/10.1145/3610283.3610299',
      'https://dl.acm.org',
      '',
      '@inproceedings{kowalski2025hardware,\n  author={Kowalski, David and Alverez, Hannah and Saraswat, Elena},\n  title={Hardware-in-the-Loop Falsification of Time-Sensitive Embedded Firmware},\n  booktitle={ICCPS},\n  year={2025}\n}',
      1,
      'published',
      now,
      now
    );

    insertPub.run(
      'Compositional Safety Shields for Cooperative Aerial and Ground Robots',
      'J. Park, M. Chen, and E. Saraswat',
      2025,
      'Automatica',
      'Journal Article',
      'Autonomous Control',
      'We derive decentralized invariant sets that preserve pairwise collision avoidance and task liveness when heterogeneous ground and aerial platforms share constrained indoor workspaces.',
      'https://doi.org/10.1016/j.automatica.2025.111482',
      'https://www.sciencedirect.com',
      '',
      '@article{park2025compositional,\n  author={Park, Julian and Chen, Marcus and Saraswat, Elena},\n  title={Compositional Safety Shields for Cooperative Aerial and Ground Robots},\n  journal={Automatica},\n  year={2025}\n}',
      1,
      'published',
      now,
      now
    );

    insertPub.run(
      'Low-Drift Optical Gyroscope Calibration via Physics-Informed State Observers',
      'P. Nair, J. Park, and E. Saraswat',
      2024,
      'IEEE Sensors Journal',
      'Journal Article',
      'Photonic Sensing',
      'A hybrid Luenberger-neural observer suppresses thermal bias drift in compact integrated optical gyroscopes across 40-degree ambient temperature excursions.',
      'https://doi.org/10.1109/JSEN.2024.3391042',
      'https://ieeexplore.ieee.org',
      '',
      '',
      0,
      'published',
      now,
      now
    );

    insertPub.run(
      'Timing-Predictable Runtime Architectures for Autonomous Micro-Vehicles',
      'E. Saraswat',
      2024,
      'Foundations of Dependable Cyber-Physical Engineering (Springer)',
      'Book Chapter',
      'Formal Verification',
      'Chapter surveying worst-case execution time analysis, deterministic bus arbitration, and fail-operational supervisory controllers for edge autonomy.',
      'https://doi.org/10.1007/978-3-031-48210-6_7',
      'https://link.springer.com',
      '',
      '',
      0,
      'published',
      now,
      now
    );
  }

  const projectCount = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;
  if (projectCount === 0) {
    const insertProj = db.prepare(`
      INSERT INTO projects
      (slug, title, research_area, overview, objectives_html, methodology_html, progress_notes, image_url, image_caption, project_status, related_publication_ids_json, collaborators, funding_info, featured_on_home, publish_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProj.run(
      'certified-gantry-autonomy',
      'Certified Control & Vision-Guided Precision Gantry Testbed',
      'Autonomous Control & Verification',
      'Developing mathematically verified real-time control loops for high-speed multi-axis robotic manipulators operating alongside dynamic human and hardware constraints.',
      '<ul><li>Guarantee hard safety bounds under vision-pipeline latency jitter up to 25 ms.</li><li>Achieve sub-millimeter trajectory tracking on reconfigurable aluminum gantry hardware.</li><li>Open-source deterministic FPGA controller firmware for academic reproducibility.</li></ul>',
      '<p>Our methodology combines continuous-time control barrier functions (CBFs) with discrete-time reachability certificates synthesized offline and enforced via a lightweight supervisory safety filter running at 4 kHz on an embedded SoC.</p>',
      'November 2026 Update: Completed closed-loop hardware validation across 1,200 fault-injection trials with zero boundary violations. Manuscript accepted to IEEE TCST.',
      '/src/assets/images/research_autonomous_systems_1794777660851.jpg',
      'Fig. 1 — Multi-axis autonomous cyber-physical validation testbed in MSEE 342.',
      'ongoing',
      '[1, 3]',
      'Purdue Institute for Control, Optimization and Networks (ICON); Aerospace Safety Lab',
      'National Science Foundation (NSF Award #2419802)',
      1,
      'published',
      now,
      now
    );

    insertProj.run(
      'silicon-photonic-tactile-arrays',
      'Integrated Silicon-Nitride Photonic Force & Strain Sensing',
      'Photonic Instrumentation',
      'Designing chip-scale optical waveguide interferometers that replace electromagnetic strain gauges in high-interference robotic and aerospace environments.',
      '<ul><li>Fabricate wafer-scale Si3N4 micro-ring arrays at Purdue Birck Nanotechnology Center.</li><li>Demonstrate sub-millinewton tactile sensitivity across 64 multiplexed channels.</li><li>Package ruggedized fiber-coupled sensor heads for robotic manipulation.</li></ul>',
      '<p>Optical phase shifts induced by mechanical strain modulate resonant wavelengths in coupled waveguide cavities. A compact swept-wavelength interrogation unit translates spectral shifts into real-time distributed force maps.</p>',
      'October 2026 Update: Second-generation wafer tape-out completed at Birck; fiber-to-chip coupling loss reduced below 1.8 dB.',
      '/src/assets/images/research_photonics_computing_1794777661254.jpg',
      'Fig. 2 — Fiber-coupled silicon photonic test assembly on optical isolation bench.',
      'ongoing',
      '[2, 5]',
      'Birck Nanotechnology Center; Purdue Quantum Science and Engineering Institute',
      'Office of Naval Research (ONR Grant N00014-25-1-2041)',
      1,
      'published',
      now,
      now
    );

    insertProj.run(
      'hil-firmware-falsification',
      'Hardware-in-the-Loop Temporal Falsification for Embedded Firmware',
      'Formal Verification',
      'An automated verification platform that bridges formal signal temporal logic specifications with physical bus-level fault injection on production microcontrollers.',
      '<ul><li>Detect rare race conditions and WCET spikes prior to field deployment.</li><li>Reduce hardware regression testing turnaround by an order of magnitude.</li></ul>',
      '<p>A stochastic optimization engine drives programmable FPGA signal generators to synthesize adversarial sensor waveforms and bus latencies directly against physical target boards.</p>',
      'Completed in Summer 2025. Open-source verification toolkit adopted by three partner university laboratories.',
      '/src/assets/images/hero_purdue_lab_1794777660038.jpg',
      'Fig. 3 — Distributed hardware-in-the-loop instrumentation workstations.',
      'completed',
      '[3, 6]',
      'Purdue Center for Education and Research in Information Assurance and Security (CERIAS)',
      'NSF SaTC Program & Purdue Research Foundation',
      1,
      'published',
      now,
      now
    );
  }

  const newsCount = (db.prepare('SELECT COUNT(*) as c FROM news').get() as { c: number }).c;
  if (newsCount === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news
      (slug, title, category, published_date, summary, content_html, image_url, image_caption, featured_on_home, status, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNews.run(
      'symposium-best-poster-award-2026',
      'ACPS Lab Researchers Win Best Hardware Demonstration at Midwest Autonomy Symposium',
      'Award',
      '2026-10-18',
      'Ph.D. candidates Marcus Chen and Priya Nair received first-place recognition for demonstrating closed-loop photonic-guided gantry safety control.',
      '<p>At the 2026 Midwest Cyber-Physical &amp; Autonomy Symposium, our laboratory team presented a live hardware demonstration integrating optical strain feedback with deterministic reachability control.</p><p>The panel commended the reproducibility of the testbed and the clarity of the open-source verification benchmarks developed in MSEE 342.</p>',
      '/src/assets/images/news_symposium_award_1794777661678.jpg',
      'Graduate researchers discussing hardware demonstration metrics during the fall symposium.',
      1,
      'published',
      'Dr. Elena Saraswat',
      now,
      now
    );

    insertNews.run(
      'nsf-award-photonic-cps-2026',
      'Laboratory Awarded Three-Year NSF Grant for Resilient Photonic Edge Instrumentation',
      'Research Development',
      '2026-09-04',
      'New federal funding supports two graduate research fellowships and cleanroom fabrication for integrated optical sensors.',
      '<p>The National Science Foundation has awarded $540,000 to the Autonomous Cyber-Physical Systems Laboratory to investigate fault-tolerant photonic sensing architectures for extreme-environment robotics.</p><p>Funding begins in Spring 2027 and supports new undergraduate and doctoral research positions at Purdue University.</p>',
      '/src/assets/images/research_photonics_computing_1794777661254.jpg',
      'Integrated silicon-nitride photonic test assembly supported under the new NSF initiative.',
      1,
      'published',
      'Dr. Elena Saraswat',
      now,
      now
    );

    insertNews.run(
      'surf-fellowship-alverez-2026',
      'Undergraduate Researcher Hannah Alverez Selected for Purdue SURF Honors Presentation',
      'Student Achievement',
      '2026-08-12',
      'Senior ECE undergraduate Hannah Alverez was recognized for her work automating hardware-in-the-loop timing verification.',
      '<p>Congratulations to Hannah Alverez on being selected among the top undergraduate engineering presenters at the 2026 Summer Undergraduate Research Fellowship (SURF) symposium.</p>',
      '',
      '',
      1,
      'published',
      'Dr. Elena Saraswat',
      now,
      now
    );

    insertNews.run(
      'iccps-paper-presentation-2025',
      'Paper Accepted at ACM/IEEE ICCPS 2025 on FPGA Firmware Falsification',
      'Conference',
      '2025-05-14',
      'David Kowalski presented our collaborative work on automated temporal falsification for embedded real-time firmware.',
      '<p>Our group presented <em>Hardware-in-the-Loop Falsification of Time-Sensitive Embedded Firmware</em> at ACM/IEEE ICCPS 2025, releasing our benchmark test suite for community evaluation.</p>',
      '',
      '',
      0,
      'archived',
      'Dr. Elena Saraswat',
      now,
      now
    );
  }

  const courseCount = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as { c: number }).c;
  if (courseCount === 0) {
    const insertCourse = db.prepare(`
      INSERT INTO courses
      (course_number, title, semester, academic_year, description_html, topics_json, objectives_json, syllabus_url, materials_json, university_catalog_url, status, featured_on_home, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCourse.run(
      'ECE 59500',
      'Verified Cyber-Physical Systems & Real-Time Autonomy',
      'Fall',
      '2026–2027',
      '<p>Graduate-level seminar and laboratory course examining the mathematical modeling, formal specification, and real-time implementation of safety-critical autonomous systems. Students design, verify, and deploy controllers on physical embedded hardware.</p>',
      JSON.stringify([
        'Hybrid Automata & Reachability Analysis',
        'Signal Temporal Logic (STL) Specifications',
        'Control Barrier Functions & Safe Synthesis',
        'Deterministic Real-Time Scheduling & WCET',
        'Hardware-in-the-Loop Validation',
      ]),
      JSON.stringify([
        'Formulate safety and liveness specifications for physical systems using temporal logic.',
        'Synthesize and verify supervisory controllers using reachability and barrier methods.',
        'Implement deterministic real-time sensor-actuator loops on embedded Linux and SoC platforms.',
      ]),
      '',
      JSON.stringify([
        { label: 'Purdue ECE Graduate Course Directory', url: 'https://engineering.purdue.edu/ECE/Academics/Graduates' },
      ]),
      'https://selfservice.mypurdue.purdue.edu',
      'active',
      1,
      now,
      now
    );

    insertCourse.run(
      'ECE 30100',
      'Signals and Systems',
      'Spring',
      '2026–2027',
      '<p>Core undergraduate engineering course covering continuous-time and discrete-time signals, linear time-invariant systems, Fourier analysis, Laplace and Z-transforms, and feedback stability principles.</p>',
      JSON.stringify([
        'Continuous & Discrete LTI Systems',
        'Convolution & Impulse Response',
        'Fourier Series & Fourier Transforms',
        'Laplace & Z-Transform System Analysis',
        'Sampling Theory & Digital Filtering',
      ]),
      JSON.stringify([
        'Analyze LTI system stability and frequency response in time and transform domains.',
        'Apply Nyquist sampling principles to bridge analog instrumentation and digital processing.',
      ]),
      '',
      JSON.stringify([
        { label: 'Purdue Course Catalog Entry', url: 'https://engineering.purdue.edu/ECE/Academics/Undergraduates' },
      ]),
      'https://selfservice.mypurdue.purdue.edu',
      'active',
      1,
      now,
      now
    );

    insertCourse.run(
      'ECE 47700',
      'Digital Systems Senior Design Project (Faculty Advisor)',
      'Fall',
      '2024–2025',
      '<p>Capstone engineering design sequence guiding senior undergraduate teams through architecture specification, PCB design, embedded firmware verification, and full system integration.</p>',
      JSON.stringify([
        'System Requirements & Engineering Tradeoffs',
        'Embedded Microcontroller & PCB Architecture',
        'Hardware Verification & Regulatory Compliance',
      ]),
      JSON.stringify([
        'Execute an end-to-end hardware/software engineering design cycle in collaborative teams.',
      ]),
      '',
      JSON.stringify([]),
      'https://engineering.purdue.edu/ECE/Academics/Undergraduates',
      'archived',
      0,
      now,
      now
    );
  }

  const oppCount = (db.prepare('SELECT COUNT(*) as c FROM opportunities').get() as { c: number }).c;
  if (oppCount === 0) {
    const insertOpp = db.prepare(`
      INSERT INTO opportunities
      (title, appointment_type, description_html, qualifications_html, responsibilities_html, application_instructions, application_url, deadline, position_status, featured_on_home, publish_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOpp.run(
      'Ph.D. Graduate Research Assistantship — Safe Autonomy & Control',
      'Research Assistantship',
      '<p>Seeking a motivated Ph.D. student starting Fall 2027 (or Spring 2027) to conduct fundamental research on verified control synthesis and hardware-in-the-loop autonomy under our NSF-sponsored program.</p>',
      '<ul><li>B.S. or M.S. in Electrical Engineering, Computer Engineering, Aerospace, or Computer Science.</li><li>Strong foundation in linear systems, control theory, or formal methods.</li><li>Proficiency in C/C++, Python, and embedded Linux / ROS 2.</li></ul>',
      '<ul><li>Develop control-barrier algorithms and conduct experimental validation on lab testbeds.</li><li>Author peer-reviewed publications and mentor undergraduate researchers.</li></ul>',
      'Email Prof. Saraswat at saraswat@purdue.edu with subject line "PhD Application – Safe Autonomy" including your CV, unofficial transcripts, and a brief 1-page research statement. Also submit a formal application through the Purdue Graduate School portal.',
      'https://www.purdue.edu/gradschool/',
      '2027-01-15',
      'Open',
      1,
      'published',
      now,
      now
    );

    insertOpp.run(
      'Undergraduate Research Assistant (SURF / Hourly) — Embedded Testbed Engineering',
      'Undergraduate Research',
      '<p>Part-time paid hourly or academic-credit research opportunity (10–15 hrs/week) for Purdue ECE, ME, or CS undergraduates interested in robotics hardware, PCB integration, and real-time data acquisition.</p>',
      '<ul><li>Current Purdue University undergraduate in good academic standing (Sophomore–Senior).</li><li>Experience with microcontrollers, CAD/mechanical assembly, or Python instrumentation.</li></ul>',
      '<ul><li>Assist graduate researchers in building and calibrating sensor interfaces on the gantry testbed.</li><li>Maintain reproducible automated test scripts and laboratory documentation.</li></ul>',
      'Send a concise email with your resume, current GPA, and expected graduation date to saraswat@purdue.edu, or submit an inquiry via the Contact page.',
      '',
      'Open until filled',
      'Open',
      1,
      'published',
      now,
      now
    );

    insertOpp.run(
      'Hourly Student Laboratory Technician — Optical Bench & Cleanroom Support',
      'Hourly Student Research',
      '<p>Flexible hourly position supporting optical alignment characterization and cleanroom sample inventory at the Birck Nanotechnology Center and MSEE 342.</p>',
      '<ul><li>Purdue undergraduate or M.S. student eligible for on-campus hourly employment.</li><li>Attention to precision laboratory safety and experimental record-keeping.</li></ul>',
      '<ul><li>Prepare fiber-coupled test fixtures and log calibration sweeps.</li></ul>',
      'Apply through Purdue Student Employment / contact the lab office directly.',
      '',
      '2026-12-10',
      'Open',
      1,
      'published',
      now,
      now
    );

    insertOpp.run(
      'Postdoctoral Research Fellow — Integrated Photonic Packaging',
      'Full-Time Research',
      '<p>Full-time postdoctoral appointment focused on silicon-nitride wafer characterization and high-speed optoelectronic readout systems.</p>',
      '<ul><li>Ph.D. in Electrical Engineering, Applied Physics, or Photonics.</li></ul>',
      '<ul><li>Lead cleanroom fabrication runs and co-advise doctoral students.</li></ul>',
      'Position has been filled for the 2026–2027 cycle.',
      '',
      '2026-06-01',
      'Filled',
      0,
      'published',
      now,
      now
    );
  }

  const redirCount = (db.prepare('SELECT COUNT(*) as c FROM redirects').get() as { c: number }).c;
  if (redirCount === 0) {
    const insertRedir = db.prepare(
      'INSERT INTO redirects (from_path, to_path, note, created_at) VALUES (?, ?, ?, ?)'
    );
    insertRedir.run('/publications.html', '/publications', 'Legacy static HTML publications link', now);
    insertRedir.run('/research.html', '/research', 'Legacy static HTML research page', now);
    insertRedir.run('/teaching.html', '/teaching', 'Legacy static HTML teaching page', now);
    insertRedir.run('/news.html', '/news', 'Legacy static HTML news page', now);
    insertRedir.run('/join.html', '/opportunities', 'Legacy lab openings page', now);
    insertRedir.run('/people.html', '/about', 'Legacy people/about page', now);
  }
}
