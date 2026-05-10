import { Pool, QueryResult, QueryResultRow } from 'pg';

// Database connection configuration
const databaseUrl = process.env.DATABASE_URL?.trim()
const host = process.env.DB_HOST || 'localhost'
const port = Number(process.env.DB_PORT || '5432')
const database = process.env.DB_NAME || 'euge_trading'
const user = process.env.DB_USER?.trim() || undefined
const password = process.env.DB_PASSWORD?.trim() || undefined
// Consider DB configured if we have DATABASE_URL, password, or user set
const databaseConfigured = Boolean(databaseUrl || password || user)

if (!process.env.DATABASE_URL) {
  console.warn('[db] No DATABASE_URL found. Using fallback connection settings for local DB.')
  console.warn('[db] Database name defaulting to euge_trading unless DB_NAME is provided.')
}

const pool = databaseConfigured
  ? new Pool(
      databaseUrl
        ? {
            connectionString: databaseUrl,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
        : {
            host,
            port,
            database,
            ...(user ? { user } : {}),
            ...(password ? { password } : {}),
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
    )
  : null

// Test connection
pool?.on('connect', () => {
  console.log('[db] Connected to PostgreSQL database');
});

pool?.on('error', (err) => {
  // Suppress verbose SCRAM auth errors in development when DB is unavailable
  // JSON fallback will handle it
  if (process.env.NODE_ENV === 'development') {
    // Silently fail - fallback to JSON will handle it
  } else {
    console.error('[db] Unexpected error on idle client', err);
    process.exit(-1);
  }
});

// Generic query function
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T extends QueryResultRow ? T : QueryResultRow>> {
  if (!pool) {
    const error = new Error('Database not configured') as Error & { code?: string }
    error.code = 'DB_NOT_CONFIGURED'
    throw error
  }

  const start = Date.now();
  try {
    const result = await pool.query<T extends QueryResultRow ? T : QueryResultRow>(text, params);
    const duration = Date.now() - start;
    console.log('[db] Query executed', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    // In development, suppress verbose logs for database connection errors
    // since we have JSON fallback - they'll use the fallback silently
    if (process.env.NODE_ENV !== 'development') {
      console.error('[db] Query error:', error);
    }
    throw error;
  }
}

// Get a client from the pool for transactions
export async function getClient() {
  if (!pool) {
    throw new Error('Database not configured')
  }

  const client = await pool.connect();
  return client;
}

// Close the pool (for graceful shutdown)
export async function closePool() {
  if (!pool) {
    return
  }

  await pool.end();
}

export default pool;
