---
name: alibaba-listing-package-generator
description: 生成阿里国际站产品发布包。Use when an Agent needs to turn verified B2B product knowledge into Alibaba.com listing-ready fields: product title, keywords, attributes, selling points, detail-page structure, MOQ/packaging/delivery wording, image requirements, and publishing checklist.
---

# 阿里国际站产品发布包生成

## 目标

把产品知识库转为国际站可发布 Listing 包。重点是字段齐、表达稳、买家能看懂，不是泛营销文案。

## 输入

- 产品知识库或产品资料
- 目标市场、买家类型、主推关键词
- 竞品标题或竞品产品页
- 类目和平台字段要求

## 输出

- 产品标题：核心词 + 属性词 + 应用/卖点词，避免堆词
- 关键词组：主词、属性词、场景词、采购意图词
- 属性字段：材质、尺寸、规格、包装、型号、用途、认证等
- 卖点：B2B 买家关心的稳定供货、定制、质量、交付、包装
- 详情页结构：首屏、参数、卖点、应用、包装、工厂/质检、FAQ
- 图片需求：白底主图、尺寸图、细节图、场景图、包装图、工厂图
- 发布检查清单：缺口、风险、待确认项

## 质量要求

- 不复制竞品标题；只借鉴结构和词汇方向。
- 标题和卖点不得承诺无依据认证、销量或效果。
- 如果字段缺失，调用或提示使用 `product-material-gap-diagnosis`。
- 输出中文说明，发布字段可提供英文版本。
