import { db, initDb, hashPassword } from '../server/db.ts';
// Credentials are supplied securely through the process environment, never arguments.
const { CMS_ADMIN_EMAIL: email, CMS_ADMIN_PASSWORD: password } = process.env;
if (!email || !password || password.length < 16) throw new Error('Set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD (at least 16 characters) securely before running this command.');
initDb();
if (db.prepare('SELECT 1 FROM users WHERE email=?').get(email)) throw new Error('Account already exists; use CMS password management.');
db.prepare('INSERT INTO users (email,name,role,password_hash,created_at) VALUES (?,?,?,?,?)').run(email,'Laboratory administrator','admin',hashPassword(password),new Date().toISOString());
db.close();
console.log('Administrator created.');
