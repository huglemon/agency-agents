# Accio Work Agent-First Skills 补全方案

> 当前阶段目标不是做一个独立平铺的 Skills 市场，而是围绕现有 Agents 补齐外贸 B2B / 阿里国际站 / 独立站运营所需的业务执行型 Skills。

## 核心判断

Accio Work 用户已经被教育为优先使用 Agents。用户心智更接近：

```text
我找一个 Agent 来帮我完成一类工作
Agent 内部再调用对应 Skills 把动作做细
```

因此第一阶段的重点应从“补全 Skills 市场”调整为“为现有 Agents 创作内置业务 Skills”。

Skills 不应和官方默认内置能力重复。官方已经覆盖通用文件、通用营销、通用 SEO、通用图片、通用电商等底座能力。如果继续做同名或近似能力，用户会不知道该选哪个，反而降低产品清晰度。

本方案采用三层分工：

```text
Agent
├── 负责角色判断
├── 负责上下文取舍
├── 负责业务口吻和最终交付
└── 例：国际站发布优化师、询盘跟进 Agent、老板汇报 Agent

Skill
├── 负责稳定动作
├── 输入输出清楚
├── 可被多个 Agent 复用
└── 例：RFQ 解析、报价字段生成、产品资料缺口诊断

Plugin
├── 负责接账号 / API / 工具链
├── 可以包含 Skills、Connectors、Subagents、CLI 工具
└── 例：国际站生意助手、OKKI CRM、钉钉、表格、文档
```

一句话原则：

```text
Agent 是会判断的人。
Skill 是能干活的手。
Plugin 是接系统的工具箱。
```

## 本地 Accio 能力基线

本地 `~/.accio` 下有两个账号状态，其中 `286683773_609002` 更完整，适合作为当前能力盘点基线。

当前 Skills 市场资产已经落在：

- `skills/registry.json`
- `skills/<skill-id>/SKILL.md`
- `agent-skill-packs/accio-work-b2b-foreign-trade.json`
- `scripts/validate-skill-market.mjs`

外部参考与版权边界见：

- [Soku Skills 调研记录](soku-skills-research.md)
- [第三方 Skill 参考与版权说明](third-party-skill-attribution.md)

### 已有官方默认 Skills

这些能力已经存在，不建议重复创作同类通用版：

- `accio-mcp-cli`
- `skill-finder`
- `skill-creator`
- `self-improvement`
- `image-prompt-guide`
- 远程默认 Skills 中还包含 PDF、DOCX、XLSX、PPTX、Copywriting、SEO、社媒、电商营销、选品、Amazon、Etsy、Shopify、图片/视频提示词等通用能力

### 已有 InWind 业务 Skills

这些是当前外贸 / 图片 / 产品方向的本地增强能力，可作为后续 Agent 内置能力的基础：

- `inwind-product-optimize`
  - 外贸独立站 / B2B 产品详情页优化
- `inwind-alibaba-product-optimize`
  - 阿里国际站商品详情页生成与优化
- `inwind-image-create`
  - 产品图、海报、场景图等图片生成
- `inwind-image-edit`
  - 图片编辑、换背景、修复、变体生成
- `inwind-image-translate`
  - 图片文字翻译与本地化

### 已安装相关 Plugins

当前更完整账号中已安装的业务相关插件包括：

- `国际站生意助手`
  - 国际站选品、发品、素材生成、店铺经营分析
- `Accio 采购工具箱`
  - 供应商、谈判、采购订单
- `OKKI AiReach`
  - 外贸获客、EDM、多渠道触达
- `OKKI CRM`
  - 外贸客户、商机、订单跟进
- `OKKI Shops`
  - 外贸 B2B 社媒营销
- `钉钉`
  - 办公、文档、表格、审批、日程等
- `Documents` / `Spreadsheets` / `Presentations`
  - 文档、表格、PPT 交付能力

## 不重复原则

第一阶段不要做这些通用 Skills：

- 通用 `SEO 优化`
- 通用 `Copywriting`
- 通用 `图片 Prompt`
- 通用 `PDF 解析`
- 通用 `Excel 报表`
- 通用 `PPT 生成`
- 通用 `产品营销 Brief`
- 通用 `电商营销`
- 通用 `AI 选品`
- 通用 `竞品分析`
- 通用 `Google Ads 优化`
- 通用 `外贸运营全能助手`

如果确实要覆盖同一能力领域，必须改成业务限定版或 Pro 版：

- 不叫 `竞品分析`
  - 叫 `阿里竞品产品页字段拆解`
- 不叫 `Google Ads 优化`
  - 叫 `外贸询盘质量搜索词清洗`
