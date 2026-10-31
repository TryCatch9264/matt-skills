# 领域文档

工程技能在探索代码库时，应该如何读取本仓库的领域文档。

## 探索之前，先读这些

- 仓库根目录的 **`GLOSSARY.md`**，或者
- 仓库根目录的 **`GLOSSARY-MAP.md`**（如果存在）：它指向每个上下文各一份 `GLOSSARY.md`。把与当前主题相关的都读一遍。
- **`docs/adr/`**：读涉及你即将改动的区域的 ADR。在多上下文的仓库里，还要看 `src/<context>/docs/adr/` 中限定在该上下文内的决策。

如果这些文件不存在，**直接继续**。不要指出它们缺失，也不要一上来就建议创建它们。`/domain-modeling` 技能（经由 `/grill-with-docs` 和 `/improve-codebase-architecture` 到达）会在术语或决策真正确定下来时按需创建。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `GLOSSARY-MAP.md`）：

```
/
├── GLOSSARY-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── GLOSSARY.md
        └── docs/adr/
```

## 使用术语表的词汇

当你的输出要给某个领域概念命名时（在议题标题、重构提案、假设、测试名称里），按 `GLOSSARY.md` 中的定义来用词。不要滑向术语表明确避免的同义词。

如果你需要的概念还不在术语表里，这是个信号：要么你在造项目里并不存在的说法（重新考虑），要么确实存在缺口（记下来，交给 `/domain-modeling`）。

## 指出 ADR 冲突

如果你的输出与某个现有 ADR 矛盾，明确说出来，而不是悄悄覆盖：

> _与 ADR-0007（事件溯源的订单）矛盾，但值得重新讨论，因为……_
