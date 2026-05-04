import { execSync } from 'child_process';

// Supabase pooled URL can't handle schema operations (PgBouncer restriction).
// Construct a direct connection URL from the individual POSTGRES_* vars instead.
const { POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_USER } = process.env;

const directUrl = POSTGRES_HOST && POSTGRES_PASSWORD
  ? `postgresql://${POSTGRES_USER ?? 'postgres'}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE ?? 'postgres'}`
  : process.env.DATABASE_URL;

execSync('npx prisma db push --accept-data-loss', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: directUrl },
});
