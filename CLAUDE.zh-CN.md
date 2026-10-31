技能被组织进 `skills/` 下的分组目录：

- `engineering/`：日常写代码的工作
- `productivity/`：日常不写代码的流程工具
- `misc/`：留着但很少使用，未收录
- `in-progress/`：beta 阶段，故意公开，欢迎反馈，不随插件发布
- `deprecated/`：不再使用

`engineering/` 和 `productivity/` 中的每个技能（即**已收录**分组）都必须在顶层 `README.zh-CN.md` 里有一条引用，并在 `.claude-plugin/plugin.json` 的 `skills` 数组里有一条登记（Claude Code 插件发布的正好是已收录这一组）。`misc/`、`in-progress/`、`deprecated/` 中的技能不得出现在这两处的任何一处。

安装命令逐字复制自 [.agents/install-block.md](./.agents/install-block.md)。`.claude-plugin/marketplace.json` 是本仓库自己的市场（marketplace）。除 Claude Code 之外的每个 agent 都从它安装，以获得自动更新，Claude Code 则使用 `claude-plugins-official`。改动这两个清单文件后，运行 `claude plugin validate . --strict`。[ADR 0002](./.agents/adr/0002-ship-as-a-claude-code-plugin.md) 记录了这样做的原因。

顶层 `README.zh-CN.md` 中的每一条技能条目，都必须把技能名链接到它的 `SKILL.zh-CN.md`。

每个分组目录都有一个 `README.md`，列出该目录下的每个技能，并附一行说明，技能名链接到它的 `SKILL.md`。已收录分组目录的 `README.md` 和顶层 `README.md` 把条目分成**用户调用**和**模型调用**两类；未收录分组目录的 `README.md`（`misc/`、`in-progress/`）使用平铺列表。

`engineering/` 和 `productivity/` 中的技能还有一页面向用户的文档，位于 `docs/<bucket>/<skill-name>.md`（文档目录树镜像了 `skills/` 下这两个分组目录）。无论技能属于哪个分组，发布出来的 URL 都是 `https://aihero.dev/skills-<skill-name>`：文档路径只用于仓库内部组织。当你新增、重命名或改变 `engineering/`、`productivity/` 中某个技能的行为时，按 [.agents/writing-docs.md](./.agents/writing-docs.md) 的要求创建或同步它的文档页。一页完成的文档包含四节：**What it does**、**When to reach for it**、**Common questions**、**It's working if**。`writing-docs.md` 里有模板、章节顺序，以及去哪里找那些常见问题。未收录分组目录（`misc/`、`in-progress/`、`deprecated/`）中的技能**没有**文档页。唯一的例外是某个已收录技能被整体移除：它的文档页保留下来，并标记为已归档（见 `writing-docs.md`）。

每个 `SKILL.md` 要么是用户调用的（`disable-model-invocation: true`，并在 `agents/openai.yaml` 中设置 `policy.allow_implicit_invocation: false`，只有人才能用到），要么是模型调用的（模型或人都可以用到）。见 [.agents/invocation.md](./.agents/invocation.md)。

[`ask-matt`](./skills/engineering/ask-matt/SKILL.zh-CN.md) 是路由技能，它记录了每个用户可用的技能以及它们之间的关系。触发文档页同步的同一个条件也适用于它：每当你新增、重命名、移除某个用户可用的技能，或改变它在流程中的位置时，都要重读 `ask-matt` 的 `SKILL.zh-CN.md` 并更新它，让这张地图保持准确。一个它从未提到的新技能，或一个它仍在指向的陈旧技能，都是一张会说谎的路由表。

要把 `deprecated/` 和 `misc/` 之外的每个技能（重新）链接到本地 harness 的技能目录（`~/.claude/skills`、`~/.agents/skills`），请运行 `scripts/link-skills.sh`。每个条目都是指向本仓库的符号链接，所以 `git pull` 之后已安装的技能就是最新的；新增、移除或重命名技能后要重新运行这个脚本。

本仓库的文字（`SKILL.md` 文件、文档、`README.md`、`CHANGELOG.md`、ADR、changeset、代码注释）中不得出现破折号（em dash）。当一句话想用破折号时，改用逗号、冒号、句号、括号或连词，看句子实际需要哪一种；不要盲目替换字符。

每个派发子代理的技能都要说明：用全新的上下文窗口启动子代理。有些 harness（比如 Codex）默认会分叉父对话，而分叉会继承父对话的上下文，这正好否定了子代理启动独立上下文的意义。

## Agent 技能

### 分诊标签

规范名称，不做改动。见 `docs/agents/triage-labels.md`。议题按 [`SCOPE.zh-CN.md`](./SCOPE.zh-CN.md) 判断。
