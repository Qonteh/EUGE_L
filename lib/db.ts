import { Pool, QueryResult } from 'pg';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Or use individual connection parameters:
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT || '5432'),
  // database: process.env.DB_NAME || 'euge_trading',
  // user: process.env.DB_USER || 'postgres',
  // password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Generic query function
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a client from the pool for transactions
export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Close the pool (for graceful shutdown)
export async function closePool() {
  await pool.end();
}

export default pool;
