# 第三方 Skill 参考与版权说明

> 本项目可以参考第三方 skill 的结构、工作流和产品化方式，但不得在无归属、无许可处理的情况下直接复制其模板、脚本、全文 prompt 或素材。

## Soku Skills

- 来源：https://soku.ai/skills
- 用途：产品调研和灵感参考
- 处理方式：
  - 不复制 Full Skill 原文
  - 只记录能力分类、页面结构、中文化命名和 Pro 化方向
  - 详细调研见 [Soku Skills 调研记录](soku-skills-research.md)

## op7418 / guizang-ppt-skill

- 仓库：https://github.com/op7418/guizang-ppt-skill
- 作者/维护者：歸藏
- License：GNU Affero General Public License v3.0
- 当前处理方式：
  - 只作为网页 PPT / 模板化视觉 skill 的结构参考
  - 不直接复制模板、脚本、样式和参考文件
  - 若未来 vendoring 或派生，必须保留 AGPL-3.0 license、原作者归属和源码开放义务评估

可借鉴点：

- `SKILL.md` 负责入口和工作流
- `assets/` 放可运行模板
- `references/` 按主题拆解布局、主题、截图、校验
- `scripts/` 提供验证脚本
- 视觉类 skill 需要“生成 -> 渲染 -> 截图 -> 检查”的闭环

## op7418 / Humanizer-zh

- 仓库：https://github.com/op7418/Humanizer-zh
- Copyright：Copyright (c) 2026 歸藏
- License：MIT
- 当前处理方式：
  - 可作为第三批 `B2B 外贸英文文案 Pro` / 中文内容去 AI 痕迹的参考
  - 如果复制或改编实质内容，必须保留 MIT copyright notice 和 permission notice

可借鉴点：

- 明确列出 AI 写作痕迹模式
- 先识别，再重写，再保留意义和语调
- 中文用户场景下，适合做“老板汇报 / 外贸文案 / 社媒内容”的自然化审校

## op7418 / guizang-social-card-skill

- 仓库：https://github.com/op7418/guizang-social-card-skill
- 作者/维护者：歸藏
- License：GNU Affero General Public License v3.0
- 当前处理方式：
  - 只作为小红书图文、公众号封面、社媒卡片的产品化结构参考
  - 不直接复制模板、脚本、样式和参考文件
  - 若未来 vendoring 或派生，必须保留 AGPL-3.0 license、原作者归属和源码开放义务评估

可借鉴点：

- 社媒卡片按平台规格组织
- 明确“强能力范围”和“不适合范围”
- 图片/截图处理有单独参考文件
- 输出前有 QA checklist 和自动校验思路

## 当前项目的版权策略

第一阶段只做自有中文业务 skills，不复制第三方代码或模板。

第三批 Pro 版本如果需要引入第三方资产，应采用以下流程：

1. 先确认 license 是否允许目标使用方式。
2. 在 `NOTICE` 或对应 skill 的 `SKILL.md` 中保留来源、作者和 license。
3. 如果复制 AGPL 代码或模板，先单独评估 AGPL 对分发、网络服务和源码开放的影响。
4. 用户露出保持中文，但版权和 license 名称不翻译、不省略。