- 不叫 `产品知识库`
  - 叫 `外贸产品资料知识库标准化`
- 不叫 `报告总结`
  - 叫 `老板版经营结论压缩`

## 三批次路线

### 第一批 P0：Agent 内置基础补位

第一批只做现有 Agents 最需要的业务执行动作，数量控制在 8 个。

```text
P0 必做
├── 外贸产品资料知识库标准化
├── 产品资料缺口诊断
├── 阿里国际站产品发布包生成
├── 阿里产品标题 / 关键词 / 属性评分
├── RFQ / 询盘采购意图解析
├── 报价包字段生成
├── 外贸询盘质量搜索词清洗
└── 老板版经营结论压缩
```

### 第二批 P1：业务链路扩展

第二批补完整链路、迁移复盘和方法论。

```text
P1 第二批
├── 独立站资料 -> 国际站知识库迁移
├── 阿里竞品产品页字段拆解
├── 国际站经营月报结构化
└── 7/14/30 国际站快启动复盘
```

### 第三批 P2：官方能力 Pro 化

第三批允许覆盖官方已有能力领域，但必须做成外贸 B2B / 国际站 / 独立站增强版，让用户感知这里的 Skills 更专业、更贴近业务交付。

```text
P2 Pro 版本
├── B2B 外贸英文文案 Pro
├── B2B SEO / GEO Pro
├── 外贸广告分析 Pro
├── 外贸产品图素材 Pro
├── 外贸报告 Pro
├── 外贸竞品研究 Pro
├── 外贸表格数据 Pro
└── 外贸图片翻译 / 本地化 Pro
```

## 第一批 P0 明细

### 1. 外贸产品资料知识库标准化

绑定 Agents：

- `Product Operations Companion`
- `Knowledge Base Steward`
- `Alibaba Listing Optimization`

作用：

- 把独立站、PDF、Excel、图片、产品目录、旧详情页整理成外贸产品知识库
- 为 AWB / 国际站发布 / 询盘回复 / 报价 / 广告素材提供统一产品事实底座

输出：

- 产品名称
- 型号
- 规格
- 材质
- 尺寸
- 包装
- MOQ
- 交期
- 认证
- 应用场景
- FAQ
- 核心卖点
- 关键词
- 待补充字段
- 证据来源

### 2. 产品资料缺口诊断

绑定 Agents：

- `Product Operations Companion`
- `Knowledge Base Steward`
- `Alibaba Listing Optimization`

作用：

- 检查客户资料缺什么
- 防止 Agent 在资料不全时直接硬编
- 给客户形成补资料清单

输出：

- 缺失参数
- 缺失图片
- 缺失证书
- 缺失包装信息
- 缺失应用场景
- 缺失 FAQ
- 风险字段
- 优先补充清单

### 3. 阿里国际站产品发布包生成

绑定 Agents：

- `Alibaba Listing Optimization`
- `Cross-Border E-Commerce Specialist`

作用：

- 把产品知识库转成国际站可发布 Listing
- 可复用 `inwind-alibaba-product-optimize`

输出：

- 产品标题
- 关键词
- 属性字段
- 卖点
- 详情页结构
- MOQ / 包装 / 交期表达
- 主图 / 场景图需求
- 发布检查清单

### 4. 阿里产品标题 / 关键词 / 属性评分

绑定 Agents：

- `Alibaba Listing Optimization`
- `SEO Specialist`
- `Search Query Analyst`

作用：

- 专门检查国际站字段质量
- 不做泛 SEO

输出：

- 标题评分
- 关键词覆盖度
- 属性完整度
- 堆词风险
- 买家搜索匹配度
- 修改建议

### 5. RFQ / 询盘采购意图解析

绑定 Agents：

- `Sales Outreach`
- `Discovery Coach`
- `Sales Engineer`
- `Deal Strategist`

作用：

- 判断买家是不是值得跟
- 判断当前能否报价
- 生成追问问题和回复要点

输出：

- 买家阶段
- 采购意图
- 需求字段
- 缺失信息
- 风险点
- 追问问题
- 回复要点
- 线索等级

### 6. 报价包字段生成

绑定 Agents：

- `Proposal Strategist`
- `Sales Engineer`
- `Pricing Analyst`
- `Deal Strategist`

作用：

- 把询盘需求整理成报价材料
- 不重复官方 DOCX / PDF 能力，只负责业务字段和报价逻辑

输出：

- 报价字段
- 阶梯价结构
- MOQ
- 包装
- 交期
- 付款方式
- 报价有效期
- 样品政策
- PI 草稿字段
- 报价邮件要点
- 报价风险提示

### 7. 外贸询盘质量搜索词清洗

绑定 Agents：

