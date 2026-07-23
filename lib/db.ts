import { PrismaClient } from './generated/prisma';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import bcrypt from 'bcryptjs';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient | null };

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables. Please add your Neon connection string to .env file.');
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);
    const client = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
    }

    return client;
  } catch (error: any) {
    console.error('Failed to initialize PrismaNeon adapter:', error);
    throw new Error(`Database connection initialization failed: ${error?.message || error}`);
  }
}

// Proxy wrapper allowing `prisma.model.query()` syntax with lazy initialization
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrisma();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export async function ensureAdminUserExists() {
  try {
    const db = getPrisma();
    const userCount = await db.user.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.user.create({
        data: {
          email: 'admin@example.com',
          username: 'admin',
          password: hashedPassword,
        },
      });
      console.log('Default admin user created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('Failed to ensure default admin user:', error);
  }
}
