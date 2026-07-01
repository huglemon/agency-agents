# 当前阶段成果

> 这份文档记录仓库当前最重要的阶段性结论，方便后续任务快速接手，不必重新翻历史对话。

## 当前判断

- 本仓库当前承担的是 **Agent 资产 + 转换说明 + 场景分类** 的沉淀工作
- Accio Work 目前以 **转换目标 + Skill pack 安装规划** 为主，不默认写入真实账号
- 现阶段优先级已经从 **先把 Agent 说清楚、分清楚、转得出来** 扩展到 **让 Accio Work 的 Agent-first Skills 市场可被校验、导出、dry-run 检查，并支持显式安装 Skills**

## 已完成的阶段性成果

### 1. Accio Work 转换链路已经落地

- `scripts/convert.sh` 已新增 `accio-work` 转换入口
- `integrations/README.md` 已增加 Accio Work 说明与生成入口
- `integrations/accio-work/README.md` 已明确这是 **draft bundle**，不是安装器
- 每个转换结果会产出：
  - `manifest.json`
  - `profile.template.jsonc`
  - `agent-core/`
- 对存在 Agent-Skill 绑定的 repo-native Agent，转换结果还会写入：
  - `manifest.json.skillPack`
  - `profile.template.jsonc.skillPack`
  - `agent-core/agent.json.skillIds`
  - `agent-core/SKILLS.md`

### 2. Accio Work 的账号作用域边界已经明确

- `~/.accio/accounts/<account-id>/` 是账号级目录
- Agent、Skill、Plugin、权限、运行态、会话等都可能落在账号作用域中
- 因此当前仓库只负责生成转换产物，不直接假装完成安装

### 3. B2B 外贸场景的 Agent 分类已经整理

- 已形成中文化、场景化的 Agent 分类建议
- 重点围绕阿里国际站 B2B 外贸用户的获客、询盘、报价、跟进、复购与复盘
- 分类文档可作为后续推荐、分组、展示和默认包设计的依据

### 4. 文档导航已经补齐

- 新增了总目录入口，便于后续任务快速定位
- 相关文档已互相链接，减少重复翻找

### 5. Agent-first Skills 市场第一版已经落地

- 新增 `skills/registry.json` 作为中文 Skills 市场注册表
- 新增 12 个 P0/P1 外贸 B2B / 阿里国际站业务 Skills：
  - `外贸产品资料知识库标准化`
  - `产品资料缺口诊断`
  - `阿里国际站产品发布包生成`
  - `阿里产品标题 / 关键词 / 属性评分`
  - `RFQ / 询盘采购意图解析`
  - `报价包字段生成`
  - `外贸询盘质量搜索词清洗`
  - `老板版经营结论压缩`
  - `独立站资料 -> 国际站知识库迁移`
  - `阿里竞品产品页字段拆解`
  - `国际站经营月报结构化`
  - `7/14/30 国际站快启动复盘`
- 新增 P2 Pro 方向注册项，用于后续把官方默认能力做成外贸增强版
- 新增 `agent-skill-packs/accio-work-b2b-foreign-trade.json`，声明 Agent 应该一起安装哪些 Skills 和 Plugins
- 新增 `scripts/validate-skill-market.mjs`，可检查 Skill 是否存在、Agent pack 是否引用了缺失 Skill、`SKILL.md` frontmatter 是否符合规范、Accio Work bundle 是否内嵌了 skill pack
- 新增 `scripts/export-accio-work-skill-market.mjs`，可导出 `skill-market/`，并把 pack 摘要写入对应 Agent bundle
- 新增 `scripts/plan-agent-skill-install.mjs`，可判断某个 Agent 的 required/optional Skills 是否存在，并可检查指定 `~/.accio/accounts/<account-id>` 下是否已安装
- 新增 `scripts/install-accio-work-agent-skill-pack.mjs`，默认 dry-run；显式 `--apply` 时可把 Agent required Skills 复制到指定 Accio account
- `integrations/accio-work/skill-market/` 已能承载导出的 `skills-registry.json` 与 `agent-skill-packs.json`

### 6. 外部 Skills 调研与版权边界已经记录

- 已逐项阅读并整理 `https://soku.ai/skills` 的 53 个 Skills 页面，形成中文调研表
- 已查看以下仓库并记录版权边界：
  - `op7418/guizang-ppt-skill`
  - `op7418/Humanizer-zh`
  - `op7418/guizang-social-card-skill`
- 当前策略是不复制第三方 Full Skill、模板、脚本和素材；只吸收产品结构和工作流灵感
- 若未来 vendoring AGPL 项目，需要单独保留 license、copyright 和源码开放义务评估

## 现在不要误解的事情

- 这不是完整的 Accio Work Agent 安装器
- 这不是 Plugin 的最终账号安装实现
- 这不是把 agents 直接写进用户账号目录的落地版本
- `install-accio-work-agent-skill-pack.mjs --apply` 只负责复制 Skills，并记录 pack 安装计划；它不修改 Agent、Plugin、会话、权限或 Accio Work 全局索引
- 这不是第三方 Skills 的无归属复制版本

## 下一步建议

1. 继续完善 Accio Work Agent 安装器的账号选择、Agent id 生成、权限与索引刷新逻辑
2. 让安装器读取 `manifest.json.skillPack`，实现 Agent 创建和 required Skills 安装的一次性事务
3. 为 P2 Pro Skills 继续打磨真实业务样例，但保持与官方默认能力的差异化
4. 在真正写 Agent 账号安装逻辑前，再补一次 `~/.accio/accounts/<account-id>/` 注册表和索引文件现场验证
5. 如果要分发第三方派生 skill，先完成 license、NOTICE 和 AGPL 义务评估
