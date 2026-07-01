#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(repoRoot, "skills", "registry.json");
const packPath = path.join(repoRoot, "agent-skill-packs", "accio-work-b2b-foreign-trade.json");
const accioRoot = path.join(repoRoot, "integrations", "accio-work");
const marketDir = path.join(accioRoot, "skill-market");
const agentsDir = path.join(accioRoot, "agents");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function stripJsonc(text) {
  return text
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

function readJsoncIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(stripJsonc(fs.readFileSync(file, "utf8")));
}

function writeProfileTemplate(file, profile) {
  const body = JSON.stringify(profile, null, 2);
  fs.writeFileSync(
    file,
    `{\n  // Accio Work account-scoped profile template.\n  // Fill these values only inside a real installer that knows the target account.\n${body.slice(2)}\n`
  );
}

function skillRecord(skillById, skillId, required) {
  const skill = skillById.get(skillId);
  const folder = skill?.folder ?? null;
  const skillPath = folder ? path.join(repoRoot, folder, "SKILL.md") : null;
  return {
    id: skillId,
    required,
    displayName: skill?.displayName ?? skillId,
    phase: skill?.phase ?? null,
    type: skill?.type ?? null,
    folder,
    existsInRegistry: Boolean(skill),
    hasSkillFile: Boolean(skillPath && fs.existsSync(skillPath))
  };
}

function buildSkillPackSummary(pack, skillById) {
  const requiredSkills = (pack.requiredSkills ?? []).map((id) => skillRecord(skillById, id, true));
  const optionalSkills = (pack.optionalSkills ?? []).map((id) => skillRecord(skillById, id, false));
  const missingSkills = [...requiredSkills, ...optionalSkills]
    .filter((skill) => !skill.existsInRegistry || !skill.hasSkillFile)
    .map((skill) => skill.id);

  return {
    source: "agent-skill-packs/accio-work-b2b-foreign-trade.json",
    agentSlug: pack.agentSlug,
    displayName: pack.displayName,
    requiredSkills,
    optionalSkills,
    recommendedPlugins: pack.recommendedPlugins ?? [],
    ready: missingSkills.length === 0,
    missingSkills
  };
}

function renderSkillsMarkdown(summary) {
  const required = summary.requiredSkills.length
    ? summary.requiredSkills.map((skill) => `- ${skill.displayName} (\`${skill.id}\`)`).join("\n")
    : "- 无";
  const optional = summary.optionalSkills.length
    ? summary.optionalSkills.map((skill) => `- ${skill.displayName} (\`${skill.id}\`)`).join("\n")
    : "- 无";
  const plugins = summary.recommendedPlugins.length
    ? summary.recommendedPlugins.map((plugin) => `- \`${plugin}\``).join("\n")
    : "- 无";

  return `# Skills

这个 Agent 在 Accio Work 中建议和以下 Skills 一起安装。启动或安装时先检查必装 Skills 是否存在；缺失时不要静默跳过，应提示用户先安装或选择带有这些 Skills 的 Agent 包。

## 必装 Skills

${required}

## 可选 Skills

${optional}

## 推荐 Plugins

${plugins}

## 判断规则

- 必装 Skills 全部存在时，Agent 才算完整可用。
- 可选 Skills 缺失时，Agent 可以运行，但应降低对应交付范围。
- 推荐 Plugins 缺失时，Agent 仍可输出方案，但不能假装已经连上外部系统。
`;
}

function enrichAgentBundle(pack, summary) {
  const bundleDir = path.join(agentsDir, pack.agentSlug);
  if (!fs.existsSync(bundleDir)) return false;

  const manifestPath = path.join(bundleDir, "manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    manifest.skillPack = summary;
    manifest.generatedFiles = Array.from(new Set([...(manifest.generatedFiles ?? []), "agent-core/SKILLS.md"]));
    writeJson(manifestPath, manifest);
  }

  const coreDir = path.join(bundleDir, "agent-core");
  fs.mkdirSync(coreDir, { recursive: true });
  fs.writeFileSync(path.join(coreDir, "SKILLS.md"), renderSkillsMarkdown(summary));

  const agentPath = path.join(coreDir, "agent.json");
  if (fs.existsSync(agentPath)) {
    const agent = readJson(agentPath);
    agent.skillIds = pack.requiredSkills ?? [];
    agent.catalogSkillIds = pack.optionalSkills ?? [];
    agent.recommendedPluginIds = pack.recommendedPlugins ?? [];
    agent.skillPack = {
      source: summary.source,
      requiredSkillIds: pack.requiredSkills ?? [],
      optionalSkillIds: pack.optionalSkills ?? [],
      recommendedPluginIds: pack.recommendedPlugins ?? []
    };
    writeJson(agentPath, agent);
  }

  const profilePath = path.join(bundleDir, "profile.template.jsonc");
  const profile = readJsoncIfExists(profilePath);
  if (profile) {
    profile.skillPack = {
      source: summary.source,
      requiredSkillIds: pack.requiredSkills ?? [],
      optionalSkillIds: pack.optionalSkills ?? [],
      recommendedPluginIds: pack.recommendedPlugins ?? []
    };
    writeProfileTemplate(profilePath, profile);
  }

  return true;
}

const registry = readJson(registryPath);
const packs = readJson(packPath);
const skillById = new Map(registry.skills.map((skill) => [skill.id, skill]));

fs.mkdirSync(marketDir, { recursive: true });
writeJson(path.join(marketDir, "skills-registry.json"), registry);
writeJson(path.join(marketDir, "agent-skill-packs.json"), packs);

let enriched = 0;
let skippedExternal = 0;
for (const pack of packs.packs) {
  const summary = buildSkillPackSummary(pack, skillById);
  if (enrichAgentBundle(pack, summary)) {
    enriched += 1;
  } else if (pack.external) {
    skippedExternal += 1;
  }
}

console.log(`[OK] Exported Accio Work skill market (${registry.skills.length} skills, ${packs.packs.length} packs).`);
console.log(`[OK] Enriched ${enriched} repo-native agent bundle(s); skipped ${skippedExternal} external pack(s).`);
