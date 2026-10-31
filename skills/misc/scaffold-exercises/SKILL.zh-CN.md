---
name: scaffold-exercises
description: 创建能通过 lint 的练习目录结构，包含小节、题目、答案和讲解。适用于用户想搭建练习骨架、创建练习存根，或建立新的课程小节。
---

# 搭建练习骨架

创建能通过 `pnpm ai-hero-cli internal lint` 的练习目录结构，然后用 `git commit` 提交。

## 目录命名

- **小节**：`exercises/` 下的 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **练习**：小节内的 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- 小节编号 = `XX`，练习编号 = `XX.YY`
- 名称用连字符小写形式（全小写，连字符分隔）

## 练习的组成形式

每个练习至少要有下列子目录之一：

- `problem/` - 学生工作区，含 TODO
- `solution/` - 参考答案实现
- `explainer/` - 概念材料，无 TODO

搭骨架时，除非计划里另有说明，默认用 `explainer/`。

## 必需文件

每个子目录（`problem/`、`solution/`、`explainer/`）都需要一个 `readme.md`，它要：

- **不为空**（必须有真实内容，哪怕只有一行标题也算）
- 没有失效链接

搭骨架时，创建一个带标题和描述的极简 readme：

```md
# Exercise Title

Description here
```

如果子目录里有代码，还需要一个 `main.ts`（超过一行）。但搭骨架时，只有 readme 的练习也可以。

## 工作流程

1. **解析计划** - 提取小节名称、练习名称和组成类型
2. **创建目录** - 对每个路径执行 `mkdir -p`
3. **创建 readme 存根** - 每个组成目录一个带标题的 `readme.md`
4. **运行 lint** - 用 `pnpm ai-hero-cli internal lint` 校验
5. **修掉错误** - 反复调整直到 lint 通过

## lint 规则概要

linter（`pnpm ai-hero-cli internal lint`）检查：

- 每个练习都有子目录（`problem/`、`solution/`、`explainer/`）
- `problem/`、`explainer/`、`explainer.1/` 中至少有一个存在
- 主目录里有 `readme.md` 且不为空
- 没有 `.gitkeep` 文件
- 没有 `speaker-notes.md` 文件
- readme 里没有失效链接
- readme 里没有 `pnpm run exercise` 命令
- 每个子目录都需要 `main.ts`，除非只有 readme

## 移动／重命名练习

重新编号或移动练习时：

1. 用 `git mv`（而不是 `mv`）重命名目录 - 这样能保留 git 历史
2. 更新编号前缀，保持顺序
3. 移动后重新运行 lint

示例：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 示例：按计划搭骨架

给定这样的计划：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme 存根：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
