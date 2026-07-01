# Skills 市场

> 这里不是通用 Skills 平铺市场，而是 Accio Work Agent-first 的中文业务 Skills 资产。

## 当前定位

- 第一阶段：围绕现有 Agents 内置 P0/P1 外贸 B2B 业务 Skills
- 第二阶段：补完整国际站 / 独立站 / 询盘 / 报价 / 月报链路
- 第三阶段：做官方默认能力的外贸 Pro 版本

## 文件结构

```text
skills/
├── registry.json
├── <skill-id>/
│   └── SKILL.md
└── README.md
```

`registry.json` 是市场注册表，包含：

- 中文露出名
- 阶段：P0 / P1 / P2
- 类型：Agent 内置 / Pro 版本
- 避免重复的官方能力
- 推荐绑定的 Agents
- 本地 skill 文件夹

## Agent 绑定

Agent 与 Skills 的配套关系在：

```text
agent-skill-packs/accio-work-b2b-foreign-trade.json
```

其中区分：

- `requiredSkills`：建议跟 Agent 一起安装
- `optionalSkills`：场景增强
- `recommendedPlugins`：建议联动的 Accio Work 插件

## 校验

运行：

```bash
node scripts/validate-skill-market.mjs
```

校验内容：

- 注册表中的 P0/P1 skill 目录是否存在
- 每个 skill 是否有 `SKILL.md`
- Agent pack 引用的 skill 是否在注册表中存在
- 指定了 `sourcePath` 的 Agent 文件是否存在
- Accio Work integration 导出的 skill-market 文件是否和源注册表一致
- repo-native Accio Work Agent bundle 是否已经写入 `skillPack` 和 `agent-core/SKILLS.md`

## 导出到 Accio Work integration

运行：

```bash
node scripts/export-accio-work-skill-market.mjs
```

导出内容：

- `integrations/accio-work/skill-market/skills-registry.json`
- `integrations/accio-work/skill-market/agent-skill-packs.json`
- `integrations/accio-work/agents/<agent-slug>/manifest.json.skillPack`
- `integrations/accio-work/agents/<agent-slug>/agent-core/SKILLS.md`

`./scripts/convert.sh --tool accio-work` 也会在转换结束后调用这个导出器。

## Agent 安装计划

查看某个 Agent 应该一起安装哪些 Skills 和推荐 Plugins：

```bash
node scripts/plan-agent-skill-install.mjs search-query-analyst
node scripts/plan-agent-skill-install.mjs alibaba-listing-optimization --json
node scripts/plan-agent-skill-install.mjs search-query-analyst --account 286683773_609002
```

输出内容可供后续 Accio Work 安装器读取：

- Agent 是否是仓库内置或外部 Accio Work Agent
- required skills 是否存在
- optional skills 是否存在
- recommended plugins 清单
- 如果传入 `--account` 或 `--account-path`，会额外检查本地 Accio account 中 required skills 和 recommended plugins 是否已经安装

## 安装 Agent 对应 Skills

默认只 dry-run，不写账号：

```bash
node scripts/install-accio-work-agent-skill-pack.mjs search-query-analyst --account 286683773_609002
```

确认计划后，显式安装 required Skills：

```bash
node scripts/install-accio-work-agent-skill-pack.mjs search-query-analyst --account 286683773_609002 --apply
```

可选参数：

- `--include-optional`：同时安装 optional Skills
- `--overwrite`：覆盖账号中已存在的同名 Skill

注意：该脚本只复制 Skills 并记录 pack 计划，不修改 Agent、Plugin、会话、权限或 Accio Work 全局索引。

## 命名原则

不要使用泛能力名：

- 不叫 `SEO 优化`
- 不叫 `Copywriting`
- 不叫 `图片 Prompt`
- 不叫 `Google Ads 优化`

使用业务限定名：

- `外贸询盘质量搜索词清洗`
- `阿里国际站产品发布包生成`
- `老板版经营结论压缩`
- `外贸产品资料知识库标准化`

## 版权原则

第三方 skill 只能作为灵感来源，除非明确处理 license 和 copyright。

详见：

- [第三方 Skill 参考与版权说明](../docs/third-party-skill-attribution.md)
- [Soku Skills 调研记录](../docs/soku-skills-research.md)
