import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const require = createRequire(import.meta.url);
const cliMain = require.resolve("@openapitools/openapi-generator-cli/main.js");

const loadEnvFile = (file) => {
  const env = {};
  if (!existsSync(file)) return env;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return env;
};

const env = {
  ...loadEnvFile(path.join(rootDir, ".env")),
  ...loadEnvFile(path.join(rootDir, ".env.development")),
};

const baseUrl = env.VITE_API_URL;
const specUrl = `${baseUrl.replace(/\/+$/, "")}/v3/api-docs`;

const result = spawnSync(
  process.execPath,
  [cliMain, "generate", "-i", specUrl, "-g", "typescript-axios", "-o", path.join(rootDir, "src/api/openApi")],
  { stdio: "inherit" }
);

if (result.status === 0) {
  const baseFile = path.join(rootDir, "src/api/openApi/base.ts");
  let content = readFileSync(baseFile, "utf8");
  content = content.replace(
    /export const BASE_PATH = [^\n]+;\n/,
    `export const BASE_PATH = import.meta.env.VITE_API_URL;\n`
  );
  writeFileSync(baseFile, content);

  const docsDir = path.join(rootDir, "src/api/openApi/docs");
  const escapedBase = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const serverUrlPattern = new RegExp(`(All URIs are relative to \\*)${escapedBase}(\\*)`, "g");
  for (const file of readdirSync(docsDir).filter((f) => f.endsWith(".md"))) {
    const filePath = path.join(docsDir, file);
    const doc = readFileSync(filePath, "utf8");
    const updated = doc.replace(serverUrlPattern, `$1{VITE_API_URL}$2`);
    if (updated !== doc) writeFileSync(filePath, updated);
  }
}

process.exit(result.status ?? 1); 