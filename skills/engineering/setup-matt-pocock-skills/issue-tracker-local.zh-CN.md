# 议题跟踪器：本地 Markdown

本仓库的议题和规格说明以 Markdown 文件的形式存放在 `.scratch/` 下。

## 约定

- 一个功能一个目录：`.scratch/<feature-slug>/`
- 规格说明是 `.scratch/<feature-slug>/spec.md`
- 实现类议题一张工单一个文件，放在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 开始编号，绝不把所有工单合写进一个文件
- 分诊状态记录在每个议题文件靠上位置的 `Status:` 行（角色字符串见 `triage-labels.md`）
- 评论和对话历史追加到文件末尾的 `## Comments` 标题下

## 当某个技能说“发布到议题跟踪器”

在 `.scratch/<feature-slug>/` 下新建一个文件（目录不存在就先创建）。

## 当某个技能说“取回相关工单”

读取被引用路径上的文件。用户通常会直接给出路径或议题编号。

## Wayfinding 操作

由 `/wayfinder` 使用。**地图（map）**是一个文件，每张工单对应一个**子（child）**文件。

- **地图**：`.scratch/<effort>/map.md`（Notes / Decisions-so-far / Fog 正文）。
- **子工单**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，正文里写问题。`Type:` 行记录工单类型（`research`/`prototype`/`grilling`/`task`），`Status:` 行记录 `claimed`/`resolved`。
- **阻塞**：靠上位置有一行 `Blocked by: NN, NN`。当它列出的每个文件都是 `resolved` 时，这张工单才算解除阻塞。
- **前沿（frontier）**：扫描 `.scratch/<effort>/issues/`，找出处于打开状态、未阻塞、未被认领的文件；编号最小的胜出。
- **认领**：把 `Status:` 设为 `claimed` 并保存，然后再开始任何工作。
- **解决**：在 `## Answer` 标题下追加答案，把 `Status:` 设为 `resolved`，然后往 `map.md` 中地图的 Decisions-so-far 里追加一条上下文指针（要点加链接）。
