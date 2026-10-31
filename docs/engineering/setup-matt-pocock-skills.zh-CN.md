## 它做什么

`setup-matt-pocock-skills` 回答关于一个仓库的三个问题：议题放在哪里、分诊标签叫什么、领域文档在哪里。它把答案记成 `docs/agents/` 下的 Markdown 文件。

这些文件是仓库之间唯一会变的东西。技能本身在哪里都完全一样。它们在运行时读 `docs/agents/issue-tracker.md`，照它说的做。这就是为什么这套技能不绑死在 GitHub 上，也是为什么你永远不用改技能文件去指向另一个跟踪器。用“把技能接到一个自定义议题跟踪器”来调用它，任何你能通过程序接入的东西都能用，技能本身不用改。

它是由提示驱动的技能，不是确定性脚本。它读你的 `git remote`、`CLAUDE.md` 和 `GLOSSARY.md`，把发现提出来，然后等你确认才写。

## 什么时候用它

通过打 `/setup-matt-pocock-skills` 调用；[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会自己去用它。它的元数据有意把它标成不可调用，所以没有别的技能能替你触发它。

每个仓库用一次，在任何其他工程技能首次使用之前。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec)、[to-tickets](https://aihero.dev/skills-to-tickets) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 开始猜你的议题该放哪，或者打上你跟踪器里没有的标签，就说明这个仓库还没配置过。项目做到一半的仓库也能运行它。技能会读已有的东西，所以早前的工作不会丢。

## 前提条件

它写进你运行它所在的仓库：

| 它写的 | 位置 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`，仅在装了 `triage` 技能时 |
| 一个 `## Agent skills` 块 | `CLAUDE.md` 或 `AGENTS.md` 中已经存在的那个 |

这些你都以 Markdown 提交。没有用户级或全局模式。配置住在仓库里，所以每个仓库有自己的副本。

## 三个决定

每一节都以推荐答案开头，探索已经答过的问题就跳过。多数运行只需要两次确认。

| 决定 | 它提议什么 | 什么时候会问 |
| --- | --- | --- |
| **议题跟踪器** | 与你的 `git remote` 相符的那个 | 总是问，因为这是唯一一个真正的选择 |
| **分诊标签** | 保留五个标准名字（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`） | 仅在装了 `triage` 技能时 |
| **领域文档** | 单上下文：根目录一个 `GLOSSARY.md` 加 `docs/adr/` | 仅在发现单体仓库信号时，然后它会提供多上下文的 `GLOSSARY-MAP.md` |

跟踪器选项：

| 选项 | 议题住在哪 | 需要什么 |
| --- | --- | --- |
| **GitHub** | 仓库的 GitHub Issues | `gh` 命令行工具 |
| **GitLab** | 仓库的 GitLab Issues | `glab` 命令行工具 |
| **本地 Markdown** | 本仓库 `.scratch/<feature>/` 下的文件 | 什么都不需要，连远程都不需要 |
| **其他** | 你说的地方 | 你一段话描述的工作流 |

前三个作为模板随技能发布，开箱可用。本地 Markdown 是一个完整选项，不是退路。技能支持没有远程的单人项目。一点提醒：如果你用 GitHub，就不要用本地 Markdown。它们是互斥的，选一个。

“其他”也是完整选项。Jira、Linear、Azure DevOps 和 Beads 都走这条路。你描述工作流，技能把你的文字记进 `docs/agents/issue-tracker.md`，下游技能照着这段文字做。已经有人这么建过：基于 [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 的 Jira 变体、仿 `gh` 形态的 Gitea 命令行、手工搭的本地看板。

## 常见问题

**我必须用 GitHub 吗？**

不用。GitHub、GitLab 和 `.scratch/` 下的本地 Markdown 都作为现成模板发布，其他任何东西都能走“其他”这条路。这是被问得最多的问题，大致是这些说法：*“硬锁在 github 上”*、*“我能用 GitLab / Jira 吗”*、*“Azure DevOps 呢”*。答案永远一样：配置选跟踪器，不是技能选。

**更新技能之后要重跑它吗？**

v1.1 之后的直接答案是“要”。技能自己收尾的话说得软一些，说只有切换跟踪器或从头重来才需要重跑。两种说法都站得住。种子模板在版本之间会变，所以旧版本生成的 `docs/agents/issue-tracker.md` 可能相对现在读它的技能过时了。如果下游技能的行为和文档描述的不一样，就重跑一次配置。它很便宜。

**它写到了 `CLAUDE.md`，但我用的是 Codex。**

这是已知缺口，目前仍未解决。选文件的规则是“`CLAUDE.md` 存在就改它，否则 `AGENTS.md`”。它检查哪个文件存在，不检查正在跑的是哪个 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)。在一个留着 Claude Code 时代 `CLAUDE.md` 的仓库里，技能会把 `## Agent skills` 块写进 Codex 从来不读的文件。用户有两个绕法：手工把块挪到 `AGENTS.md`，或者把 `AGENTS.md` 作为唯一权威、让 `CLAUDE.md` 变成指向它的一行指针。如果两个文件都不存在，技能会问你要创建哪一个，而不是替你挑。这一点让一些人困惑，他们以为它会自己决定。

**它没有创建我的分诊标签。**

它确实不创建。`docs/agents/triage-labels.md` 是一份*映射*：它告诉 `/triage` 你跟踪器里哪些字符串对应五个标准角色。它不运行 `gh label create`。在全新的 GitHub 仓库上这些标签还不存在，用户不止一次把这个当缺陷报过。两个结果：

- 如果你的跟踪器已经用标准名字，这份映射就是一张恒等表，没什么要配的。这是预期的常见情形，不是漏了一步。
- 这个技能也不创建 [wayfinder](https://aihero.dev/skills-wayfinder) 的 `wayfinder:map` 和 `wayfinder:<type>` 标签，而 `gh issue create --label <missing>` 会失败，而不是顺手创建标签。在 GitHub 仓库上第一次跑 wayfinder 之前，先手工建好它们。

**我能在这里配置其他技能的行为吗（[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)节奏、提问格式、语气）？**

不能。它配三样东西：跟踪器、标签、文档布局。有人要求把它做成放用户个人偏好的地方。答案是技能保持有自己的主张，不接收按用户的配置。偏好属于你 `CLAUDE.md` 里的普通指令，每个技能本来都会读那里。

**我能把配置放在 `~/.claude` 里，而不是提交进每个仓库吗？**

目前不能。一位在多个仓库里跑这套技能的用户提了这个需求，但没有用户级模式。每个仓库都带自己的 `docs/agents/`。

**有一个配置其他技能的技能，不觉得奇怪吗？**

一条长期存在的抱怨认为奇怪，原话是：*“有一个技能去配置其他技能，我觉得不太对：那意味着 LLM 在配置自己的技能。”* 这个取舍是真实的。没有配置这一步，每个会碰议题的技能都得各自带一份跟踪器说明。产出是你能读能改的 Markdown，这限制了风险。它写的每个文件你都能读，也能手工改。日常调整就这么改，不用再跑一次。

## 它在生效的表现

- `docs/agents/issue-tracker.md` 和 `docs/agents/domain.md` 存在；装了 `triage` 时还有 `triage-labels.md`。
- 你的 harness 读的指令文件里出现了 `## Agent skills` 小节，每份文件配一行摘要指向它。
- 它提议的跟踪器与你使用的远程相符，标签字符串与跟踪器里已有的标签相符。
- 之后 `/to-tickets` 直接发布，不再问你要把议题放哪；`/triage` 打上标签而不是自造标签。
- 技能文件本身没有任何改动。如果配置改动了某个 `SKILL.md`，那就是出错了。

## 它在哪里合用

`setup-matt-pocock-skills` 是工程流程的**一次性配置**，是其他一切所假定的前提，而不是链条里的一个步骤。它的邻居就是它的读者：[triage](https://aihero.dev/skills-triage)，用它写下的标签词表；[to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets)，发布到它指定的跟踪器；以及 [wayfinder](https://aihero.dev/skills-wayfinder)，它读同一个跟踪器文件的“寻路操作”一节，学会怎么存地图和子[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)。[domain-modeling](https://aihero.dev/skills-domain-modeling) 之后会填入配置记录的领域文档布局。它只在你是解决了一个术语或决定时才创建 `GLOSSARY.md` 和 ADR，所以配置完一个仓库没有领域文档是正常的。下一个该用哪个技能，[ask-matt](https://aihero.dev/skills-ask-matt) 会带你在整套技能上导航。
