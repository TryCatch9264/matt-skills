## 它做什么

`implement` 构建已经决定好的工作。你把它指向一张[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)、一份[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)，或者你们刚在对话里商定的计划，它写代码、在接缝上驱动 [tdd](https://aihero.dev/skills-tdd)、边做边做类型检查、结尾跑 [code-review](https://aihero.dev/skills-code-review)，然后提交到当前分支。

它从不重新打开计划。没有访谈，没有澄清轮，不提另一种做法。上游定下来的东西就是输入，技能的整个工作就是把它变成一次提交。这就是它与对着一个新[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)打“建这个”的区别：后者常常一边建一边重新设计。

## 什么时候用它

你亲手打 `/implement` 调用它，代理不会自己去用它。它带着 `disable-model-invocation: true` 发布，所以别的技能也调不了它。凡 [ask-matt](https://aihero.dev/skills-ask-matt) 或 [to-tickets](https://aihero.dev/skills-to-tickets) 说“然后每张工单跑 `/implement`”，那是对你说的，不是代理会主动去做的事。

工作现在住在哪里，决定这是不是对的技能：

| 工作在…… | 用 |
| --- | --- |
| 跟踪器上的一张工单 | `/implement #42`，一个[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)一张工单，工单之间[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing)上下文 |
| 一份还没拆的规格说明，而且构建跨多个会话 | 先 [to-tickets](https://aihero.dev/skills-to-tickets)，然后每张工单跑 `/implement` |
| 一份规格说明，而构建很小 | 直接对规格说明跑 `/implement` |
| 只在你刚做完的那场对话里，而且还不大 | 就在那里 `/implement`，同一个窗口 |
| 还没写到任何地方 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，没有代码库就用 [grill-me](https://aihero.dev/skills-grill-me) |
| 一个你想先写测试的具体行为，没有规格说明 | 直接用 [tdd](https://aihero.dev/skills-tdd) |
| 已经建好了，想让人检查 | 直接用 [code-review](https://aihero.dev/skills-code-review) |

同会话那一条值得点出来，因为技能自己的第一行没覆盖它。`SKILL.md` 说的是“规格说明或工单”，这会把[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)推去找一个并不存在的文件。如果计划只活在这条线程里，调用时就说清楚。

## 前提条件

`implement` 提交到你当前所在的分支。它不新建分支，也不问。开始之前先确认你在想要的分支上。

如果工单来自 [to-tickets](https://aihero.dev/skills-to-tickets)，那么 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 已经配置好它们所在的跟踪器。`code-review` 在收尾时读同一份配置来找出源规格说明。

## 一次运行做什么

一次运行分五步，按顺序：

1. 读工单或规格说明，理出接缝。
2. 在事先商定的接缝上驱动 [tdd](https://aihero.dev/skills-tdd)，一次一个红-绿切片。
3. 频繁做类型检查，边做边跑单个测试文件。
4. 最后跑一次完整测试套件。
5. 跑 [code-review](https://aihero.dev/skills-code-review)，然后提交到当前分支。

一次运行覆盖一张工单。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的工单是为装进一个全新[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)而设计大小的曳光弹纵向切片，所以预期的节奏是：清空上下文，实现一张工单，提交，再清空。每张工单都自足，所以你可以丢掉上一张工单的上下文。

## 事先商定的接缝

技能的核心想法是**接缝**：你在那里观察行为而不必伸进内部的公开边界。测试待在接缝上。当接缝在任何代码存在之前就商定好，测试就能长久，你可以在底下重写实现而不改它们。

“事先商定”这部分很要紧，它同时也是这个技能最弱的地方。`implement` 内部没有任何东西去商定接缝。问的是 `tdd`，它拒绝在未确认的接缝上写测试。所以实践中，商定要么发生在规格说明那一层，要么发生在这次运行的第一个交换里。如果哪里都没发生，这次运行就变成“直接把代码写出来”，而且没有任何东西提醒你。在规格说明里点出接缝，正是防止这一点的方法。

## 常见问题

**它跑完了，但我的工单还开着，验收标准也没勾。**

对，这是预期行为。`implement` 没有收尾步骤。它停在提交，从不碰工作项。在 GitHub Issues 和本地 Markdown 跟踪器上都是这样，所以不是跟踪器集成的问题。它也不处理 `code-review` 产出的发现，也不勾源议题上的 `- [ ]`。工单你自己关，标准你自己核对。这在依赖链上最要紧，因为 `to-tickets` 把前沿定义为阻塞项全部关闭的工单。如果什么都不关闭，就永远没有工单会明显地解除阻塞。

**我能一次指向我所有的工单，或者并行跑几个吗？**

用 `/implement` 不行：一次调用，一张工单。想在一次运行里做完整份规格说明，用 [implement-spec](https://aihero.dev/skills-implement-spec)，它把前沿上每张就绪工单交给各自 worktree 里的一个[子代理（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)，再把结果合并到一条集成分支上。在同一个检出目录里并排跑几个 `/implement` 会话，比“不受支持”更糟。有一份现场报告描述：一个会话里的 `git commit --amend` 落到了另一个会话的提交上，一个 stash 从 `refs/stash` 里消失，提交落到错误的分支上，全都发生在三个议题上的一个下午里。这些会话共用一个工作目录、一个索引和一个 HEAD。用户用 git worktree 绕过这一点，但 `refs/stash` 也在 worktree 之间共享，所以光靠 worktree 修不好 stash 那种情况。

**它能开一个拉取请求而不是提交吗？**

没有内建。它直接提交到当前分支。不少人觉得这太急，因为代码在他们能验证它可用之前就落地了。没有配置开关，也没有 PR 模式。人们在调用时覆盖它（“提交到一个分支并开 PR”），或者改本地那份技能副本。代理真要写 PR 时，由 [pr](https://aihero.dev/skills-pr) 决定正文形态。

**`code-review` 说它看不到我的改动。**

`code-review` 审的是 `git diff <fixed-point>...HEAD`，这不包含已暂存和工作区里的改动。`implement` 在提交之前跑它，所以除非已经有一个中间提交，那个 diff 里什么都没有可审的。多人报告过这一点，两边都没修。先提交，再对着你分出来的那个点去审。

另外，有些人根本不想要运行内部的审查，因为一个审查自己刚写的代码的代理会偏向自己的方案。在全新会话里对着一个固定点跑 [code-review](https://aihero.dev/skills-code-review) 是可行的替代。同样的偏向也是那个技能把两条轴放在不同子代理里跑的原因。

**一张工单烧了 150k 词元。我用错了吗？**

大概没有。更可能是这张工单太大了。一次运行要做代码库探索、每个接缝一轮红-绿循环、一次完整套件、一次审查，所以一张不太简单的工单超过 100k [词元（token）](https://www.aihero.dev/ai-coding-dictionary/token)是正常的，不是哪里坏了的迹象。修法在上游。在 [to-tickets](https://aihero.dev/skills-to-tickets) 里把工单切到合适大小，让每张装进一个全新窗口。如果某张工单老是超，就拆它，而不是提高[投入（effort）](https://www.aihero.dev/ai-coding-dictionary/effort)等级。

**在新会话里跑 `/implement #2`，它做了完全无关的东西。**

代理把 `#2` 解析成了上下文里另一份编号清单（比如待办文件或检查清单），而不是已配置的跟踪器。`implement` 现在会从议题跟踪器取回传入的引用，并在开始前声明它的标题，引用含糊时会来问你。核对那个标题是不是你要的工单；传议题 URL 或 `owner/repo#2` 能彻底消除歧义。

## 它在生效的表现

- 会话开头的动作是读工单或规格说明、复述它要建什么，而不是问你要建什么。
- 你在轨迹里能看到一次真正的 `tdd` Skill 工具调用，而不只是 diff 里冒出了测试。
- 运行过程中反复跑类型检查和单个测试文件，接近结尾时跑一次完整套件。
- 运行到你当前分支上的一次提交，而且不需要你催它继续。
- diff 是一张工单份量的改动：穿过每一层的纵向切片，而不是几张工单扫成一堆。

## 它在哪里合用

`implement` 是主链的构建步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)，后者产出它消费的工单，并声明决定顺序的阻塞关系；[tdd](https://aihero.dev/skills-tdd)，它在内部于每个接缝上驱动；以及 [code-review](https://aihero.dev/skills-code-review)，它在提交之前跑。它位于规划类技能的下游，并且信任它们。它不重新验证交给它的东西的形态，所以一张结构糟糕的地图或一张横向分层的工单，会被照着写的样子建出来。

这份信任就是 [wayfinder](https://aihero.dev/skills-wayfinder) 在 [to-spec](https://aihero.dev/skills-to-spec) 处汇入链条、而不是把地图直接接进 `implement` 的原因。只有当这项工作最终确实不大时，才从地图直接去 `implement`。

不确定自己在哪条流程里时，[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖整套技能的导航器。
