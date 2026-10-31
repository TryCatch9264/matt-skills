## 它做什么

`triage` 处理项目跟踪器上的议题。它让每条议题沿一个小型的**分诊角色**状态机流转（一个分类角色加一个状态角色）。每条议题最后成为一份代理可开工的说明、一个给报告者的具体问题，或者一条带着记录理由关闭的议题。

它只用于**不是你创建的**议题。也就是原始的缺陷报告、外来的功能需求，或者一条没打招呼就到的外部拉取请求：从外面进入跟踪器的工作，无论报告者留下它时是什么形态。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)已经是代理可开工的，所以如果你对它们跑 `triage`，就把那份工作浪费了。规则很简单：`/triage` 只用于进来的议题，不用于你自己创建的议题。

它与手工打标签也不同，因为它先建议再等。它把分类和状态的判断连同理由、以及它在代码库里发现的东西一起给你，在你发话之前什么都不应用。

## 什么时候用它

通过打 `/triage` 然后用手常语言描述你想要什么来调用。[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会自己去用它。例如：“给我看看有什么需要我处理的”、“我们看看 #42”、“把 #42 移到 ready-for-agent”。

| 你手上是什么 | 去哪里 |
| --- | --- |
| 跟踪器里满是别人发来的原始报告 | `/triage` |
| 你自己一个粗略的想法，什么都没写下来 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一场定下来的对话，要变成[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec) | [to-spec](https://aihero.dev/skills-to-spec) |
| 一份规格说明，要拆成代理可开工的工单 | [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一个已确认的缺陷，需要根因而不是标签 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## 前提条件

`triage` 读写你的议题跟踪器，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先配置好那个跟踪器及其标签词表。下面的角色名是**标准的**。你跟踪器里的标签字符串可能不同，setup 会提供映射。如果你的跟踪器已经精确使用标准名字，那就没什么要映射、也没什么要配置。

跟踪器配置还决定外部拉取请求算不算需求入口，以及谁算外部。那个开关默认关闭，setup 也不再问它。要把 PR 纳入范围，就在 `docs/agents/issue-tracker.md` 里打开。

## 状态机

每条分诊过的条目最后恰好有一个分类角色和一个状态角色。分类有两个：`bug`（有东西坏了）和 `enhancement`（新功能或改进）。状态有五个：

| 状态 | 含义 |
| --- | --- |
| `needs-triage` | 需要你评估。没有标签的议题通常先进这里。 |
| `needs-info` | 等报告者。他们回复后回到 `needs-triage`。 |
| `ready-for-agent` | 规格完整，附有代理说明。一个[脱手（AFK）](https://www.aihero.dev/ai-coding-dictionary/afk)代理可以接手。 |
| `ready-for-human` | 同样的说明，外加为什么代理做不了：判断、外部访问、手工测试。 |
| `wontfix` | 已关闭，理由已记录。 |

这就是全部词汇。每条恰好一个状态角色这条规则让查询保持简单。状态也是这个[技能（skill）](https://www.aihero.dev/ai-coding-dictionary/skill)被要求最多的地方。用户要求过为“已定规格但被别的议题阻塞”的工作加一个状态、为等未来触发条件的工作加一个 `deferred` 状态，以及一个终结性的 `implemented` 状态。都没有发布。见下面的问答。

`wontfix` 有三种情况。区别要紧，因为只有一种会写进知识库：

| 你为什么关闭它 | 会发生什么 |
| --- | --- |
| 已经实现 | 一条评论指出该功能已经在哪里。什么都不进 `.out-of-scope/`，因为那是已建好的功能，不是被否掉的，那里的文件会破坏去重检查。 |
| 否决缺陷 | 礼貌说明理由，然后关闭。 |
| 否决功能增强 | 在 `.out-of-scope/` 写一个文件，从关闭评论里链接过去，然后关闭。 |

`.out-of-scope/` 每个被否掉的**概念**一个 Markdown 文件，不是一个议题一个。每个文件是一份简短的设计文档，不是数据库里的一行。它说明被否掉的是什么、为什么，并列出要求过它的每一条议题。`triage` 在评估任何东西之前先读完整个目录。它按概念匹配，不按关键词，所以“夜间主题”会匹配 `dark-mode.md`。找到匹配时，它把旧决定摆给你看，问你现在的看法是否仍然相同，而不是从头再争一遍这个需求。

## 先验证，再写说明

任何[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)之前，`triage` 先确认这个说法站得住。对缺陷，按报告者的步骤复现。对 PR，检出分支并运行相关测试。然后它报告三种结果之一：

- 已确认，附代码路径。
- 无法复现。
- 细节不足无法尝试。这是最强的 `needs-info` 信号。

同一遍里，它还对着代码库再做两项检查。**重复**检查问这个功能是否已经实现，按领域概念搜索，而不是按报告者的措辞。**先前否决**检查问 `.out-of-scope/` 是否已经说过不行。两项都很便宜，任一命中都会产出 `wontfix`。

这一切工作是为了让一个产物变得好：**代理说明**。那是议题移到 `ready-for-agent` 时 `triage` 发布的结构化评论。发布之后，说明就是契约，原始报告只是背景。说明要**耐久**而不是精确，因为一条议题可能在 `ready-for-agent` 待上几周，而代码在变。所以说明点出类型、签名和行为契约，绝不出现文件路径或行号。一次确认过的复现能让说明强得多，比猜测强。

## PR 是附带代码的议题

如果跟踪器把外部拉取请求当作需求入口，它们走同一台状态机，同样的分类、状态和迁移。状态对着 diff 来读。`ready-for-agent` 表示说明已附上、代理应当在这段代码上推进下一步。`ready-for-human` 表示人可以合并它。PR 上的说明描述对现有 diff 还剩什么要做，而不是怎么从零建这个东西。

发现阶段只列出*外部* PR，因为协作者正在进行的分支不算分诊工作。这个过滤只用于发现。如果你明确点了一条 PR，`triage` 就处理它，不管是谁写的。

## 常见问题

**我跑了 `/to-spec` 和 `/to-tickets`，现在那些工单摆在那儿没分诊。我要对它们跑 `/triage` 吗？**
不要。它们已经是代理可开工的。`to-tickets` 发布时就打上 `ready-for-agent` 标签，所以脱手的运行器不用再走一遍就能接下它们。碰到这个问题的用户跑了规格说明流程，看到输出上是 `needs-triage`，而他的脱手运行器把一切忽略了。`triage` 是从外进来的工作的入口。规格说明流程是你自己开始的工作的通道。两条路在 `ready-for-agent` 汇合，而不是更早。

**有了 `to-spec` → `to-tickets` → `implement` 这条流程，`triage` 还有意义吗？**
只有你有进来的工作时才有。`triage` 比那条流程更早，做的是另一件事：它处理别人提交的报告。如果你跟踪器里的一切都来自你自己的规划，你会很少用它。如果你维护任何公开的东西，或者你的团队把缺陷报给你，那就是这类工作的起点。主要用途是接收外部贡献者议题的开源仓库。

**代理想打 `ready-for-agent`，`gh` 说标签不存在。**
这是一个已知的未修缺陷（[#616](https://github.com/mattpocock/skills/issues/616)）。`setup-matt-pocock-skills` 把标签词表写进 `docs/agents/triage-labels.md`，但不会在你的跟踪器里创建标签。自己把五个状态标签和两个分类标签建一次，用 `gh label create` 或者跟踪器的界面，错误就停了。议题里链接了一个社区修法分支，没有合并。

**五个状态不够。被阻塞的、推迟的、已实现的呢？**
这是这个技能被提得最多的缺口。它有三种形态：

- 一条规格完整、但在等另一条议题关闭的议题（[#139](https://github.com/mattpocock/skills/issues/139)）。报告者说 `ready-for-agent` 在那里“技术上成立”，但误导人，于是代理接手就卡住了。
- 有意要做、但要等某个触发条件的未来工作，所以现在还不可执行（[#297](https://github.com/mattpocock/skills/issues/297)）。
- 一个“已实现，待验证”的终结状态。没有它，脱手运行器会把做完的工单再排一遍。

被阻塞那种情况被认可为真实需求，但名字还没定（`blocked` 还是 `paused`）。都还没发布。变通办法是在分类旁边加一个仓库本地的额外标签。状态那一格于是带着准确的值，但技能并不知道那个额外标签。有个社区分叉走得更远，加了 `needs-slicing`、`tracking` 和投入标签。那能用，但属于那个分叉，不属于这个技能。

**这和 `/diagnosing-bugs` 有什么不同？**
这里的验证步骤有意做得浅。它回答“这是真的吗、大致在哪”，不找根因。如果缺陷在几分钟内不能按报告者的步骤复现，就用 `needs-info`；如果你想现在就查，就用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。两个技能的正文目前都不提对方。有用户报告了这个缺口，仍未关闭。

**我能把它指向我整个待办列表让它自己跑吗？**
你可以要求，但要留意它读的是什么。“展示需要处理的东西”那一遍是为了*挑选*的便宜清单。你挑一条议题，然后 `triage` 为那条议题收集完整的[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)。如果你一次对二十条议题跑它，代理可能把那份便宜清单当成它唯一的证据，还不告诉你。清单返回议题正文，但不返回评论。一位用户正好撞上这个。三条议题上已经有评论写着“已修复，建议关闭”，而三条都拿到了新的代理说明。批量处理时，明确说它必须读每条议题下的评论。

**它和 Linear 能用吗，或者 GitHub Issues 之外的任何东西？**
能。跟踪器是配置，不是硬编码的假设。有人拿它对 Linear（通过 `linear` 命令行）、GitLab、以及 `.scratch/` 下的纯 Markdown 文件跑。一种常见的分工是用 Linear 管议题和规划、用 GitHub 管代码和 PR。说“议题跟踪器”的技能于是映射到 Linear，说“PR”的技能映射到 GitHub。本地 Markdown 跟踪器有一个未关闭的模板缺陷：生成的文件可能包含两遍验收标准，一遍在顶层，一遍在代理说明里面（[#200](https://github.com/mattpocock/skills/issues/200)）。

## 它在生效的表现

- 它碰过的每条条目最后恰好有一个分类角色和一个状态角色，从不是零个，也从不是两个冲突的状态。
- 它给你一个带理由的建议然后停。它不会就地改标签然后走开。
- 在任何东西到达 `ready-for-agent` 之前，它复现了缺陷，或者检出并跑了那条 PR。
- 它写的说明点出类型和行为，不含文件路径，也不含行号。
- 你六个月前否掉的需求再回来时，它告诉你并引用旧理由，而不是再分诊一遍。
- 它发的每条评论都以 `> *This was generated by AI during triage.*` 开头。

## 它在哪里合用

`triage` 是一个**入口**，不是主链上的一步。主流程从你自己的想法开始（拷问、规格说明、工单、实现、审查）。`triage` 是从别人那里来的工作的平行通道。两条通道终点相同：一条带 `ready-for-agent` 标签、附有说明的议题。[implement](https://aihero.dev/skills-implement) 接它的方式，和接 [to-tickets](https://aihero.dev/skills-to-tickets) 产出的工单一样。当一条需求在 `triage` 能写说明之前还需要更多细节时，`triage` 一起跑 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling)，一轮一轮提问，于是你在做决定的同时，它把决定记进 `GLOSSARY.md` 和 ADR。不确定自己在哪条通道时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
