#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const repoRoot = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(repoRoot, "skills", "registry.json");
const packPath = path.join(repoRoot, "agent-skill-packs", "accio-work-b2b-foreign-trade.json");

function usage() {
  console.error("Usage: node scripts/install-accio-work-agent-skill-pack.mjs <agent-slug> --account <id> [--include-optional] [--apply] [--overwrite]");
  console.error("Dry run is the default. Use --apply only after reviewing the plan.");
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) usage();

function flagValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) usage();
  return value;
}

const agentSlug = args.find((arg) => !arg.startsWith("--"));
const accountId = flagValue("--account");
const accountPathArg = flagValue("--account-path");
const apply = args.includes("--apply");
const includeOptional = args.includes("--include-optional");
const overwrite = args.includes("--overwrite");

if (!agentSlug || (!accountId && !accountPathArg)) usage();

const accountPath = accountPathArg
  ? path.resolve(accountPathArg)
  : path.join(os.homedir(), ".accio", "accounts", accountId);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function copySkill(skill) {
  const source = path.join(repoRoot, skill.folder);
  const target = path.join(accountPath, "skills", skill.id);
  const exists = fs.existsSync(target);
  if (exists && !overwrite) {
    return { ...skill, action: "skip-existing", target };
  }
  fs.cpSync(source, target, { recursive: true, force: overwrite });
  return { ...skill, action: exists ? "overwrite" : "install", target };
}

const registry = readJson(registryPath);
const packs = readJson(packPath);
const skillById = new Map(registry.skills.map((skill) => [skill.id, skill]));
const pack = packs.packs.find((item) => item.agentSlug === agentSlug);

if (!pack) {
  console.error(`Unknown agent slug: ${agentSlug}`);
  process.exit(1);
}
if (!fs.existsSync(accountPath)) {
  console.error(`Accio account path does not exist: ${accountPath}`);
  process.exit(1);
}

const requestedIds = [
  ...(pack.requiredSkills ?? []),
  ...(includeOptional ? (pack.optionalSkills ?? []) : [])
];
const skills = requestedIds.map((id) => {
  const skill = skillById.get(id);
  const folderExists = skill?.folder ? fs.existsSync(path.join(repoRoot, skill.folder, "SKILL.md")) : false;
  return {
    id,
    required: (pack.requiredSkills ?? []).includes(id),
    displayName: skill?.displayName ?? id,
    folder: skill?.folder ?? null,
    existsInRegistry: Boolean(skill),
    hasSkillFile: folderExists,
    installedInAccount: fs.existsSync(path.join(accountPath, "skills", id, "SKILL.md"))
  };
});

const missing = skills.filter((skill) => !skill.existsInRegistry || !skill.hasSkillFile);
if (missing.length > 0) {
  console.error(`Cannot install because skill source is missing: ${missing.map((skill) => skill.id).join(", ")}`);
  process.exit(1);
}

const actions = apply ? skills.map(copySkill) : skills.map((skill) => ({
  ...skill,
  action: skill.installedInAccount ? "skip-existing" : "would-install",
  target: path.join(accountPath, "skills", skill.id)
}));

const record = {
  agentSlug: pack.agentSlug,
  displayName: pack.displayName,
  accountPath,
  applied: apply,
  includeOptional,
  overwrite,
  skills: actions,
  recommendedPlugins: (pack.recommendedPlugins ?? []).map((id) => ({
    id,
    installedInAccount: fs.existsSync(path.join(accountPath, "plugins", "installed", id, "plugin.json"))
  }))
};

if (apply) {
  const recordDir = path.join(accountPath, "skills", ".agency-agents-packs");
  fs.mkdirSync(recordDir, { recursive: true });
  fs.writeFileSync(path.join(recordDir, `${agentSlug}.json`), `${JSON.stringify(record, null, 2)}\n`);
}

console.log(JSON.stringify(record, null, 2));
