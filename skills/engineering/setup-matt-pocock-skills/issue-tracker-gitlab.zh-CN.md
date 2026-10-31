# 议题跟踪器：GitLab

这个仓库的议题和规格说明都以 GitLab issue 的形式存在。所有操作都使用 [`glab`](https://gitlab.com/gitlab-org/cli) 命令行工具。

## 约定

- **创建议题**：`glab issue create --title "..." --description "..."`。多行描述用 heredoc。传 `--description -` 打开编辑器。
- **读取议题**：`glab issue view <number> --comments`。要机器可读的输出就加 `-F json`。
- **列出议题**：`glab issue list -O json`，配合相应的 `--label` 过滤。
- **在议题下评论**：`glab issue note <number> --message "..."`。GitLab 把评论叫作 note（“备注”）。
- **添加／移除标签**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个标签可以用逗号分隔，也可以重复该选项。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭时附带评论，所以先用 `glab issue note <number> --message "..."` 发布说明，再关闭。
- **合并请求**：GitLab 把 PR 叫作 merge request（合并请求）。用 `glab mr create`、`glab mr view`、`glab mr note` 等，形式与 `gh pr ...` 相同，只是用 `mr` 代替 `pr`，用 `note`／`--message` 代替 `comment`／`--body`。

仓库信息从 `git remote -v` 推断；在克隆目录里运行时，`glab` 会自动做这件事。

## 把合并请求作为分诊面

**把 MR 作为需求入口：否。** _（如果这个仓库把外部合并请求视作功能需求，就改成 `yes`；`/triage` 会读取这个开关。）_

设为 `yes` 时，MR 走和议题相同的标签与状态，用 `glab mr` 的对应命令：

- **读取 MR**：`glab mr view <number> --comments`，看差异用 `glab mr diff <number>`。
- **列出待分诊的外部 MR**：`glab mr list -O json`，然后只保留作者不是项目成员／所有者的 MR（也就是贡献者提交的 MR，而不是维护者正在进行的工作）。
- **评论／打标签／关闭**：`glab mr note`、`glab mr update --label`／`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 的议题和 MR 分开编号，所以只要知道维护者指的是哪个界面，`#42` 就不歧义。

## 当技能说“发布到议题跟踪器”

创建一条 GitLab issue。

## 当技能说“取回相关工单”

运行 `glab issue view <number> --comments`。

## 寻路操作

供 `/wayfinder` 使用。**地图**是一条议题，**子**议题是工单。

- **地图**：一条带 `wayfinder:map` 标签的议题，正文承载“笔记／目前的决定／迷雾”三部分。`glab issue create --label wayfinder:map`。（在带原生 epic 的 GitLab 套餐上，也可以用一个 epic 承载地图；带标签的议题在所有套餐上都能用。）
- **子工单**：描述顶部带 `Part of #<map>` 的议题，链接到地图（`glab issue create --linked-issues <map> --link-type relates_to`），并带上 `wayfinder:<type>` 标签（`research`／`prototype`／`grilling`／`task`）。一旦被领取，工单就指派给负责推进的开发者。
- **阻塞**：GitLab 的**原生阻塞链接**，这是标准做法，界面上可见。用 `/blocked_by #<n>` 快捷操作添加，以备注形式发布（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 功能；在免费套餐上（或该功能不可用时）改用描述顶部的 `Blocked by: #<n>, #<n>` 一行。当所有阻塞项都已关闭时，工单即解除阻塞。
- **前沿查询**：用 `glab api projects/:id/issues/<map>/links` 列出地图的子议题，保留带 `wayfinder:<type>` 标签且仍打开的议题，去掉任何存在未解决阻塞项的：指向未关闭议题的原生 `blocked_by` 链接（`glab api projects/:id/issues/<child-iid>/links`）、`Blocked by` 一行里提到未关闭议题，或者已有指派人；按地图顺序取第一个。
- **领取**：`glab issue update <n> --assignee @me`，这是本会话的第一次写操作。
- **解决**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，再往地图的“目前的决定”里追加一个上下文指针（要点摘要加链接）。