- `Search Query Analyst`
- `PPC Campaign Strategist`
- `Paid Media Auditor`

作用：

- 不做通用 Google Ads 优化
- 专门判断哪些搜索词带来真实 B2B 买家
- 把广告优化从看点击转为看询盘质量

输出：

- B2B 高意图词
- 低质词
- 否定词候选
- 扩词建议
- 广告组迁移建议
- 浪费预算列表
- 可沉淀到产品页 / 国际站标题的关键词

### 8. 老板版经营结论压缩

绑定 Agents：

- `Account Strategist`
- `Analytics Reporter`
- `Executive Summary Generator`
- `Business Strategist`

作用：

- 把复杂运营过程压缩成老板能决策的话
- 适合工厂老板、外贸负责人、服务商客户汇报

输出：

- 本月结果
- 正反馈
- 主要问题
- 产品机会
- 预算浪费
- 下月动作
- 需要老板拍板的事项

## 第二批 P1 明细

### 9. 独立站资料 -> 国际站知识库迁移

绑定 Agents：

- `Knowledge Base Steward`
- `Product Operations Companion`
- `Alibaba Listing Optimization`

作用：

- 把已有独立站资产迁移成 AWB / 国际站可用知识库
- 支撑“独立站沉淀知识库，AWB 复用知识库，国际站获取增量”的主线

输出：

- 页面资产清单
- 产品资料包
- 字段映射表
- 缺口清单
- 迁移优先级

### 10. 阿里竞品产品页字段拆解

绑定 Agents：

- `Alibaba Listing Optimization`
- `Cross-Border E-Commerce Specialist`
- `SEO Specialist`

作用：

- 不做泛竞品分析
- 只拆国际站产品页字段和成交资产

输出：

- 竞品标题结构
- 关键词
- 属性
- MOQ
- 主图策略
- 详情页模块
- 信任背书
- 可借鉴点

### 11. 国际站经营月报结构化

绑定 Agents：

- `Analytics Reporter`
- `Account Strategist`
- `Executive Summary Generator`

作用：

- 把国际站运营数据整理成月报骨架
- 后续可交给文档 / 表格 / PPT 官方能力生成正式交付件

输出：

- 产品表现
- 曝光
- 点击
- 询盘
- RFQ
- P4P
- 发布动作
- 问题诊断
- 下月动作

### 12. 7/14/30 国际站快启动复盘

绑定 Agents：

- `Business Strategist`
- `Account Strategist`
- `Project Shepherd`
- `Executive Summary Generator`

作用：

- 固化快启动方法论
- 用于国际站启动项目、客户复盘、老板汇报、案例沉淀

输出：

- 7 天资料整理复盘
- 14 天发布 / 测试复盘
- 30 天反馈验证复盘
- 下一轮动作清单

## 第三批 P2 Pro 明细

### 1. B2B 外贸英文文案 Pro

对标官方能力：

- `copywriting`
- `product-description-generator`
- `product-marketing-brief`

Pro 差异：

- 不做普通营销文案
- 专做外贸 B2B 买家可信表达
- 检查夸大表达、术语一致性、采购商关心点
- 可直接用于国际站详情页、独立站产品页、开发信、FAQ、报价邮件

### 2. B2B SEO / GEO Pro

对标官方能力：

- `seo-page-audit`
- `seo-keyword-research`
- `ecommerce-seo-optimizer`
- `programmatic-seo-strategist`

Pro 差异：

- 聚焦外贸独立站
- 同时考虑 Google SEO 和 AI 引用 / GEO
- 关注产品词、应用场景词、采购意图词、批发/供应商/工厂词

### 3. 外贸广告分析 Pro

对标官方能力：

- 通用 PPC / Paid Media 能力
- 通用广告策略能力

Pro 差异：

- 聚焦 B2B 询盘质量
- 同时看 Google Ads / P4P / 独立站询盘
- 判断词是不是采购词、询盘是否真实、是否适合继续花钱

### 4. 外贸产品图素材 Pro

对标官方能力：

- `image-prompt-guide`
- `ai-product-designer`
- `higgsfield-guide`
- `inwind-image-create`
- `inwind-image-edit`

Pro 差异：

- 不只是生图 prompt
- 输出完整产品图素材包：白底主图、尺寸图、应用场景图、包装图、工厂实力图、详情页卖点图

### 5. 外贸报告 Pro

对标官方能力：

- `docx`
- `xlsx`
- `pptx`
- `internal-comms`
- `doc-coauthoring`

Pro 差异：

- 不只是生成文档
- 专门输出外贸老板 / 客户能看懂的报告
- 支持国际站月报、独立站月报、Google Ads 月报、询盘转化复盘、产品机会报告

