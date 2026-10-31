## 它做什么

`code-review` 沿两条轴审查 `HEAD` 与你指定固定点（一个提交、一个分支、一个标签、`main`、`HEAD~5`）之间的 diff。**标准**问代码是否遵守这个仓库写代码的方式。**规格**问代码是否做了源议题或[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)要求的事。每条轴在自己的[子代理（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)里跑，谁看不到另一方的推理。

技能从不合并或重排两条轴。报告以每条轴的*各自*最严重问题结尾，并拒绝在两者之间挑一个总冠军。一个改动可以通过一条轴而败在另一条。遵守了每一条约定但实现错东西的代码通过标准、不通过规格。完全按[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)要求实现却破坏仓库约定的代码正相反。混合的判断会让通过的那条轴掩盖失败的那条。

## 什么时候用它

打 `/code-review`，或者在你要求审查一个分支、一个 PR、进行中的工作、或者“自 X 以来”的改动时由代理自动取用。

| 你的处境 | 用 |
| --- | --- |
| 有 diff 存在，你想知道它是否建得对*而且*是不是对的东西 | `code-review` |
| 你想在 diff 里找缺陷：空值路径、竞态、差一 | Claude Code 自带的内置审查，不是这个（见下面的重名问题） |
| 什么都还没写，你想先写测试 | [tdd](https://aihero.dev/skills-tdd) |
| 整份规格说明要建，包含审查 | [implement](https://aihero.dev/skills-implement)，它会自己调用这个技能 |
| 整个代码库都跑偏了，不是一个 diff | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| 有东西坏了，你不知道为什么 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

固定点必须由你给。如果不给，技能会来要，而不是猜。启动任何东西之前，它先确认引用能解析、diff 不为空，所以打错的分支名会在你面前失败，而不是在两个子代理里面失败。

## 前提条件

标准轴什么都不需要。它读仓库写明的东西（`CODING_STANDARDS.md`、`CONTRIBUTING.md` 之类），仓库什么都没写时退回一套内建基线。

规格轴需要存在一份能找到的规格说明。它按这个顺序找：

1. 提交信息里的议题引用（`#123`、`Closes #45`、GitLab 的 `!67`），按跟踪器文档取回。
2. 你作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支或功能名相符的规格说明文件。
4. 问你。

第 1 步依赖 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 写的跟踪器文档。没有它，只要你给个路径，这条轴照样能用。完全没有规格说明时，技能跳过规格子代理，报告写“没有可用的规格说明”，而不是编造要求。

## 两条轴

| | 标准 | 规格 |
| --- | --- | --- |
| 问什么 | 它建得对吗？ | 它是对的东西吗？ |
| 读什么 | 仓库写明的规范，加上坏味道基线 | 源议题或规格说明 |
| 报什么 | 违反写明规范的（可以是硬性的）、以及坏味道（永远是判断类） | 缺失或只做了一部分的要求、范围蔓延、实现错了的要求 |
| 每条发现引用 | 规范文件和规则，或者点名的坏味道加相应 hunk | 规格说明的那一行 |

这个设计是为了避开那种不知道你规范的通用审查技能。那种技能会标记你代码库里本就是故意的做法，却漏掉你代码库赖以成立的不变量。所以仓库自己的文档是标准轴上的[一手来源（primary source）](https://www.aihero.dev/ai-coding-dictionary/primary-source)，而且**仓库永远优先**。

**坏味道基线**垫在仓库规范之下。它是 Fowler《重构》第 3 章的十二个代码坏味道：神秘命名、重复代码、依恋情结、数据泥团、基本类型偏执、重复的 switch、霰弹式修改、发散式变化、夸夸其谈通用性、过长的消息链、中间人、被拒绝的遗赠。每个都是一个带标注的启发式判断（“可能有依恋情结”），绝不是硬性违规。每个都说明它是什么、怎么修，所以一条发现带着修法，而不只是抱怨。两条轴都跳过你的 linter 已经强制的东西。

## 常见问题

**它和 Claude Code 自带的 `/code-review` 撞名。怎么办？**

这是关于这个技能被报告最多的问题，而且没修。Claude Code 自带一个 `/code-review`，做的事不一样：它找 diff 里的缺陷，而这个是检查规格符合度和仓库规范。你装这个库时，其中一个会胜出，哪一个取决于你怎么装的：

- **插件市场。** 每个技能都带 `mattpocock-skills:` 前缀，内置的那个在不带前缀的名字上变得难触达。
- **普通技能安装。** 本地文件胜出，这个技能遮住了内置的。

一个答案是彻底删掉 Claude Code 的内置技能。那能省下大量[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)，撞名也就不重要了。遮住本身可以说是 Claude Code [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 的缺陷（技能作者应当有权给技能起任何名字），所以另一个答案是给本地副本改名。`npx skills update` 会撤销你对 frontmatter 的编辑或重命名的目录。用户报告的比较耐久的变通是把技能分叉成一个新名字，并从受管集合里去掉 `code-review`。记下你从哪个提交分叉出来的，好手工再同步。

**它的子代理一直在再次调用 `/code-review`，派出更多代理。**

这是一个已知的未修缺陷。几个人复现过，不止一个 harness。标准和规格的提示都没有禁止委派，于是子代理可能又找到这个技能、又扇出一次。有一份报告提到超过 50 个代理。人们在分叉上打的修法是给两个子代理的说明各加一行：“不要调用 `/code-review`，也不要派生额外代理：直接完成这次审查。” 有人更愿意在 harness 层处理，让每个技能都继承这道防护。哪个都还没进已发布的技能。如果你无人值守地跑它，盯住代理数量。

**我该在写代码的那场[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)里跑它吗？**

最好用一个新会话。正如一位读者说的：“同一个上下文审查自己不是审查，是带斜杠命令的确认偏误。”在作者会话里审查的代理，上下文里带着塑造这段代码的每一个假设。独立的审查者不会有那些上下文。这也是人们要求 [implement](https://aihero.dev/skills-implement) 不带内建审查步骤的原因，因为那一步就在刚写完 diff 的会话里跑审查。独立的做法是你自己从干净的会话里调用 `/code-review`。

**每张工单之后，还是最后一次？**

两种都行，技能不替你决定。逐工单让每个 diff 小到规格轴有清晰的一份规格说明可对照，这也是 `implement` 用的模式。最后再按分支一次性审，能抓住各次逐工单审查都漏掉的工单之间的交互。不确定的话，就逐工单审，再对着分支点跑一次最终审查。

**这些发现我能信吗？**

不核对就不能信。子代理的输出是假设，不是证据。有个团队报告过十几个基于文字的审查漏掉的破坏性改动。技能把两份报告按原样或略作整理合并。它不逐条对着文件复核，所以一条发现可能引错位置或夸大影响。动手之前先读每条发现的引用。技能要求每条发现都带引用（一条规范规则、一个坏味道加它的 hunk，或者一行规格说明），这正是让发现可核对的东西。

**为什么我每次跑它都能发现新问题？**

每次修复都给待审代码添了新东西，而标准轴里属于判断的那一半每次运行结果都不同。一位读者描述过这个循环：“/code-review 和 /improve-code-architecture 每次都能发现新东西。我实现修复，重跑这些技能，然后再来一遍又一遍。”没有收敛保证。把一遍审查当成一张线索清单。处理那些背后有引用规则支撑的，然后停。不要循环跑到它变干净，因为它永远不会。

**它会审我未提交的工作吗？**

不会。它 diff 的是 `<fixed-point>...HEAD`。三点形式从 merge-base 量起，不包含已暂存和工作区的改动。如果 `implement` 还没做中间提交，审查就看不到即将进入下一个提交的工作。先提交，再审查，然后 amend 或者加一个 fixup。

## 它在生效的表现

- 在任何子代理被启动之前，它就在坏引用或空 diff 上拒绝开始。
- 报告以 `## 标准` 和 `## 规格` 两个独立区块到来，而不是一份合并的清单。
- 每条标准发现要么点出你仓库某个文件里的规则，要么点出十二个坏味道之一，并引用相应 hunk；每条规格发现都引用规格说明的一行。
- 收尾总结给出每条轴最严重的问题，并拒绝挑一个总的胜者。
- 没有规格说明可用时，规格块说明这一点，而不是列出它从代码里推断的要求。

## 它在哪里合用

`code-review` 是构建链靠近尾部的审查步骤：`grill-with-docs → to-spec → to-tickets → implement → code-review → retro`。它也能单独用在你指向的任何分支或 PR 上。

- [implement](https://aihero.dev/skills-implement) 是最亲近的邻居。它驱动构建，并在提交之前调用这个技能作为自己的收尾审查。[implement-spec](https://aihero.dev/skills-implement-spec) 在整条集成分支上做一次同样的事。
- [retro](https://aihero.dev/skills-retro) 在它之后，并调校它。当一次会话显示审查漏掉了某一类错误时，`retro` 提议标准轴之后会读的检查或 `CODING_STANDARDS.md` 规则。
- [pr](https://aihero.dev/skills-pr) 在审过的代码提交上去之后写拉取请求正文。
- [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets) 产出规格轴对照的文档，所以含糊的规格说明会让那条轴也含糊。
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是全代码库的对应做法，因为这个技能只看一个 diff。

不确定当前情况需要哪个技能时，[ask-matt](https://aihero.dev/skills-ask-matt) 会带你在整套技能上导航。
