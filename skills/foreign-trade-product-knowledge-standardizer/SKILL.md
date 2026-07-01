---
name: foreign-trade-product-knowledge-standardizer
description: 将外贸产品资料标准化为 AWB / 阿里国际站 / 独立站可复用知识库字段。Use when an Agent receives product URLs, PDFs, Excel sheets, catalogs, images, old detail pages, or scattered descriptions and needs to extract verified B2B product facts, buying concerns, specs, MOQ, packaging, delivery, certifications, FAQ, keywords, and missing fields without inventing unsupported claims.
---

# 外贸产品资料知识库标准化

## 目标

把散乱资料整理成可被多个 Agent 复用的产品事实库。不要写成营销文案，不要补不存在的认证、参数、案例或测试数据。

## 输入

- 产品 URL、独立站页面、阿里/1688/Amazon 等参考链接
- PDF、Word、Excel、PPT、产品目录
- 产品图片、包装图、证书图、旧详情页
- 公司介绍、工厂能力、历史询盘或 FAQ

## 输出字段

- 基础：产品名、型号、类目、材质、尺寸、颜色、重量、规格范围
- 采购：MOQ、阶梯价线索、包装、交期、付款方式、样品政策
- 信任：认证、检测、工厂能力、质检流程、出口经验
- 应用：使用场景、目标买家、行业、国家/地区、痛点
- 内容：核心卖点、FAQ、关键词、禁用或待确认表达
- 证据：每个关键字段的来源、置信度、冲突说明

## 工作流

1. 先抽取硬事实，按“已确认 / 可合理推导 / 待确认 / 冲突”分层。
2. 把参数统一成表格，保留原始单位，不擅自换算关键数据。
3. 把买家关心点转为 B2B 采购语言，例如稳定供货、定制、包装、质检、交付。
4. 列出资料缺口，交给 `product-material-gap-diagnosis` 或对应 Agent 追问。
5. 输出可被国际站发布、询盘回复、报价、广告和月报复用的知识库。

## 质量要求

- 不确定信息必须标注 `待确认`。
- 不把竞品信息写成当前产品事实。
- 不用夸大词，例如 best、guaranteed、certified，除非资料明确支持。
- 中文交付，必要英文字段可双语保留。
