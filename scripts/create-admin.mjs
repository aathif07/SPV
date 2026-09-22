/**
 * Creates (or updates the password of) an admin user.
 *
 *   npm run admin:create
 *   npm run admin:create -- me@example.com "My Name" "my-password"
 */
import { Pool } from "pg";
import { createInterface } from "node:readline/promises";
import { webcrypto as crypto } from "node:crypto";

const PBKDF2_ITERATIONS = 210_000;

const toBase64 = (bytes) => Buffer.from(bytes).toString("base64");

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(new Uint8Array(derived))}`;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

let [email, name, password] = process.argv.slice(2);

if (!email || !name || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  email ||= await rl.question("Email: ");
  name ||= await rl.question("Name: ");
  password ||= await rl.question("Password: ");
  rl.close();
}

email = email.trim().toLowerCase();
if (!email.includes("@")) {
  console.error("That does not look like an email address.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const pool = new Pool({ connectionString, max: 1 });
try {
  const passwordHash = await hashPassword(password);
  const { rows } = await pool.query(
    `insert into admin_users (email, password_hash, name)
     values ($1, $2, $3)
     on conflict (email) do update
       set password_hash = excluded.password_hash, name = excluded.name
     returning id, email, name`,
    [email, passwordHash, name.trim()],
  );
  console.log(`Admin ready: ${rows[0].email} (${rows[0].name})`);
  console.log("Sign in at /admin/login");
} catch (error) {
  console.error("Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
