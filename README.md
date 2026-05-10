# EUGE_L1 — Local Dev Setup

This project uses Next.js + PostgreSQL. Follow these steps to connect your local Postgres database (e.g., `euge_trading`) and run the app.

1) Install dependencies

```bash
pnpm install
```

2) Configure environment

- Copy `.env.example` to `.env.local` at the repository root and update the values.
- Preferred: set `DATABASE_URL` (example: `postgres://user:password@localhost:5432/euge_trading`).
- If your local Postgres has no password and accepts local connections, you can leave `DB_USER`/`DB_PASSWORD` blank; the code will fallback to `postgresql://localhost:5432/euge_trading`.

3) Run the app

```bash
pnpm dev
```

4) Notes

- API routes under `/app/api/*` proxy to the server handlers in `/backend/api/*` which use `lib/db-queries.ts`.
- `lib/db.ts` reads `DATABASE_URL` or falls back to `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- Do not hardcode credentials; use environment variables.

5) Testing DB connection

After starting the dev server you should see a message in the server logs: `Connected to PostgreSQL database` or warnings if no `DATABASE_URL` is provided.

If you run into authentication issues connect to your Postgres via `psql` or pgAdmin and check that the `euge_trading` database exists and your Postgres `pg_hba.conf` allows local connections without a password.

If you'd like, I can also add a small script to run basic DB checks or seed more data — tell me and I'll add it.
