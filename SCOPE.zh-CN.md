# 范围

这个仓库是我每天使用的技能集合。它是经过筛选的：欢迎提出想法，每个想法都要按下面的门槛来评判。议题（issue）用于跟踪技能本身的变更。提问和讨论请到 [GitHub Discussions](https://github.com/mattpocock/skills/discussions)。

## 门槛

一个想法或反馈议题只有在**两部分**都通过时才会保持开启：

1. **有观察到的失败。** 它描述的是某次真实会话中出问题的地方：你运行了什么、技能做了什么、你期望什么。假设性的改进（“如果能……会更好”）通不过这一部分。
2. **符合理念。** 它与 [`.out-of-scope/`](./.out-of-scope/) 中的任何一条都不重合，也不属于过去被拒绝的提议，并且它不是配置选项、不是为某个特定 harness 加的分支、也不是为了迁就某个人工作流的调整。这类需求应该写进你自己的 `CLAUDE.md` / `AGENTS.md`，或者放在你自己的分支（fork）里（skills.sh 会给你一份可编辑的副本）。

规模无关紧要：改一个词和重写一遍面对的是同一个门槛。表情回应和 +1 评论不算数。

## 按分组目录区分

- **`engineering/`、`productivity/`、`in-progress/`**：适用上面的门槛。
- **`misc/`**：已冻结，不再维护。所有议题都会关闭。见 [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)。
- **新技能**：提案和贡献一律不接受。如果某个行为可以由现有技能组合出来，就不会为它新增技能。见 [`new-skills.md`](./.out-of-scope/new-skills.md)。

## 已有结论

[`.out-of-scope/`](./.out-of-scope/) 中的每个文件记录了一个被否决的想法以及原因。提交议题前请先读一遍：

- [`frozen-misc-skills.md`](./.out-of-scope/frozen-misc-skills.md)
- [`harness-name-collisions.md`](./.out-of-scope/harness-name-collisions.md)
- [`mainstream-issue-trackers-only.md`](./.out-of-scope/mainstream-issue-trackers-only.md)
- [`native-question-tool.md`](./.out-of-scope/native-question-tool.md)
- [`new-skills.md`](./.out-of-scope/new-skills.md)
- [`question-limits.md`](./.out-of-scope/question-limits.md)
- [`setup-skill-verify-mode.md`](./.out-of-scope/setup-skill-verify-mode.md)
- [`subagent-recursion.md`](./.out-of-scope/subagent-recursion.md)

## 无法判断的议题

无法按门槛判断的议题会得到一轮提问和 `needs-info` 标签。如果报告者 14 天内没有回复，议题就会被关闭。被否决的议题以“not planned”状态关闭。
