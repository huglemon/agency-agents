---
name: rfq-inquiry-intent-parser
description: 解析 RFQ 和外贸询盘采购意图。Use when an Agent receives RFQ text, inquiry email, WhatsApp chat, buyer message, or customer requirement and needs to classify buying stage, missing requirements, risk signals, follow-up questions, reply points, and lead quality.
---

# RFQ / 询盘采购意图解析

## 目标

把模糊询盘变成可跟进、可报价、可判断优先级的销售线索。

## 输入

- RFQ 原文
- 邮件、WhatsApp、站内信
- 买家国家、公司、产品需求
- 产品知识库或报价规则

## 输出

- 买家阶段：泛询价、明确采购、样品测试、复购、项目采购
- 需求字段：产品、规格、数量、用途、目标市场、交期、包装、认证
- 缺失信息：报价前必须追问的内容
- 风险信号：低价钓鱼、需求不清、付款风险、规格冲突
- 线索等级：A/B/C 和原因
- 追问问题：按最少问题原则给 3-5 个
- 回复要点：确认需求、展示能力、推进下一步

## 质量要求

- 不要默认每条询盘都值得报价。
- 能报价就给报价准备项，不能报价就给追问路径。
- 输出适合销售同事直接执行。
