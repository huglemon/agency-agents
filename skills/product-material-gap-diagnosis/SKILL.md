---
name: product-material-gap-diagnosis
description: 诊断外贸产品资料缺口。Use when an Agent needs to check whether product materials are sufficient for Alibaba listing, AWB knowledge base, independent-site product pages, RFQ replies, quotation, or B2B sales content, and must produce a prioritized missing-material checklist instead of hallucinating facts.
---

# 产品资料缺口诊断

## 目标

判断当前资料是否足够支撑国际站发布、独立站页面、询盘回复和报价。资料不足时，输出补充清单，不硬编。

## 检查维度

- 产品基础：型号、规格、材质、尺寸、重量、颜色、适配范围
- 交易条件：MOQ、价格区间、包装、交期、样品、付款方式
- 信任背书：认证、检测报告、工厂图、生产流程、质检流程、出口案例
- 视觉素材：白底图、尺寸图、细节图、场景图、包装图、工厂图
- 内容素材：FAQ、应用场景、买家痛点、竞品对比、售后说明
- 风险项：夸大声明、无依据认证、敏感用途、目标市场合规不明

## 输出格式

按优先级输出：

- `必须补`：没有就会影响发布、报价或合规判断
- `建议补`：能提高询盘转化或信任感
- `后续补`：适合做详情页、社媒、案例和月报增强

每条缺口都要包含：

- 缺什么
- 为什么重要
- 向客户怎么问
- 可接受的资料形式

## 质量要求

- 不要求用户一次补全所有资料，给最小可启动清单。
- 对不影响推进的缺口，允许继续工作但必须标注风险。
- 输出中文，适合直接发给客户或内部运营同事。
