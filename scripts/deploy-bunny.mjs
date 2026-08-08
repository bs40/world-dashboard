/**
 * Deploy World Dashboard to Bunny.net.
 *
 *   node scripts/deploy-bunny.mjs probe    # inspect account (read-only)
 *   node scripts/deploy-bunny.mjs script   # provision + publish the edge script
 *   node scripts/deploy-bunny.mjs site     # build static export + upload + purge
 *   node scripts/deploy-bunny.mjs all      # script, then site
 *
 * Credentials:
 *   .env.deploy  → BUNNY_API_KEY=...       (account API key; gitignored)
 *   .env.local   → GUARDIAN_API_KEY=...    (optional; pushed to the edge script's
 *                                           environment, never printed)
 *
 * Everything is idempotent: zones and the script are found by name and created
 * only if missing.
 */

import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const API = "https://api.bunny.net";
const SCRIPT_NAME = "world-dashboard-news";
const STORAGE_ZONE_NAME = "world-dashboard";
const PULL_ZONE_NAME = "world-dashboard";
const STORAGE_REGION = "UK";

// ── credentials ──────────────────────────────────────────────

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && m[2]) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const deployEnv = parseEnvFile(".env.deploy");
const localEnv = parseEnvFile(".env.local");
const BUNNY_KEY = process.env.BUNNY_API_KEY ?? deployEnv.BUNNY_API_KEY;
const GUARDIAN_KEY = localEnv.GUARDIAN_API_KEY;

if (!BUNNY_KEY) {
  console.error(
    "Missing Bunny API key. Create .env.deploy in the project root containing:\n" +
      "  BUNNY_API_KEY=your-account-api-key\n" +
      "(dash.bunny.net → Account Settings → API → API Key)"
  );
  process.exit(1);
}

// ── api helpers ──────────────────────────────────────────────

async function api(method, path, body, extraHeaders = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      AccessKey: BUNNY_KEY,
      accept: "application/json",
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
  return json;
}

const listAll = async (path) => {
  const data = await api("GET", path);
  return Array.isArray(data) ? data : (data?.Items ?? []);
};

// ── edge script ──────────────────────────────────────────────

async function ensureEdgeScript() {
  const scripts = await listAll("/compute/script?page=1&perPage=100");
  let script = scripts.find((s) => s.Name === SCRIPT_NAME);

  if (!script) {
    console.log(`Creating edge script "${SCRIPT_NAME}"…`);
    // ScriptType 1 = standalone (own hostname), per Bunny compute API.
    script = await api("POST", "/compute/script", { Name: SCRIPT_NAME, ScriptType: 1 });
  } else {
    console.log(`Edge script "${SCRIPT_NAME}" exists (id ${script.Id}).`);
  }

  const code = readFileSync("edge/dist/news-endpoint.js", "utf8");
  console.log(`Uploading code (${(code.length / 1024).toFixed(1)} KB)…`);
  await api("POST", `/compute/script/${script.Id}/code`, { Code: code });

  if (GUARDIAN_KEY) {
    // Variables live on the script record itself (EdgeScriptVariables).
    const record = await api("GET", `/compute/script/${script.Id}`);
    const prior = (record.EdgeScriptVariables ?? []).find((v) => v.Name === "GUARDIAN_API_KEY");
    if (prior) {
      await api("POST", `/compute/script/${script.Id}/variables/${prior.Id}`, {
        DefaultValue: GUARDIAN_KEY,
        Required: false,
      });
      console.log("Updated GUARDIAN_API_KEY on the script.");
    } else {
      await api("POST", `/compute/script/${script.Id}/variables/add`, {
        Name: "GUARDIAN_API_KEY",
        DefaultValue: GUARDIAN_KEY,
        Required: false,
      });
      console.log("Set GUARDIAN_API_KEY on the script.");
    }
  } else {
    console.log("No GUARDIAN_API_KEY in .env.local — script will use Guardian RSS.");
  }

  console.log("Publishing…");
  await api("POST", `/compute/script/${script.Id}/publish`, {});

  // A standalone script is reached through a pull zone with OriginType 4
  // (edge script origin). The dashboard creates one automatically; the API
  // does not, so ensure it here.
  script = await api("GET", `/compute/script/${script.Id}`);
  let host = script.LinkedPullZones?.[0]?.DefaultHostname;
  if (!host) {
    const zones = await listAll("/pullzone?page=1&perPage=1000");
    let zone = zones.find((z) => z.EdgeScriptId === script.Id);
    if (!zone) {
      console.log(`Creating pull zone "${SCRIPT_NAME}" for the script…`);
      zone = await api("POST", "/pullzone", {
        Name: SCRIPT_NAME,
        OriginType: 4,
        EdgeScriptId: script.Id,
        OriginUrl: "https://bunnycdn.com",
      });
    }
    host = zone.Hostnames?.[0]?.Value ?? `${SCRIPT_NAME}.b-cdn.net`;
  }
  const url = `https://${host}`;
  console.log(`Edge script live at ${url}`);
  return url;
}

// ── storage + pull zone ──────────────────────────────────────

