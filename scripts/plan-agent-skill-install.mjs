#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const repoRoot = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(repoRoot, "skills", "registry.json");
const packPath = path.join(repoRoot, "agent-skill-packs", "accio-work-b2b-foreign-trade.json");

function usage() {
  console.error("Usage: node scripts/plan-agent-skill-install.mjs <agent-slug> [--json] [--account <id>] [--account-path <path>]");
  console.error("Example: node scripts/plan-agent-skill-install.mjs search-query-analyst");
  console.error("Example: node scripts/plan-agent-skill-install.mjs search-query-analyst --account 286683773_609002");
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) usage();

const agentSlug = args.find((arg) => !arg.startsWith("--"));
const asJson = args.includes("--json");
if (!agentSlug) usage();

function flagValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) usage();
  return value;
}

const accountId = flagValue("--account");
const accountPathArg = flagValue("--account-path");
const accountPath = accountPathArg
  ? path.resolve(accountPathArg)
  : accountId
    ? path.join(os.homedir(), ".accio", "accounts", accountId)
    : null;

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const packs = JSON.parse(fs.readFileSync(packPath, "utf8"));
const skillById = new Map(registry.skills.map((skill) => [skill.id, skill]));
const pack = packs.packs.find((item) => item.agentSlug === agentSlug);

if (!pack) {
  const known = packs.packs.map((item) => item.agentSlug).sort();
  console.error(`Unknown agent slug: ${agentSlug}`);
  console.error(`Known agents: ${known.join(", ")}`);
  process.exit(1);
}

function skillRecord(id, required) {
  const skill = skillById.get(id);
  const accountSkillPath = accountPath ? path.join(accountPath, "skills", id, "SKILL.md") : null;
  return {
    id,
    required,
    existsInRegistry: Boolean(skill),
    displayName: skill?.displayName ?? null,
    phase: skill?.phase ?? null,
    type: skill?.type ?? null,
    folder: skill?.folder ?? null,
    hasSkillFile: skill?.folder ? fs.existsSync(path.join(repoRoot, skill.folder, "SKILL.md")) : false,
    installedInAccount: accountSkillPath ? fs.existsSync(accountSkillPath) : null
  };
}

function pluginRecord(id) {
  const pluginPath = accountPath ? path.join(accountPath, "plugins", "installed", id, "plugin.json") : null;
  return {
    id,
    installedInAccount: pluginPath ? fs.existsSync(pluginPath) : null
  };
}

const plan = {
  agentSlug: pack.agentSlug,
  displayName: pack.displayName,
  sourcePath: pack.sourcePath,
  external: Boolean(pack.external),
  agentSourceExists: pack.sourcePath ? fs.existsSync(path.join(repoRoot, pack.sourcePath)) : Boolean(pack.external),
  account: accountPath
    ? {
        id: accountId ?? path.basename(accountPath),
        path: accountPath,
        exists: fs.existsSync(accountPath)
      }
    : null,
  requiredSkills: (pack.requiredSkills || []).map((id) => skillRecord(id, true)),
  optionalSkills: (pack.optionalSkills || []).map((id) => skillRecord(id, false)),
  recommendedPlugins: (pack.recommendedPlugins || []).map((id) => pluginRecord(id))
};

const allSkills = [...plan.requiredSkills, ...plan.optionalSkills];
const missing = allSkills.filter((skill) => !skill.existsInRegistry || !skill.hasSkillFile);
const missingRequiredInAccount = accountPath
  ? plan.requiredSkills.filter((skill) => !skill.installedInAccount)
  : [];
const missingPluginsInAccount = accountPath
  ? plan.recommendedPlugins.filter((plugin) => !plugin.installedInAccount)
  : [];
if (asJson) {
  console.log(JSON.stringify({
    ...plan,
    ready: missing.length === 0 && plan.agentSourceExists,
    accountReady: accountPath ? missingRequiredInAccount.length === 0 && plan.account.exists : null,
    missingRequiredSkillsInAccount: missingRequiredInAccount.map((skill) => skill.id),
    missingRecommendedPluginsInAccount: missingPluginsInAccount.map((plugin) => plugin.id)
  }, null, 2));
} else {
  console.log(`# ${plan.displayName} (${plan.agentSlug})`);
  console.log("");
  console.log(`Agent source: ${plan.sourcePath || (plan.external ? "external Accio Work agent" : "missing")}`);
  console.log(`Agent source status: ${plan.agentSourceExists ? "OK" : "MISSING"}`);
  if (plan.account) {
    console.log(`Account: ${plan.account.id} (${plan.account.exists ? "OK" : "MISSING"})`);
  }
  console.log("");
  console.log("## Required Skills");
  for (const skill of plan.requiredSkills) {
    const accountStatus = plan.account ? ` / account ${skill.installedInAccount ? "INSTALLED" : "MISSING"}` : "";
    console.log(`- ${skill.hasSkillFile ? "OK" : "MISSING"}${accountStatus} ${skill.displayName || skill.id} (${skill.id})`);
  }
  console.log("");
  console.log("## Optional Skills");
  if (plan.optionalSkills.length === 0) {
    console.log("- None");
  } else {
    for (const skill of plan.optionalSkills) {
      const accountStatus = plan.account ? ` / account ${skill.installedInAccount ? "INSTALLED" : "MISSING"}` : "";
      console.log(`- ${skill.hasSkillFile ? "OK" : "MISSING"}${accountStatus} ${skill.displayName || skill.id} (${skill.id})`);
    }
  }
  console.log("");
  console.log("## Recommended Plugins");
  if (plan.recommendedPlugins.length === 0) {
    console.log("- None");
  } else {
    for (const plugin of plan.recommendedPlugins) {
      const accountStatus = plan.account ? ` / account ${plugin.installedInAccount ? "INSTALLED" : "MISSING"}` : "";
      console.log(`- ${plugin.id}${accountStatus}`);
    }
  }
  console.log("");
  console.log(`Ready: ${missing.length === 0 && plan.agentSourceExists ? "yes" : "no"}`);
  if (plan.account) {
    console.log(`Account ready: ${missingRequiredInAccount.length === 0 && plan.account.exists ? "yes" : "no"}`);
  }
}

if (missing.length > 0 || !plan.agentSourceExists) process.exit(1);
