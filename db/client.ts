import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

declare global {
  // Reused across HMR reloads in dev so we do not leak connection pools.
  var __spvPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env (see .env.example).");
  }
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

const pool = globalThis.__spvPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalThis.__spvPool = pool;

export const db = drizzle(pool, { schema });
export { schema };