async function ensureStorageZone() {
  const zones = await listAll("/storagezone?page=1&perPage=1000");
  let zone = zones.find((z) => z.Name === STORAGE_ZONE_NAME);
  if (!zone) {
    console.log(`Creating storage zone "${STORAGE_ZONE_NAME}" (${STORAGE_REGION})…`);
    zone = await api("POST", "/storagezone", {
      Name: STORAGE_ZONE_NAME,
      Region: STORAGE_REGION,
      ZoneTier: 1, // SSD edge tier
    });
  } else {
    console.log(`Storage zone "${STORAGE_ZONE_NAME}" exists (id ${zone.Id}).`);
  }
  // Re-read the full record: list/create responses don't reliably include
  // StorageHostname and Password, and the region-specific hostname matters.
  zone = await api("GET", `/storagezone/${zone.Id}`);
  if (!zone.StorageHostname || !zone.Password) {
    throw new Error("Storage zone record is missing StorageHostname/Password.");
  }
  return zone;
}

async function ensurePullZone(storageZone) {
  const zones = await listAll("/pullzone?page=1&perPage=1000");
  let zone = zones.find((z) => z.Name === PULL_ZONE_NAME);
  if (!zone) {
    console.log(`Creating pull zone "${PULL_ZONE_NAME}"…`);
    zone = await api("POST", "/pullzone", {
      Name: PULL_ZONE_NAME,
      OriginType: 2, // storage zone origin
      StorageZoneId: storageZone.Id,
      EnableGzip: true,
    });
  } else {
    console.log(`Pull zone "${PULL_ZONE_NAME}" exists (id ${zone.Id}).`);
  }
  const host = zone.Hostnames?.[0]?.Value ?? `${PULL_ZONE_NAME}.b-cdn.net`;
  return { zone, host };
}

async function uploadDirectory(storageZone) {
  const root = "out";
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else files.push(full);
    }
  };
  walk(root);

  const host = storageZone.StorageHostname ?? "storage.bunnycdn.com";
  console.log(`Uploading ${files.length} files to ${host}/${storageZone.Name}…`);

  let done = 0;
  const queue = [...files];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const file = queue.pop();
      const key = relative(root, file).split(sep).join("/");
      const res = await fetch(
        `https://${host}/${storageZone.Name}/${encodeURI(key)}`,
        {
          method: "PUT",
          headers: { AccessKey: storageZone.Password },
          body: readFileSync(file),
        }
      );
      if (!res.ok) throw new Error(`Upload failed ${key}: HTTP ${res.status}`);
      done++;
      if (done % 25 === 0) console.log(`  ${done}/${files.length}`);
    }
  });
  await Promise.all(workers);
  console.log(`  ${done}/${files.length} uploaded.`);
}

// ── build ────────────────────────────────────────────────────

function buildStatic(newsEndpoint) {
  console.log(`Building static export (news endpoint: ${newsEndpoint})…`);
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      BUILD_STATIC: "1",
      NEXT_PUBLIC_NEWS_ENDPOINT: newsEndpoint,
    },
  });
}

// ── commands ─────────────────────────────────────────────────

async function probe() {
  const [storage, pull, scripts] = await Promise.all([
    listAll("/storagezone?page=1&perPage=1000"),
    listAll("/pullzone?page=1&perPage=1000"),
    listAll("/compute/script?page=1&perPage=100").catch((e) => `ERROR: ${e.message}`),
  ]);
  console.log(
    "Storage zones:",
    storage.map((z) => `${z.Name} (${z.Region}, id ${z.Id})`)
  );
  console.log(
    "Pull zones:",
    pull.map((z) => `${z.Name} → ${z.Hostnames?.[0]?.Value} (id ${z.Id})`)
  );
  console.log(
    "Compute scripts:",
    Array.isArray(scripts)
      ? scripts.map((s) => `${s.Name} (id ${s.Id}, type ${s.ScriptType})`)
      : scripts
  );
}

async function deployScript() {
  execSync("node scripts/build-edge.mjs", { stdio: "inherit" });
  return ensureEdgeScript();
}

async function deploySite(newsEndpoint) {
  buildStatic(newsEndpoint);
  const storageZone = await ensureStorageZone();
  const { zone: pullZone, host } = await ensurePullZone(storageZone);
  await uploadDirectory(storageZone);
  console.log("Purging pull zone cache…");
  await api("POST", `/pullzone/${pullZone.Id}/purgeCache`, {});
  console.log(`\nSite live at https://${host}/`);
  return host;
}

const command = process.argv[2] ?? "all";
try {
  if (command === "probe") {
    await probe();
  } else if (command === "script") {
    await deployScript();
  } else if (command === "site") {
    const endpoint = process.argv[3];
    if (!endpoint) throw new Error("Usage: deploy-bunny.mjs site <news-endpoint-url>");
    await deploySite(endpoint);
  } else if (command === "all") {
    const scriptUrl = await deployScript();
    await deploySite(scriptUrl);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(`\nDeploy failed: ${error.message}`);
  process.exit(1);
}
