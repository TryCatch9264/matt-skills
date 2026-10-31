## 它做什么

`implement-spec` 拿一份[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)和它的[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)，在一次运行里全部落地。负责统筹的[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)把每张工单交给在各自 git worktree 里工作的实现[子代理（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)，把每个做完的分支合并到一个**集成分支**上，对结果跑 [code-review](https://aihero.dev/skills-code-review)，然后解决这些工单。

它把工单当作**任务图**来读，不是清单。阻塞关系决定什么能开工，所以任何时刻都有一批阻塞项全部落地的**前沿**工单，前沿上的每张工单同时开跑。这就是与逐张处理工单的差别。节奏由图的结构决定，不是工单在跟踪器上的顺序。

## 什么时候用它

通过打 `/implement-spec` 调用，代理不会自己去用它。

| 你的处境 | 用 |
| --- | --- |
| 一份规格说明，已拆成带阻塞关系的工单，想在一次运行里落地 | `/implement-spec` |
| 在自己的[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)里一次一张工单，工单之间[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing) | [implement](https://aihero.dev/skills-implement) |
| 还没拆成工单的规格说明 | 先 [to-tickets](https://aihero.dev/skills-to-tickets) |
| 很小的一块工作，其实没有图 | 直接用 [implement](https://aihero.dev/skills-implement) |

## 前提条件

- **一个议题跟踪器。** 技能从 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 配置好的跟踪器上读工单，也在那里解决工单。如果没有配置过，它会停下来让你先跑那个，而不是瞎猜。
- **带阻塞关系的工单**，如 [to-tickets](https://aihero.dev/skills-to-tickets) 写出的样子。没有阻塞关系，图就是平的，所有工单同时开工。
- **一个能在后台跑子代理、并给每个子代理单独 git worktree 的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)。** 这个技能存在的意义就是同时跑工单，所以在一次只跑一个子代理的 harness 上，它只是一个更慢的 `implement`。

## 集成分支

所有东西落在一个分支上。每个实现者：

1. 开始前确认自己的 worktree 基于集成分支，
2. 用 [tdd](https://aihero.dev/skills-tdd) 构建自己的工单，一次一个红-绿切片，
3. 汇报完成之前把集成分支的最新提交合并进自己的分支，这样落地时就是快进合并。

拉取请求到底存不存在，由跟踪器决定。如果你的跟踪器通过 PR 关闭工作，或者你要求开一个，技能会在第一次合并之后开一个草稿 PR，并在结尾把它标记为可审查。否则运行停在集成分支上，每张工单都按你的跟踪器关闭工作的方式解决；对着本地 Markdown 跟踪器完全离线也能跑。

实现者通过[上下文指针（context pointer）](https://www.aihero.dev/ai-coding-dictionary/context-pointer)（规格说明、工单、共享的探索笔记、更早的提交）与统筹者沟通，而不是粘贴摘要。这样每个子代理的提示都很小，统筹者的窗口里也留出空间装这张图。

## 常见问题

**这和我自己在每张工单上跑 `/implement` 有什么不同？**

这就是这个技能存在的意义所在。在它发布之前，人们一直在自己搭类似的版本，一位用户描述过这个需求：他们想要“子代理去实现工单”，而不是“逐个创建新会话、告诉它实现某张工单，尤其当一份规格说明里有超过 5 张工单的时候”。用 `implement` 你是调度者：一张工单一个[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)，之间清空，自己记着哪些工单解除了阻塞。`implement-spec` 把这份活交给一个统筹会话。代价是你不再逐张看着工单的工作落地，而是在最后审查集成分支。开始一次运行前，清空上下文，然后打 `/implement-spec` 并带上指向规格说明的指针（议题编号或文件路径）。对没有真正图纸的小改动，跳过它，直接用 `implement`。

**它需要 GitHub 吗？我想让它在分支上就停。**

不需要，现在不用了。一位喜欢进行中版本的用户恰好提了这个抱怨：“它在最后开一个 PR，这需要 GitHub 这样的在线仓库。我希望它能离线做同样的工作，并停在所有工作都合并进去的那条分支上。”现在运行结束在集成分支上。只有当已配置的跟踪器通过 PR 关闭工作、或者你主动要求时才会开 PR，所以在本地 Markdown 跟踪器上，运行结束时所有工单都已解决、工作都已合并到分支上。

**它的审查与修复循环跑了好几个小时，或者一直在“修”还没做出来的工单。**

当 `code-review` 在技能指定的那一个点之外的地方运行时，这两种情况都会发生。它拿代码对照整份规格说明，所以只有在所有工单都落地之后才说得通。如果它在运行中途跑，每张还没做的工单都会被读成失败。代理于是去做那张工单，又触发一次审查。结尾时技能跑一次 `code-review`，把所有发现交给一个修复子代理，但它目前还没说这次修复之后什么时候停。一位用户报告了一个五张工单的功能，其中“审查与修复循环大约花了四个小时”。如果你看到第二遍大范围审查开始，就让它针对已修复的发现做聚焦检查然后停。要预期第一遍审查会找出真问题。这次运行的产出是一份待审查补全的草稿，不是能直接交付的东西。

**它会像 implement 那样驱动 tdd 吗？**

现在会，一开始不会。用进行中版本的用户注意到“实现子代理不继承 /tdd 指令”，于是一从一张工单扩到整份规格说明，红-绿就停了。现在每个实现者都用 `tdd` 构建自己的工单。仍然没有像 `implement` 会话里那样交互商定接缝的步骤，所以如果你想钉住接缝，就在规格说明或工单里点出它们。

**两个并行运行的实现者撞了同一个文件，或者给同一个东西起了不同的名字。**

worktree 不消除碰撞，只是把它们推迟到合并时。写在工单文字里的阻塞关系是对每张工单会碰哪些文件的猜测，而两张“代码库不同部分”的工单仍然共用一份消息目录、一个配置注册表或者一个类型。每个实现者只看得到自己的工单和共享笔记，从来看不到对方在做的工作，所以一位用户的网页和移动端工单把同一个东西分别叫成了 `blockedSince` 和 `blockedOn`。当两张前沿工单碰到同一个共享文件时，要么在它们之间加一条阻塞关系让它们先后跑，要么让探索笔记把每张工单要新增的确切名字定下来。

**被阻塞的工单一直不开始，即使阻塞它的已经合并了。**

这是 GitHub 上的已知问题。跟踪器的 blocked-by 计数只在阻塞项*关闭*时才下降，而工单通常在 PR 合并时关闭，也就是运行结束的时候。跟踪器是起始图的正确来源，但在运行中途是过时的来源。让统筹者自己记录哪些工单已经合并进集成分支，并据此计算前沿。

**这会取代 Sandcastle 或一个 AFK 脚本吗？**

不会。人们这么问，是因为这套技能现在伸进了实现环节：“Sandcastle 还有意义吗？你们的技能现在好像也能处理实现了。”`implement-spec` 让一个代理在一个 harness 会话内部负责统筹，不需要任何基础设施，你还能看着、还能引导。对真正 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 的工作，一个确定性的循环（[Sandcastle](https://github.com/mattpocock/sandcastle)、一个 shell 脚本、一个 CI 任务）更快、更便宜、更可靠，因为没有代理在做统筹决定。

**某张工单的关键测试在它的 worktree 里被跳过了，却报了绿。**

worktree 里只有 git 跟踪的东西。依赖被 gitignore 的测试夹具、本地数据库或凭据的测试，在那里会被静默跳过。对验证依赖未跟踪材料的工单，让统筹者在主检出目录里跑它。

## 它在生效的表现

- 只要图允许，就有几个实现者同时跑，而不是一个接一个。
- 一张工单在它最后一个阻塞项落到集成分支上时就开始，而不是等整次运行结束。
- 每张工单的轨迹都显示 `tdd` 在跑，代码之前有失败的测试。
- 合并进集成分支都是快进，不需要解冲突。
- 运行结束在一条分支上，所有工单都已解决；只有你的跟踪器需要时才有 PR。

## 它在哪里合用

`implement-spec` 是主链上的构建步骤，作为逐张跑 [implement](https://aihero.dev/skills-implement) 的并行替代：

```txt
grill-with-docs → to-spec → to-tickets → implement-spec → retro
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)，后者声明它作为任务图读取的阻塞关系；以及 [code-review](https://aihero.dev/skills-code-review)，它在收尾之前对集成分支跑它。不确定自己在哪条流程里时，[ask-matt](https://aihero.dev/skills-ask-matt) 是覆盖整套技能的导航器。
