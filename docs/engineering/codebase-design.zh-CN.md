## 它做什么

`codebase-design` 固定你设计模块时用的词：**模块**、**接口**、**深度**、**接缝**、**适配器**、**杠杆**、**局部性**。它精确地定义每一个，禁掉含义松散的替代说法（“组件”“服务”“API”“边界”），并陈述由此推出的几条原则。

它是参考，不是流程。它不跑循环，不产出产物，从不停下来问你问题。所有涉及设计的其他技能都用它的词汇。单独用时，它给你这些词然后停。调用之前先知道这一点。如果你把一个[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)指向一个既没有流程也没有停止规则的技能，还说“开始”，代理就会自己发明一个流程。下面的问答展示了那是什么样子。

## 什么时候用它

打 `/codebase-design`，或者在设计任务合适时由代理自动取用。

当你知道自己要重新设计哪段代码，需要思考它的形状时用它：接缝放在哪、接口能缩到多小、某次提取是否真的把复杂度从调用方移走。也可以用它来定下关于某个设计词含义的争论。

有几个技能和它很近。按你手上的问题来挑：

| 问题 | 技能 |
|---|---|
| 一个模块的形状：它的接口、接缝、深度 | `codebase-design` |
| *领域的词*：“account” 指三样东西，两个人对“取消”的理解不同 | [domain-modeling](https://aihero.dev/skills-domain-modeling) |
| 你还不知道要重新设计*哪个*模块 | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)（找出候选的勘察） |
| 你想让设计被辩一辩，而不只是被起个名字 | [grilling](https://aihero.dev/skills-grilling) |
| 有一个具体行为要建，你想要经得住重构的测试 | [tdd](https://aihero.dev/skills-tdd) |

## 词汇

术语表就是这个技能。技能用各个术语相互定义，并给出每个术语所取代的那个词。

| 术语 | 它是什么意思 | 不要说 |
|---|---|---|
| **模块（Module）** | 任何同时具有接口和实现的东西。有意与规模无关：一个函数、一个类、一个包、一个横跨多层的切片。 | 单元、组件、服务 |
| **接口（Interface）** | 调用方为了正确使用它必须知道的一切：类型签名，加上不变量、顺序约束、错误模式、必要的配置、性能特征。 | API、签名 |
| **深度（Depth）** | 接口处的杠杆：调用方或测试每学习一单位接口所能行使多少行为。**深**：大量行为在小接口后面。**浅**：接口几乎和实现一样复杂。 | 无 |
| **接缝（Seam）** | Michael Feathers 的术语：一个可以在不改动该处代码的情况下改变行为的地方。它是接口的*位置*，而放在哪里本身是个决定，与它后面放什么无关。 | 边界 |
| **适配器（Adapter）** | 在接缝处满足某个接口的具体东西。它命名的是一种角色，不是一类东西：一个内存中的假实现和一个 Postgres 仓储都是适配器。 | 无 |
| **杠杆（Leverage）** | 调用方从深度中得到的东西：每学习一单位接口换来更多能力。 | 无 |
| **局部性（Locality）** | 维护者从深度中得到的东西：改动、缺陷和验证留在一处，所以一次修复覆盖所有调用方。 | 无 |

技能*不*把深度定义为实现行数与接口行数的比值，那是 Ousterhout 自己的定义。那个指标会奖励往实现里掺水，所以技能改用“深度即杠杆”。

## 四条原则

- **深度是接口的属性，不是实现的属性。** 一个深模块内部可以由小的可替换部件构成。调用方只是看不到它们。模块可以有它自己测试用的内部接缝，以及接口处的一个外部接缝。
- **删除测试。** 设想把这个模块删掉。复杂度消失了，说明它只是个通道。复杂度在 N 个调用方上重新出现，说明它在藏真实的复杂度。
- **接口就是测试面。** 调用方和测试穿过同一个接缝。如果你想*绕过*接口去测试，模块的形状就不对。
- **一个适配器意味着假想的接缝，两个适配器才意味着真实的接缝。** 除非确实有东西在接缝两侧变化，否则不要切出接缝。只有单个适配器的接缝只是多绕了一层。

两份辅助文件走得更远，技能按需读它们，而不是一开始就读。[DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md) 把候选的依赖分成四类（进程内、有本地替代品、远程但自有、真正的外部），因为类别决定你怎么跨接缝测试加深后的模块。[DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) 启动并行的[子代理（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)，为同一个模块产出三个或更多截然不同的接口，然后按深度、局部性和接缝位置比较它们。

## 常见问题

**我怎么在 TypeScript 里真正建出一个深模块？**

这是关于这个技能被问得最多的问题，而技能不回答它。它定义深模块*是什么*；它对怎么阻止一个乱来的 import 绕过接口只字未提。[议题 #458](https://github.com/mattpocock/skills/issues/458) 说得很直白：“假设我们对接口满意，它藏住了细节等等。但我们怎么强制它？我认为没有 lint 或清晰的护栏，人和 LLM 都会随着时间把它弄乱。”那个线索里的答案给了三个选项：把它包进一个类或 IIFE，并接受这个类变得庞大；把它做成单体仓库里的一个包，并接受单体仓库的工具链；或者用像 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 这样的 linter 禁止绕过接口的 import。这些机制里，Effect 最好，dependency-cruiser 次之。仓库的 `in-progress/` 分组里有一个 `setup-ts-deep-modules` 技能，立下 `src/packages/<name>/index.ts` 的约定，但它是测试通道的技能，没有文档页，也不带任何 lint 规则。

**我让一个会话用它，它烧了 100k [词元（token）](https://www.aihero.dev/ai-coding-dictionary/token)去重新设计我根本没问过的东西。**

这是已知问题，记为[议题 #449](https://github.com/mattpocock/skills/issues/449)。技能是模型调用的，并自称是词汇，但里面没有任何东西硬性阻止代理把它当成可运行的流程。被交代“在 /codebase-design 里继续并推进那些待定决定”之后，代理挑了技能里最像流程的部分：`DESIGN-IT-TWICE.md` 里的并行子代理。它重新探索了上一场会话已经梳理过的代码，跑了很久才问事情。这个技能没有驱动器类技能的那些护栏（检查点、一次一个问题、不自动推进），因为它是参考。变通办法是调用一个驱动器技能（`/grill-with-docs`、`/improve-codebase-architecture` 或 `/tdd`），把 `codebase-design` 当它们的词汇用。议题仍未关闭。

**`design-an-interface` 去哪了？有 `/interface-design` 技能吗？**

这个技能取代了 `design-an-interface` 并接手了它的内容。没有东西缺失。它的“设计两次”手法（并行子代理产出截然不同的设计，来自 Ousterhout）在这里作为 `DESIGN-IT-TWICE.md` 发布。另外，有几个人要一个专门的 `/interface-design` 技能来承载深模块／薄接口那套理念；这个技能已经覆盖了那套理念，没有计划单独再出一个。如果你在找这两个名字中的任何一个，就是这一页。

**这不就是一套文件结构约定吗，比如文件夹、barrel 文件、功能切片？**

不是。人们就此顶回来很多次，技能没有变。[议题 #95](https://github.com/mattpocock/skills/issues/95) 提议用一套形式化的分形树文件结构作为深模块的具体实现；回复是两者相互独立：“深模块关乎接口的设计和通过严格接口访问，不管文件系统长什么样。用这种办法你完全可能得到浅模块。”同样的话在 #458 里也出现过：“我觉得你可能把模块的概念和文件系统绑得太紧了。文件系统当然可以作为模块形状的有用提示，但构造深模块没必要用文件系统。”术语表有意把**模块**定义成与规模无关。

**`tdd` 真的用这套词汇吗？**

现在用，但很长一段时间不用。v1.0 把内联的深模块说明从 `tdd` 里移走，改用这个共享技能，但没人加上指针来替代它们，于是 `tdd` 自己定义了“接缝”，什么也没引用。指针现在在 `tdd` 里了，当悬而未决的问题是接口的形状而不是测试时，代理会顺着它走。`tdd` 仍然拥有“接缝”作为你用来*测试*的边界；这个技能拥有它背后的模块形状。

**设计两次这个手法在 Claude Code 之外能用吗？**

不能干净地用。`DESIGN-IT-TWICE.md` 说“用 Agent 工具并行派 3 个以上子代理”，而“Agent”是 Claude Code 一个[工具（tool）](https://www.aihero.dev/ai-coding-dictionary/tool)的名字。仓库为包括 Codex 在内的其他 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 提供了元数据，而那些可能没有叫这个名字的工具。所以并行设计那一步，比技能的元数据所暗示的要难移植。[议题 #564](https://github.com/mattpocock/skills/issues/564) 在跟踪这一点，仍未关闭。

**我能往术语表里加自己的概念吗，比如共生性（connascence）、模块秘密、[渐进披露（progressive disclosure）](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)？**

人们提过这些。[议题 #180](https://github.com/mattpocock/skills/issues/180) 加上 Parnas 的模块秘密和 Page-Jones 的共生性，作为命名层，说明*什么*在跨接缝泄漏，还附了可用的 diff；[议题 #303](https://github.com/mattpocock/skills/issues/303) 提议在实现内部做渐进披露，让一个在公开接口处很深的模块内部也有结构。两者都未关闭、未合并。已发布的术语表有意保持小，技能自己给出了理由：语言一致本身就是目的，而一个没人一致使用的术语比没有术语更糟。

## 它在生效的表现

- 设计对话不再产出“组件”“服务”“边界”这些词，开始产出“模块”“接口”“接缝”。
- 有人能指着一个提议中的提取，明确说出它是否通过删除测试，不含糊。
- 一个提议的接缝会配上第二个被点名的适配器，而不只是第一个。
- 接口的讨论覆盖不变量、顺序和错误模式，而不只是类型签名。
- 调用它不会开启一场会话。如果代理开始只凭 `/codebase-design` 读文件、提重构，那它把参考当成驱动器了。

## 它在哪里合用

`codebase-design` 是一个**随时可用的独立技能**，是工程技能底下的词汇层，而不是任何链条里的一步。最亲近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)，那条平行的参考，管的是*问题领域*的词而不是模块的形状。通常两者会一起要，因为给一个深模块起好名字两者都需要。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是另一个：它扫描代码库找加深候选，并用这份术语表写每一个候选，所以它找到模块，你在这个技能的词汇里设计它。不确定哪个技能或流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
