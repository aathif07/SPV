# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## Docker

Build and run the production container:

```bash
docker build -t spv-website .
docker run --rm -p 3000:3000 spv-website
```

Open `http://localhost:3000`. To use another container port, pass `-e PORT=8080`
and publish that port with `-p 8080:8080`.

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Blog + Admin CMS

The site has a blog at `/blog` and a content management panel at `/admin`.

### First-time setup

1. Copy the environment template and fill it in:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose |
   |---|---|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `SESSION_SECRET` | Random string — `openssl rand -hex 32` |
   | `S3_*` | Image storage. See [docs/S3-SETUP.md](docs/S3-SETUP.md). Leave blank to paste image URLs instead of uploading. |

2. Create the tables:

   ```bash
   npm run db:migrate
   ```

3. Create the first admin account:

   ```bash
   npm run admin:create
   ```

   It prompts for email, name and password, or takes them as arguments:
   `npm run admin:create -- me@example.com "My Name" "a-strong-password"`.
   Running it again for an existing email resets that person's password.

4. Start the site and sign in at `http://localhost:3000/admin/login`.

### Writing posts

Each post has an English and a Tamil version of its title, short description
and body. Fill in only English to publish in one language — the language switch
appears on the website once the Tamil fields are filled in.

Posts stay invisible until their status is set to **Published**.

### Changing the schema

`db/schema.ts` is the source of truth. After editing it:

```bash
npm run db:generate   # writes a new SQL file into db/migrations
npm run db:migrate    # applies it
```

Commit the generated migration — deployments replay them in order.

## Deploying (Dokploy)

`vinext start` runs a plain Node server, so the Docker image needs no special
runtime. In Dokploy:

1. Set every variable from `.env.example` in the service's **Environment** tab.
   The `.env` file is git-ignored and is not in the image.
2. Deploy.
3. Run the migration once per schema change, from the service's terminal:

   ```bash
   npm run db:migrate
   ```

4. Create the first admin the same way, once:

   ```bash
   npm run admin:create -- you@example.com "Your Name" "a-strong-password"
   ```

Image storage is a separate service — see [docs/S3-SETUP.md](docs/S3-SETUP.md).

> This project does **not** use the Cloudflare Workers runtime. `vite.config.ts`
> deliberately omits the Cloudflare plugin so that local development runs on
> Node, exactly like production. Workers isolates cannot hold a PostgreSQL
> connection pool across requests, which made database writes hang.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
