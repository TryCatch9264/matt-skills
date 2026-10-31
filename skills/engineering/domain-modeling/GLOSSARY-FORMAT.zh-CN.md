# GLOSSARY.md 的格式

## 结构

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## 规则

- **要有取舍。** 同一个概念有多个说法时，选最好的那个，其余列在 `_Avoid_` 下。
- **定义要紧。** 最多一到两句话。定义它**是什么**，不是它做什么。
- **只收本项目上下文特有的术语。** 通用编程概念（超时、错误类型、工具函数模式）不属于这里，即使项目大量使用它们。加一个术语前先问：这是本上下文独有的概念，还是通用编程概念？只有前者该收。
- **自然出现聚类时，用子标题分组。** 如果所有术语都属于同一个连贯领域，平铺列表就可以。

## 单上下文与多上下文仓库

**单上下文（大多数仓库）：** 仓库根目录一份 `GLOSSARY.md`。

**多上下文：** 仓库根目录有一份 `GLOSSARY-MAP.md`，列出各个上下文、它们的位置，以及彼此的关系：

```md
# Glossary Map

## Contexts

- [Ordering](./src/ordering/GLOSSARY.md): receives and tracks customer orders
- [Billing](./src/billing/GLOSSARY.md): generates invoices and processes payments
- [Fulfillment](./src/fulfillment/GLOSSARY.md): manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

技能自行判断适用哪种结构：

- 如果存在 `GLOSSARY-MAP.md`，读它来找出各个上下文
- 如果只有根目录的 `GLOSSARY.md`，就是单上下文
- 如果两者都不存在，等第一个术语确定下来时再按需创建根目录的 `GLOSSARY.md`

存在多个上下文时，判断当前主题属于哪一个。判断不出来就问。
