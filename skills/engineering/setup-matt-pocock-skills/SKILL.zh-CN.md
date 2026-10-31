---
name: setup-matt-pocock-skills
description: "把这些工程技能配置到这个仓库：设置议题跟踪器、分诊标签词表和领域文档布局。首次使用其他工程技能之前运行一次。"
disable-model-invocation: true
---

# 配置 Matt Pocock 的技能

搭好工程技能所假定的按仓库配置：

- **议题跟踪器**：议题放在哪里（默认 GitHub；本地 Markdown 也开箱支持）
- **分诊标签**：五个标准分诊角色所用的字符串
- **领域文档**：`GLOSSARY.md` 和 ADR 放在哪里，以及使用方读取它们的规则

这是由提示驱动的技能，不是确定性脚本。先探索，把发现呈现出来，与用户确认，然后再写。

## 流程

### 1. 探索

看当前仓库，了解它的初始状态。有什么就读什么，不要假设：

- `git remote -v` 和 `.git/config`：这是 GitHub 仓库吗？是哪一个？
- 仓库根目录的 `AGENTS.md` 和 `CLAUDE.md`：哪一个存在？两者中是否已有 `## Agent skills` 小节？
- 仓库根目录的 `GLOSSARY.md` 和 `GLOSSARY-MAP.md`，以及旧的 `CONTEXT.md` / `CONTEXT-MAP.md`。如果存在旧文件，提议用 `git mv` 改成 `GLOSSARY` 的名字，并把 `docs/agents/domain.md` 里的那些名字一并改掉。
- `docs/adr/` 以及任何 `src/*/docs/adr/` 目录
- `docs/agents/`：本技能之前的产物是否已经存在？
- `.scratch/`：说明本地 Markdown 议题跟踪器的约定已经在用
- `triage` 技能装了吗？（本技能旁边有 `triage` 技能目录，或者你的可用技能里有 `triage`。）这决定 B 部分是否运行。
- 单体仓库信号：`pnpm-workspace.yaml`、`package.json` 里的 `workspaces` 字段，或者 `packages/*` 下有自己 `src/` 的实际内容。这些只出现在真正大型的多包仓库里；没有就说明是单上下文，几乎每个仓库都是这样。

### 2. 呈现发现并提问

总结哪些已有、哪些缺少。然后按顺序处理各节。一节，一个答复，再下一节。

每节把推荐答案放最前，让用户一个词就能接受。只有当选择真的分岔时才给一行解释；如果探索已经把答案定下来，就整节跳过（没装 `triage` 时跳过 B 部分，没有单体仓库时跳过 C 部分）。

**A 部分：议题跟踪器。**

> 解释：这里的“议题跟踪器”是这个仓库的议题放在哪。`to-tickets`、`triage`、`to-spec` 等技能从它读、往它写。它们需要知道该调 `gh issue create`、在 `.scratch/` 下写 Markdown 文件，还是遵循你描述的别的工作流。选这个仓库实际跟踪工作的那个地方。

默认立场：这些技能是为 GitHub 设计的。如果某个 `git remote` 指向 GitHub，就提议它。如果 `git remote` 指向 GitLab（`gitlab.com` 或自建实例），就提议 GitLab。否则（或用户另有偏好），提供：

- **GitHub**：议题放在仓库的 GitHub Issues（使用 `gh` 命令行工具）
- **GitLab**：议题放在仓库的 GitLab Issues（使用 [`glab`](https://gitlab.com/gitlab-org/cli) 命令行工具）
- **本地 Markdown**：议题作为文件放在本仓库的 `.scratch/<feature>/` 下（适合单人项目或没有远程的仓库）
- **其他**（Jira、Linear 等）：请用户用一段话描述工作流；技能会把它记成自由文本

把选择记到 `docs/agents/issue-tracker.md`。GitHub 和 GitLab 模板带一个“把 PR 作为需求入口”的开关，默认**关闭**。保持关闭，也不要主动提起：想让外部 PR 进入分诊队列的用户，之后可以在文件里自己改。

GitHub 或 GitLab 跟踪器需要一个可达的仓库。用户选了其中之一、却没有 `git remote` 指向那个主机时，向他们要仓库 URL 并接上（需要的话 `git init`，然后 `git remote add origin <url>`），再往下走。完成标准是 `gh repo view` / `glab repo view` 在这个目录里能打印出该项目；如果做不到，就停下来告诉用户缺什么。

**B 部分：分诊标签词表。** 如果 `triage` 技能没装（探索时已经知道），就整节跳过，因为没装的技能不需要标签。

如果装了，只问一个问题：

> 要保留默认的分诊标签吗？（推荐：**是**）

默认就是五个标准角色，每个标签字符串等于角色名：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。答**是**，就照原样写。只有用户说不要（通常是因为他们的跟踪器已经用了别的名字，例如用 `bug:triage` 表示 `needs-triage`）时，才收集这些替换，好让 `triage` 应用已有标签，而不是创建重复的。

**C 部分：领域文档。** 默认**单上下文**（仓库根目录一个 `GLOSSARY.md` + `docs/adr/`）。这适合几乎每个仓库；直接写，不用问。

只有当探索发现单体仓库信号时，才提供**多上下文**（根目录一个 `GLOSSARY-MAP.md`，指向各上下文的 `GLOSSARY.md`）。然后确认他们要哪种布局。

### 3. 确认并修改

给用户看一份草稿：

- 要加到 `CLAUDE.md` / `AGENTS.md`（按第 4 步的选择规则决定改哪个）里的 `## Agent skills` 块
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md`、`docs/agents/triage-labels.md` 的内容（最后一个仅在装了 `triage` 时）

写下去之前让他们改。

### 4. 写入

**挑选要改的文件：**

- 如果 `CLAUDE.md` 存在，改它。
- 否则如果 `AGENTS.md` 存在，改它。
- 两个都不存在，问用户要创建哪一个；不要替他们决定。

`CLAUDE.md` 已存在时绝不要新建 `AGENTS.md`（反之亦然）；总是改已经存在的那个。

如果所选文件里已有 `## Agent skills` 块，就在原地更新内容，而不是再追加一份重复的。不要覆盖用户对周围小节的修改。

块内容：

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

只有在装了 `triage` 且 B 部分运行过时，才包含 `### Triage labels` 子块并写 `docs/agents/triage-labels.md`。没装时两者都省略。

B 部分在 GitHub 或 GitLab 上运行过时，为跟踪器缺少的每个已配置标签建上（`gh label create` / `glab label create`）。

然后以本技能目录里的种子模板为起点写文档文件：

- [issue-tracker-github.md](./issue-tracker-github.zh-CN.md)：GitHub 议题跟踪器
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.zh-CN.md)：GitLab 议题跟踪器
- [issue-tracker-local.md](./issue-tracker-local.zh-CN.md)：本地 Markdown 议题跟踪器
- [triage-labels.md](./triage-labels.zh-CN.md)：标签映射（仅在装了 `triage` 时）
- [domain.md](./domain.zh-CN.md)：领域文档的使用规则 + 布局

对“其他”议题跟踪器，按用户的描述从头写 `docs/agents/issue-tracker.md`。

### 5. 完成

告诉用户配置完成，以及哪些工程技能从现在起会读这些文件。提一下他们以后可以直接改 `docs/agents/*.md`；只有想换议题跟踪器或从头重来时，才需要重跑本技能。
