# Accio Work Integration

Converts Agency agents into **draft Accio Work agent bundles**.

## 当前阶段成果

- 已完成 Accio Work 的转换型输出
- 生成入口已经挂到 `scripts/convert.sh --tool accio-work`
- 转换结果统一输出为 `integrations/accio-work/agents/<agent-slug>/`
- 当前只做 **conversion only**，不直接写入 `~/.accio/accounts/...`
- Agent 账号级安装、账号选择、注册表刷新和运行态落盘仍属于后续安装器工作
- Skills 市场已支持导出、Agent bundle 内嵌 skill pack、账号级 dry-run 检查和显式 Skills 复制

## 快速入口

- [文档总目录](../../docs/README.md)
- [当前阶段成果](../../docs/current-state.md)

This integration currently supports conversion only. It intentionally does
not install files into `~/.accio/accounts/...` because Accio Work stores
agents, skills, plugins, permissions, runtime state, and sessions inside
account-scoped directories.

## Generate

From the repository root:

```bash
./scripts/convert.sh --tool accio-work
```

Generated bundles are written to:

```text
integrations/accio-work/agents/<agent-slug>/
```

Each bundle contains:

```text
integrations/accio-work/agents/frontend-developer/
├── manifest.json
├── profile.template.jsonc
└── agent-core/
    ├── agent.json
    ├── AGENTS.md
    ├── BOOTSTRAP.md
    ├── IDENTITY.md
    ├── MEMORY.md
    ├── SOUL.md
    ├── TOOLS.md
    ├── USER.md
    └── tool-registry.jsonc
```

The Accio Work conversion also exports Agent-first skill market metadata:

```text
integrations/accio-work/skill-market/
├── skills-registry.json
└── agent-skill-packs.json
```

These files let a future installer check:

- whether a required skill exists in `skills/registry.json`
- which skills should be installed together with a given agent
- which plugins are recommended for that agent-skill pack
- whether an agent is repo-native or an external Accio Work business agent

For repo-native agents that have a pack, the exporter also enriches the bundle:

```text
integrations/accio-work/agents/<agent-slug>/
├── manifest.json              # includes skillPack
├── profile.template.jsonc      # includes skillPack ids
└── agent-core/
    ├── agent.json              # includes skillIds / catalogSkillIds
    └── SKILLS.md               # Chinese human-readable pack summary
```

You can run the exporter directly:

```bash
node scripts/export-accio-work-skill-market.mjs
```

## Mapping

The converter maps one source Agency agent to one Accio Work bundle:

- source frontmatter `name` -> `profile.template.jsonc.name` and
  `agent-core/agent.json.name`
- source frontmatter `description` -> profile and agent descriptions
- source body sections about identity, communication style, memory, and rules
  -> `agent-core/SOUL.md`
- remaining source body sections -> `agent-core/AGENTS.md`
- source path and slug -> `manifest.json` metadata

The generated `toolPreset` is `standard` by default. A future installer can
raise this to `developer` or `full` for specific agents after reviewing the
needed capabilities and permissions.

## Why Installation Is Not Automatic Yet

Accio Work appears to use account-scoped local state:

```text
~/.accio/accounts/<account-id>/
├── agents/
├── skills/
├── plugins/
├── mcp-servers/
├── connectors/
├── conversations/
├── automations/
└── workspaces/
```

An installed Accio Work agent is more than a prompt file. A real account agent
can include:

```text
agents/<agent-id>/
├── profile.jsonc
├── agent-core/
├── permissions/
├── resources/
├── runtime/
└── sessions/
```

Because of that, blindly copying generated bundles into `~/.accio/accounts`
may leave Accio Work indexes, permissions, runtime state, or account selection
out of sync.

## What A Future Installer Must Do

A production installer should:

1. Detect available Accio Work account directories under `~/.accio/accounts/`.
2. Let the user choose the target account.
3. Generate a unique Accio Work agent id.
4. Copy `agent-core/` into the new account agent directory.
5. Render `profile.template.jsonc` into `profile.jsonc` with the chosen account
   id and generated agent id.
6. Create any required `permissions/`, `runtime/`, `resources/`, or index files
   that Accio Work expects.
7. Refresh or update any Accio Work registry/index data if required.
8. Avoid modifying conversations, sessions, connected accounts, or plugin
   runtime data unless the user explicitly asks.

## Relationship To Skills And Plugins

Agency source files are **agents**, not Accio Work skills or plugins.

Accio Work supports a richer model:

- **Agent**: account-scoped persona and runtime container under `agents/`
- **Skill**: task capability, either account-level under `skills/` or bundled
  inside a plugin
- **Plugin**: larger capability package that can include skills, subagents,
  hooks, connectors, resources, and CLI tools

This converter only creates Agent bundles. It does not convert Agency agents
into Accio Work skills or plugins.

Current Agent-first skill planning lives in:

- `docs/accio-work-agent-first-skills-plan.md`
- `skills/registry.json`
- `agent-skill-packs/accio-work-b2b-foreign-trade.json`
- `scripts/validate-skill-market.mjs`

Run the validation before publishing or installing an agent-skill pack:

```bash
node scripts/validate-skill-market.mjs
```

Plan a specific Agent-Skill install:

```bash
node scripts/plan-agent-skill-install.mjs search-query-analyst --account 286683773_609002
```

Dry-run copying the Agent's required Skills into an Accio Work account:

```bash
node scripts/install-accio-work-agent-skill-pack.mjs search-query-analyst --account 286683773_609002
```

Apply only after reviewing the dry-run:

```bash
node scripts/install-accio-work-agent-skill-pack.mjs search-query-analyst --account 286683773_609002 --apply
```

This only copies Skills and records the pack plan under the account's `skills/`
directory. It does not create Agents, install Plugins, modify conversations,
change permissions, or refresh Accio Work global indexes.

## Recommended Next Step

Use this conversion output as the stable intermediate format for an installer.
Do not treat it as a complete Accio Work installation format until the account
registration and runtime metadata requirements are fully understood.
