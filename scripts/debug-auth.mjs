import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
try {
  const envPath = resolve(__dirname, '../.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch (e) {
  console.error('Could not read .env:', e.message);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('No DATABASE_URL'); process.exit(1); }

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // 1. List all users
    console.log('=== All Users in DB ===');
    const all = await pool.query('SELECT id, email, username, LEFT(password, 20) as pwd_preview FROM "User"');
    if (all.rows.length === 0) {
      console.log('❌ NO USERS IN DATABASE!');
    } else {
      all.rows.forEach(r => console.log(r));
    }

    // 2. Test bcrypt comparison
    if (all.rows.length > 0) {
      console.log('\n=== Testing Password Comparison ===');
      const fullUser = await pool.query('SELECT password FROM "User" WHERE email = $1', ['admin@example.com']);
      if (fullUser.rows.length > 0) {
        const hash = fullUser.rows[0].password;
        console.log('Hash from DB:', hash.substring(0, 30) + '...');
        const isMatch = await bcrypt.compare('admin123', hash);
        console.log('bcrypt.compare("admin123", hash):', isMatch ? '✅ MATCH' : '❌ NO MATCH');
      } else {
        console.log('❌ User admin@example.com not found!');
      }
    }

    // 3. Check table name variants
    console.log('\n=== Checking Table Names ===');
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error:', err.message, err);
  } finally {
    await pool.end();
  }
}

main();
