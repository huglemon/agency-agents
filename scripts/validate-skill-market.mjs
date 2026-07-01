#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(repoRoot, "skills", "registry.json");
const packPath = path.join(repoRoot, "agent-skill-packs", "accio-work-b2b-foreign-trade.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

const registry = readJson(registryPath);
const packs = readJson(packPath);
const skillIds = new Set(registry.skills.map((skill) => skill.id));
const exportedRegistryPath = path.join(repoRoot, "integrations", "accio-work", "skill-market", "skills-registry.json");
const exportedPacksPath = path.join(repoRoot, "integrations", "accio-work", "skill-market", "agent-skill-packs.json");
const accioAgentsDir = path.join(repoRoot, "integrations", "accio-work", "agents");
let failures = 0;
let warnings = 0;

function fail(message) {
  failures += 1;
  console.error(`[FAIL] ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`[WARN] ${message}`);
}

function ok(message) {
  console.log(`[OK] ${message}`);
}

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function validateSkillMarkdown(skill) {
  const relPath = path.join(skill.folder, "SKILL.md");
  const text = readText(relPath);
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    fail(`SKILL.md for ${skill.id} must start with YAML frontmatter`);
    return;
  }

  const keys = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(":")[0].trim());
  const allowed = new Set(["name", "description"]);
  for (const key of keys) {
    if (!allowed.has(key)) {
      fail(`SKILL.md frontmatter for ${skill.id} must only contain name/description; found ${key}`);
    }
  }
  if (!keys.includes("name") || !keys.includes("description")) {
    fail(`SKILL.md frontmatter for ${skill.id} must contain name and description`);
  }
  if (!text.includes(`# `)) {
    warn(`SKILL.md for ${skill.id} has no visible title`);
  }
}

for (const skill of registry.skills) {
  if (!skill.id || !/^[a-z0-9-]+$/.test(skill.id)) {
    fail(`Invalid skill id: ${skill.id}`);
  }
  if (!skill.displayName || !skill.summary) {
    fail(`Skill ${skill.id} must include displayName and summary`);
  }
  if (!skill.folder) {
    fail(`Skill ${skill.id} must include a folder path`);
  } else if (!exists(skill.folder)) {
    fail(`Skill folder missing for ${skill.id}: ${skill.folder}`);
  } else if (!exists(path.join(skill.folder, "SKILL.md"))) {
    fail(`SKILL.md missing for ${skill.id}: ${skill.folder}/SKILL.md`);
  } else {
    validateSkillMarkdown(skill);
  }
}

const packByAgent = new Map(packs.packs.map((pack) => [pack.agentSlug, pack]));

for (const pack of packs.packs) {
  if (!pack.agentSlug) {
    fail("Agent pack missing agentSlug");
    continue;
  }
  if (pack.sourcePath && !exists(pack.sourcePath)) {
    fail(`Agent source missing for ${pack.agentSlug}: ${pack.sourcePath}`);
  }
  if (!pack.sourcePath && !pack.external) {
    warn(`Agent ${pack.agentSlug} has no sourcePath and is not marked external`);
  }
  for (const field of ["requiredSkills", "optionalSkills"]) {
    for (const skillId of pack[field] || []) {
      if (!skillIds.has(skillId)) {
        fail(`Agent ${pack.agentSlug} references missing skill ${skillId}`);
      }
    }
  }

  if (fs.existsSync(accioAgentsDir) && pack.sourcePath) {
    const manifestPath = path.join(accioAgentsDir, pack.agentSlug, "manifest.json");
    const agentJsonPath = path.join(accioAgentsDir, pack.agentSlug, "agent-core", "agent.json");
    const skillsMdPath = path.join(accioAgentsDir, pack.agentSlug, "agent-core", "SKILLS.md");
    if (!fs.existsSync(manifestPath)) {
      warn(`Accio Work bundle missing for repo-native agent ${pack.agentSlug}`);
    } else {
      const manifest = readJson(manifestPath);
      if (!manifest.skillPack || manifest.skillPack.agentSlug !== pack.agentSlug) {
        fail(`Accio Work manifest for ${pack.agentSlug} is missing matching skillPack metadata`);
      }
    }
    if (fs.existsSync(agentJsonPath)) {
      const agentJson = readJson(agentJsonPath);
      const required = JSON.stringify(agentJson.skillIds || []);
      const expectedRequired = JSON.stringify(pack.requiredSkills || []);
      const optional = JSON.stringify(agentJson.catalogSkillIds || []);
      const expectedOptional = JSON.stringify(pack.optionalSkills || []);
      if (required !== expectedRequired || optional !== expectedOptional) {
        fail(`Accio Work agent.json for ${pack.agentSlug} has stale skillIds/catalogSkillIds`);
      }
    }
    if (!fs.existsSync(skillsMdPath)) {
      fail(`Accio Work SKILLS.md missing for ${pack.agentSlug}`);
    }
  }
}

for (const skill of registry.skills) {
  if (skill.type === "pro-version") continue;
  for (const agentSlug of skill.recommendedAgents || []) {
    const pack = packByAgent.get(agentSlug);
    if (!pack) continue;
    const packSkillIds = new Set([...(pack.requiredSkills || []), ...(pack.optionalSkills || [])]);
    if (!packSkillIds.has(skill.id)) {
      warn(`Skill ${skill.id} recommends ${agentSlug}, but that agent pack does not include the skill`);
    }
  }
}

if (fs.existsSync(exportedRegistryPath)) {
  const exportedRegistry = readJson(exportedRegistryPath);
  if (!sameJson(exportedRegistry, registry)) {
    warn("integrations/accio-work/skill-market/skills-registry.json is stale; run convert or copy registry");
  }
} else {
  warn("integrations/accio-work/skill-market/skills-registry.json is not present yet");
}

if (fs.existsSync(exportedPacksPath)) {
  const exportedPacks = readJson(exportedPacksPath);
  if (!sameJson(exportedPacks, packs)) {
    warn("integrations/accio-work/skill-market/agent-skill-packs.json is stale; run convert or copy packs");
  }
} else {
  warn("integrations/accio-work/skill-market/agent-skill-packs.json is not present yet");
}

if (failures === 0) {
  ok(`Skill market validation passed (${registry.skills.length} skills, ${packs.packs.length} agent packs, ${warnings} warnings).`);
} else {
  console.error(`Skill market validation failed with ${failures} failure(s) and ${warnings} warning(s).`);
  process.exit(1);
}
