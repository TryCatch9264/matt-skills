# Matt Pocock Skills

一组由 Claude Code 加载的 agent 技能（斜杠命令和行为）。技能被组织进若干分组目录，并由 `/setup-matt-pocock-skills` 为每个仓库生成的配置来使用。

## 用词

**议题跟踪器（Issue tracker）**：
托管仓库议题的工具：GitHub Issues、Linear、本地 `.scratch/` 下的 Markdown 约定，或其他类似工具。`to-tickets`、`to-spec`、`triage` 这类技能会读写它。
_避免使用_：backlog manager、backlog backend、issue host

**议题（Issue）**：
**议题跟踪器**中一个被跟踪的工作单位：一个缺陷、任务、规格说明，或 `to-tickets` 拆分出来的一个切片。
_避免使用_：ticket（只在引用把这些称为 tickets 的外部系统时使用，或者指下面的**决策工单**）

**决策工单（Decision ticket）**：
`wayfinder` 中的一个单位：`wayfinder:map` 下的子**议题**，承载一个*问题*，其答案是决策，而不是要执行的一段构建。**决策**这个限定词让它与实现类工单区分开；`wayfinder` 先引入这个术语，之后就只用“工单”。

**分诊角色（Triage role）**：
分诊过程中加到**议题**上的规范状态机标签（例如 `needs-triage`、`ready-for-afk`）。每个角色通过 `docs/agents/triage-labels.md` 映射到**议题跟踪器**中真实存在的标签字符串。

## 关系

- 一个**议题跟踪器**承载许多**议题**
- 一个**议题**在同一时间只带一个**分诊角色**
- 一个**决策工单**是一个**议题**（`wayfinder:map` 的子议题）

## 已澄清的歧义

- “backlog”过去既指托管议题的*工具*，也指其中的*工作内容*。已解决：工具指**议题跟踪器**；“backlog”不再作为领域术语使用。
- “backlog backend” / “backlog manager”。已解决：合并进**议题跟踪器**。
