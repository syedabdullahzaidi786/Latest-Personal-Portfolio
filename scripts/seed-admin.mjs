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
  console.error('Could not read .env file:', e.message);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set!');
  process.exit(1);
}

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_USERNAME = 'admin';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    console.log('Connecting to database...');

    // Check if user already exists
    const existing = await pool.query('SELECT id, email FROM "User" WHERE email = $1', [ADMIN_EMAIL]);

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existing.rows.length > 0) {
      // Update existing user's password
      await pool.query(
        'UPDATE "User" SET password = $1, username = $2 WHERE email = $3',
        [hashedPassword, ADMIN_USERNAME, ADMIN_EMAIL]
      );
      console.log(`✅ Admin user updated successfully!`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO "User" (email, username, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
        [ADMIN_EMAIL, ADMIN_USERNAME, hashedPassword]
      );
      console.log(`✅ Admin user created successfully!`);
    }

    console.log('');
    console.log('📋 Login Credentials:');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/admin/login');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();
