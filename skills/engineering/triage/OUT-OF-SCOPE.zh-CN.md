# 不在范围内的知识库

仓库里的 `.out-of-scope/` 目录存放被否掉的功能需求，作为长期记录。它有两个用途：

1. **组织记忆**：某个功能为什么被否掉，这样议题关闭后理由不会丢
2. **去重**：新来的议题和之前的否决项相符时，技能可以拿出先前的决定，而不是重新争一遍

## 目录结构

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

一个**概念**一个文件，而不是一个议题一个文件。要求同一件事的多个议题归到同一个文件下。

## 文件格式

文件应当写得从容、易读，更像一份简短的设计文档，而不是数据库里的记录。用段落、代码示例和例子把理由讲清楚，让第一次接触的人看得懂、用得上。

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42: "Add dark mode support"
- #87: "Night theme for accessibility"
- #134: "Dark theme option"
```

### 给文件命名

用简短、能说明问题的连字符小写名称来指代概念：`dark-mode.md`、`plugin-system.md`、`graphql-api.md`。名字要够清楚，让人浏览目录时不用打开文件就知道被否掉的是什么。

### 写理由

理由要有实质内容：不是“我们不要这个”，而是为什么不要。好的理由会引用：

- 项目范围或理念（“这个项目专注于 X；主题化是下游的事”）
- 技术约束（“支持它需要 Y，这和我们的 Z 架构冲突”）
- 战略决定（“我们选择用 A 而不用 B，因为……”）

理由应当能长期成立。避免引用临时情况（“我们现在太忙”）；那不是真正的否决，只是推迟。

## 什么时候查 `.out-of-scope/`

分诊期间（第 1 步：收集上下文），读一遍 `.out-of-scope/` 里的所有文件。评估新议题时：

- 看这个需求是否与某个已有的不在范围概念相符
- 判断依据是概念相似，不是关键词：“night theme” 与 `dark-mode.md` 相符
- 如果相符，就摆给维护者看：“这和 `.out-of-scope/dark-mode.md` 相似。我们之前否掉它是因为[理由]。你现在还是这么看吗？”

维护者可能：

- **确认**：新议题被加进已有文件的“先前需求”列表，然后关闭
- **重新考虑**：删掉或更新那个不在范围文件，议题按正常分诊继续走
- **不同意**：这些议题相关但不同，按正常分诊继续走

## 什么时候写 `.out-of-scope/`

只有当某个**功能增强**（不是缺陷）被以 `wontfix` *否掉*时。这条对功能增强类 PR 同样适用：被否掉的 PR 也记在这里，免得同一个需求又作为新代码回来。

如果某件事被以 `wontfix` 关闭是因为**已经实现了**，就**不要**写到这里。那是已经建好的功能，不是被否掉的；记下来会让去重检查被误判的否决污染。这时应在关闭评论里指出该功能已经在哪里。

流程：

1. 维护者判定某个功能需求不在范围内
2. 检查是否已有相符的 `.out-of-scope/` 文件
3. 有：把新议题追加到“先前需求”列表
4. 没有：新建文件，写概念名、决定、理由和第一条先前需求
5. 在议题下评论，说明这个决定并提到那个 `.out-of-scope/` 文件
6. 用 `wontfix` 标签关闭议题

## 更新或删除不在范围文件

如果维护者改变了对先前被否掉概念的看法：

- 删掉那个 `.out-of-scope/` 文件
- 技能不需要重开旧议题；它们是历史记录
- 触发这次重新考虑的新议题按正常分诊继续走
