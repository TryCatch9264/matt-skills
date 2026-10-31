## 它做什么

`grill-with-docs` 就一份计划或设计访谈你，直到你和[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)对它有同一份理解，同时把用词和关键决定写进你的仓库。它和 [grill-me](https://aihero.dev/skills-grill-me) 跑的是同一场访谈（一轮问题，然后等，再下一轮），只是对着一个代码库。

它是**[有状态](https://www.aihero.dev/ai-coding-dictionary/stateful)**的。其他拷问技能都把[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)留在你脑子里；这个在磁盘上留下文件。一个术语定下来时，技能立刻写进 `GLOSSARY.md`，而不是最后批量写。一个决定通过三道门时，技能把它写成 ADR。这就是全部差别，而人们的多数麻烦也正是由此而来。产物是真实仓库里的真实文件，所以它们可能在你期待时不存在，也可能在多人共同写时跑偏。

## 什么时候用它

通过打 `/grill-with-docs` 调用，代理不会自己去用它。

在一次改动的开头用，在仓库里用，当计划还模糊、指代那个东西的词还没定下来的时候。它是单会话的工具。要哪个拷问技能，取决于眼前有什么：

| 你手上是什么 | 用 |
| --- | --- |
| 你根本不在工作目录里工作 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个仓库，和一个一次会话能定下来的改动 | `grill-with-docs` |
| 一次会话装不下的大工作（全新项目、大功能） | [wayfinder](https://aihero.dev/skills-wayfinder) |
| 一个完全没有领域文档的仓库，也没想好做哪个功能 | `grill-with-docs`，对准仓库而不是某个改动 |
| 某个决定卡在别人脑子里的知识上 | [to-questionnaire](https://aihero.dev/skills-to-questionnaire) |

wayfinder 的分界归结为会话数：单会话规划用 `/grill-with-docs`，多会话规划用 `/wayfinder`。

## 前提条件

技能会写进你的仓库，所以你得待在一个可以安全写入的地方。定下来的术语进根目录的 `GLOSSARY.md`，如果根目录的 `GLOSSARY-MAP.md` 标明仓库是多上下文的，就进对应上下文的 `GLOSSARY.md`。决定进 `docs/adr/`。两者都是需要时才创建。在第一个术语或决定定下来之前，什么都不存在，所以你不必事先配置任何东西。

它还需要另外两个技能在场，因为它自己的 `SKILL.md` 只有一行，是对它们的委派。[grilling](https://aihero.dev/skills-grilling) 提供访谈，[domain-modeling](https://aihero.dev/skills-domain-modeling) 提供写作。只装 `grill-with-docs` 你会得到一个用不了的技能。

## 留下的文字记录

一次会话产出三样东西，它们并不等值。

| 定下来的是什么 | 落到哪里 |
| --- | --- |
| 一个术语：项目自己对某样东西的说法 | `GLOSSARY.md`，就地写入，定下来的当下 |
| 一个难以撤销、缺少上下文会让人意外、而且是真实取舍的决定 | `docs/adr/` 下的一条 ADR |
| 你决定的其他一切 | 那场对话里，别处没有 |

第三行最容易让人栽跟头。`GLOSSARY.md` 只是术语表。里面不放实现细节，不放[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)，也不放草稿笔记。ADR 需要三个条件同时成立，所以多数决定不够格，多数会话一条也产不出来。一次会话磨出了更利落的术语表、零条 ADR，这是按设计工作的，但它意味着你商定的大部分内容只存在于你商定它的那个[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)里。把同一场对话交给 [to-spec](https://aihero.dev/skills-to-spec)，而不是把它[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing)。

术语表是主要产出。这个技能建立领域语言：项目自己的词，商定一次，好让你、代理和同事不必再重新琢磨它们。并非所有人都同意这能提升代理表现。最强的反对意见是：一个术语和它的白话展开能从[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)得到同样的结果，而这套词汇主要缩短的是共享它的人与人之间的沟通。按这种看法，术语表仍然有价值，但价值归人。

## 常见问题

**我该用这个还是 `/wayfinder`？**
范围决定。一次会话能定下来的都用这个；工作大到一次装不下时用 [wayfinder](https://aihero.dev/skills-wayfinder)，它先把这个工作画成一张决策[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)地图。Wayfinder 更慢更密，在范围清楚的功能上用它才是常见错误。它不替代这个技能，还可以为地图上适合的部分开一场拷问会话。

**它跑了，但没有出现 `GLOSSARY.md`，也没有 ADR。**
有两个已知原因。第一个是没什么够格。ADR 需要三道门全过，而一场关于某个改动、没有新词汇的会话，本来就没什么可写。第二个是真实的缺陷。当这个技能跑在另一层统筹里（某个规格驱动开发的包装层、某个多代理框架、某条把它当成别人流水线里一步的规则），用户报告写文件那一半静默地没有发生，而访谈照常进行。缺陷已记录、未修复。如果你在这种环境里，先检查工作目录，再相信这次会话的产出。

**它一次把所有问题都问了，没有建议，也从没提 `GLOSSARY.md`。**
那是技能没能加载它的两个依赖。因为 `SKILL.md` 是一行委派，没拿到 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 的代理会去猜“拷问”是什么意思，结果你一次拿到所有问题、没有结构。部分加载更让人困惑：`grilling` 加载了，`domain-modeling` 没有，你得到一场不错的访谈但没有文字记录。它发生的频率取决于模型和[投入（effort）](https://www.aihero.dev/ai-coding-dictionary/effort)等级，这是关于这个技能被报告最多的问题。如果你怀疑是这种情况，直接问代理它加载了哪些技能。

**我其他的决定都去哪了？**
只在那场对话里。这是关于这个技能最严重的未解决抱怨。术语表不是规格说明，多数答案不值得一条 ADR，也没有任何记录把每个定下来的答案关联到规格说明、工单和测试。后续步骤会把精确的回答（顺序保证、否定式要求、数值默认值）稀释成更弱的表述，结果可能看起来完整，却漏掉了你真正决定的东西。眼下，保住这场会话，直接喂给 [to-spec](https://aihero.dev/skills-to-spec)。然后对照你自己的回答重读那份规格说明，不要假定它抓住了它们。

**我能把它指向一个完全没有文档的现有仓库吗？**
能。对于一个没有 ADR、没有领域语言、没有设计原则的代码库，这正是合适的技能：调用它并说“帮我给仓库写文档”。人们常把它和 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 配合，用来建立或修复 `GLOSSARY.md`。要预期由你掌舵。它读代码，就发现的东西问你，而由你判断代码库里已有的哪些词是对的。

**会话结束之后我该做什么？**
技能的收尾信息常常没有明确指向，这是一个已知问题。在主流程里，答案是同一场对话里的 [to-spec](https://aihero.dev/skills-to-spec)。如果改动小到可以立刻开建，就直接去 [implement](https://aihero.dev/skills-implement)。

**为什么叫这个名字？**
没人对这个名字满意。有一个未实现的建议是改叫 `grill-domain-model`，那更准确地描述了它的行为。这件事没有进展。如果哪天改名落地，文档页会跟着走，URL 也会变。

## 它在生效的表现

- `GLOSSARY.md` 在会话*过程中*一个个术语地变，而不是最后一次性冒出来。
- 术语表读起来是纯词汇（你项目自己的词加紧凑的定义），不含实现细节或像规格说明的文字。
- 代码库能回答的问题靠读代码库来回答，而不是问你。
- 你拿到很少或零条 ADR，拿到的那几条是你不想再被争一遍的决定。
- 它会质疑你用过的某个词，因为你已有的术语表把它定义成了别的意思。

## 它在哪里合用

`grill-with-docs` 是主构建链的头部：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

它在任何东西被写成规格说明之前。它产出共同理解和已定的词汇，之后 [to-spec](https://aihero.dev/skills-to-spec) 不再访谈你，直接综合它们。它的近邻是 [grill-me](https://aihero.dev/skills-grill-me)，同一场访谈，但没有仓库、不写文件；以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)，它驱动的那套术语表与 ADR 的功课。两者都用 [grilling](https://aihero.dev/skills-grilling) 这个基础来做访谈。它的上游是 [wayfinder](https://aihero.dev/skills-wayfinder)，后者为一次会话装不下的工作画地图，并可以把地图上的部分交回给它。不确定哪个技能或流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
