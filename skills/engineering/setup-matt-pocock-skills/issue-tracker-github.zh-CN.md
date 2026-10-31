# 议题跟踪器：GitHub

这个仓库的议题和规格说明都以 GitHub issue 的形式存在。所有操作都使用 `gh` 命令行工具。

## 约定

- **创建议题**：`gh issue create --title "..." --body "..."`。多行正文用 heredoc。
- **读取议题**：`gh issue view <number> --json number,title,body,labels,comments`。
- **列出议题**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，配合相应的 `--label` 和 `--state` 过滤。
- **把议题设为某个父议题的子议题**：`gh issue create --parent <parent> ...`，或者事后 `gh issue edit <parent> --add-sub-issue <child>`（`gh` 2.94+）。旧版 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`（数据库 id，见下面 **阻塞** 一节）。不支持子议题时，在子议题正文顶部写 `Part of #<parent>`。
- **阻塞**：GitHub 的**原生议题依赖**，这是标准做法，界面上可见。用 `gh issue create --blocked-by <n>,<n> ...` 或 `gh issue edit <child> --add-blocked-by <blocker>` 添加（`gh` 2.94+）。旧版 `gh`：`gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`，其中 `<blocker-db-id>` 是阻塞项的**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，_不是_ `#number`，也不是 `node_id`）。依赖功能不可用时，改用子议题正文顶部的 `Blocked by: #<n>, #<n>` 一行。当所有阻塞项都已关闭时，工单即解除阻塞。
- **统计未关闭的阻塞项**：`gh api repos/<owner>/<repo>/issues/<n> --jq .issue_dependencies_summary.blocked_by`（只算未关闭的；0 表示可以开工）。`gh issue view <n> --json blockedBy` 也会列出已关闭的阻塞项，所以要过滤：`--jq '[.blockedBy.nodes[] | select(.state == "OPEN")] | length'`。
- **在议题下评论**：`gh issue comment <number> --body "..."`
- **添加／移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：先用 `gh issue comment <number> --body "..."` 发布说明，再 `gh issue close <number>`。对已经关闭的议题，`gh issue close --comment` 会丢掉评论，退出码却仍是 0。

仓库信息从 `git remote -v` 推断；在克隆目录里运行时，`gh` 会自动做这件事。

只往用户自己的仓库提交议题。除非用户拥有 `mattpocock/skills`（这些技能的来源仓库），否则绝不往那里提交。在 fork 里，`gh` 可能默认指向上游父仓库，所以会话里第一次 `gh issue create` 之前，先用 `gh repo view --json nameWithOwner` 检查目标，如果不是用户的仓库就和用户确认。

## 把拉取请求作为分诊面

**把 PR 作为需求入口：否。** _（如果这个仓库把外部 PR 视作功能需求，就改成 `yes`；`/triage` 会读取这个开关。）_

设为 `yes` 时，PR 走和议题相同的标签与状态，用 `gh pr` 的对应命令：

- **读取 PR**：`gh pr view <number>`，然后 `gh pr view <number> --comments`（非终端环境下 `--comments` 只打印评论，不打印正文），看差异用 `gh pr diff <number>`。
- **列出待分诊的外部 PR**：`gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`。
- **评论／打标签／关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的议题和 PR 共用一个编号空间，所以光写 `#42` 可能指两者之一：先用 `gh pr view 42` 试，不行再用 `gh issue view 42`。

## 当技能说“发布到议题跟踪器”

创建一条 GitHub issue。

## 当技能说“取回相关工单”

按上面 **读取议题** 的方式读。

## 寻路操作

供 `/wayfinder` 使用。**地图**是一条议题，**子**议题是工单。

- **地图**：一条带 `wayfinder:map` 标签的议题，正文承载“笔记／目前的决定／迷雾”三部分。`gh issue create --label wayfinder:map`。
- **子工单**：作为 GitHub 子议题链接到地图的议题（见 **把议题设为某个父议题的子议题**）。子议题功能没启用时，把子议题加进地图正文的任务列表，并在子议题正文顶部写 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。一旦被领取，工单就指派给负责推进的开发者。
- **阻塞**：见约定一节的 **阻塞**。
- **前沿查询**：列出地图下未关闭的子议题（`gh issue list --state open`，限定在地图的子议题／任务列表内），去掉任何有未关闭阻塞项的（见 **统计未关闭的阻塞项**，或者 `Blocked by` 一行里提到未关闭议题）或已有指派人的；按地图顺序取第一个。
- **领取**：`gh issue edit <n> --add-assignee @me`，这是本会话的第一次写操作。
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，再往地图的“目前的决定”里追加一个上下文指针（要点摘要加链接）。
