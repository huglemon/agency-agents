---
name: quotation-package-field-generator
description: 生成外贸报价包和 PI 草稿字段。Use when an Agent needs to turn inquiry/RFQ requirements into quotation fields, tiered price structure, MOQ, packaging, delivery time, payment terms, sample policy, PI draft fields, quotation email points, and risk notes without generating final legal documents.
---

# 报价包字段生成

## 目标

把询盘需求整理成报价材料。此 skill 不替代 DOCX/PDF/PI 生成工具，只负责业务字段、报价逻辑和风险提示。

## 输入

- 询盘解析结果
- 产品规格、MOQ、价格、成本或价格区间
- 包装、交期、付款方式、贸易条款、样品政策
- 客户国家、数量、用途和特殊要求

## 输出

- 报价字段表
- 阶梯价结构
- MOQ 与样品政策
- 包装和交期表达
- 付款方式与报价有效期
- PI 草稿字段
- 报价邮件要点
- 谈判锚点和可让步区间
- 风险提示

## 质量要求

- 没有价格时，不编具体金额；输出价格字段模板和需确认项。
- 法律合同条款只做业务建议，不给法律结论。
- 中文说明，邮件和 PI 字段可提供英文。
