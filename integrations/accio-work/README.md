# Accio Work Integration

Converts Agency agents into **draft Accio Work agent bundles**.

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

## Recommended Next Step

Use this conversion output as the stable intermediate format for an installer.
Do not treat it as a complete Accio Work installation format until the account
registration and runtime metadata requirements are fully understood.