### 6. 外贸竞品研究 Pro

对标官方能力：

- `competitor-deep-analysis`
- `competitive-landscape`
- `seo-competitor-analysis`
- `company-research`

Pro 差异：

- 聚焦外贸成交资产
- 拆国际站 Listing、独立站产品页、MOQ、包装、认证、应用场景、图片结构、询盘入口、信任背书

### 7. 外贸表格数据 Pro

对标官方能力：

- `xlsx`
- `spreadsheets`
- `ecommerce-sales-dashboard`
- `marketing-roas-analyzer`

Pro 差异：

- 专门处理外贸运营表：产品发布表、询盘表、报价表、样品表、成交表、广告搜索词表、月度复盘表

### 8. 外贸图片翻译 / 本地化 Pro

对标官方能力：

- `image-prompt-guide`
- `inwind-image-translate`

Pro 差异：

- 不只是翻译图片上的文字
- 专门适配国际站详情页卖点图、独立站 Banner、产品包装图、社媒广告图、展会海报

## Agent 配套安装建议

### Product Operations Companion

内置：

- `外贸产品资料知识库标准化`
- `产品资料缺口诊断`
- `独立站资料 -> 国际站知识库迁移`

定位：

```text
把散乱产品资料变成可复用的外贸知识库。
```

### Knowledge Base Steward

内置：

- `外贸产品资料知识库标准化`
- `产品资料缺口诊断`
- `独立站资料 -> 国际站知识库迁移`

定位：

```text
管理 AWB / 国际站可复用知识资产。
```

### Alibaba Listing Optimization

内置：

- `外贸产品资料知识库标准化`
- `产品资料缺口诊断`
- `阿里国际站产品发布包生成`
- `阿里产品标题 / 关键词 / 属性评分`
- `阿里竞品产品页字段拆解`

定位：

```text
把产品资料变成能发布、能被搜到、能让买家愿意询盘的国际站 Listing。
```

### Sales Outreach / Discovery Coach

内置：

- `RFQ / 询盘采购意图解析`

定位：

```text
把模糊询盘变成可跟进的销售线索。
```

### Proposal Strategist / Sales Engineer

内置：

- `RFQ / 询盘采购意图解析`
- `报价包字段生成`

定位：

```text
把询盘需求转成专业报价和成交推进材料。
```

### Search Query Analyst / PPC Campaign Strategist

内置：

- `外贸询盘质量搜索词清洗`

定位：

```text
从广告搜索词里找真实 B2B 买家意图。
```

### Account Strategist / Analytics Reporter

内置：

- `国际站经营月报结构化`
- `老板版经营结论压缩`
- `7/14/30 国际站快启动复盘`

定位：

```text
把运营过程变成老板能看懂、能决策的复盘。
```

### Executive Summary Generator

内置：

- `老板版经营结论压缩`
- `国际站经营月报结构化`
- `7/14/30 国际站快启动复盘`

定位：

```text
把复杂执行记录压成高层结论。
```

## 展示策略

用户侧不建议看到一堆 Skills 平铺。更好的展示方式是：

```text
外贸产品运营 Agent
├── 整理产品知识库
├── 检查资料缺口
└── 迁移独立站资料

阿里国际站产品发布 Agent
├── 生成发布包
├── 检查标题关键词属性
└── 拆解竞品产品页

询盘 / RFQ 跟进 Agent
├── 判断采购意图
├── 生成追问问题
└── 输出回复要点

报价 / PI Agent
├── 生成报价字段
├── 检查报价风险
└── 生成 PI 草稿字段

广告搜索词 Agent
├── 清洗低质搜索词
├── 识别 B2B 买家意图
└── 生成否定词候选

老板汇报 Agent
├── 结构化月报
├── 压缩老板结论
└── 生成下月动作清单
```

最终产品感应是：

```text
用户找 Agent 做事。
Agent 内置 Skills 把关键动作做稳。
官方 Skills 负责通用底座。
补充 Skills 负责外贸 B2B / 国际站业务闭环。
Pro Skills 负责让用户感知更强、更专业、更能交付。
```

## 当前阶段结论

第一阶段不是做一个大而全的 Skills 市场，而是：

```text
用 8-12 个业务补充 Skills
嵌入 6-8 类核心 Agents
覆盖产品资料 -> 国际站发布 -> 询盘 -> 报价 -> 广告分析 -> 老板复盘
```

后续顺序：

1. 先落 P0 的 8 个 Agent 内置基础补位 Skills。
2. 再落 P1 的 4 个业务链路扩展 Skills。
3. 最后做 P2 官方能力 Pro 化，形成“官方基础版 + 外贸增强版”的用户感知。
