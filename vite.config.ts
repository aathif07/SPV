import { sites } from "@openai/sites-vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// This site is deployed with Docker (Dokploy), where `vinext start` runs a
// plain Node server. The Cloudflare plugin used to run dev inside workerd,
// which cannot hold a Postgres connection pool across requests — writes hung.
// Running dev on Node keeps development and production on the same runtime.
export default defineConfig(async () => {
  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [vinext(), sites()],
  };
});
