## 它做什么

`domain-modeling` 在你做设计的同时建立并磨利项目的**通用语言（ubiquitous language）**。它质疑与术语表冲突的用词，在你用了含糊词的地方要求一个精确的词，并用具体场景检验一个关系，直到边界完全准确。

它是**主动的**那套功课，不是被动的。任何技能都能读 `GLOSSARY.md` 借用词汇。这个技能用于你正在*改变*模型的时候，所以它会打断你。它在你把术语定下来的那一刻就写进 `GLOSSARY.md`，就在对话当中，而不是最后产出一份整齐的术语表。最后写的术语表是一场[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)的摘要；就地写的那份才是会话的产出。

## 什么时候用它

打 `/domain-modeling`，或者在任务合适时由代理自动取用。实践中，自动调用是这个技能最弱的部分。当 `grill-with-docs` 或 `wayfinder` 说要加载它时，[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)常常只加载 `grilling` 而跳过它。如果一场[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)会话跑完了，而 `GLOSSARY.md` 到最后都没变，那就是发生了这件事。把它和其他技能一起按名字调用。

当出问题的是*词*时用它：

| 情形 | 做法 |
| --- | --- |
| 两个人对“取消”的理解不同 | `domain-modeling`：选定标准术语，把另一个列在 `_Avoid_` 下 |
| “account”在三个文件里干三份活 | `domain-modeling`：把它拆成 Customer 和 User |
| 你刚做了一个难以撤销的架构选择 | `domain-modeling`：如果这个选择过得了门槛，它会提议一条 ADR |
| 出问题的是模块的*形状*：接缝放在哪、接口有多深 | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你想在动工之前把整个计划盘问一遍 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它在底下驱动这个技能 |
| 你只是想查一个术语，不想改它 | 什么都不用。读 `GLOSSARY.md`。它就是一个文件。 |

## 前提条件

事前什么都不需要。技能写两个地方，两个都是按需创建：

- 仓库根目录的 **`GLOSSARY.md`**。你定下第一个术语时技能创建它。在根目录有 `GLOSSARY-MAP.md` 的仓库里，术语进地图指向的各上下文 `GLOSSARY.md`。
- **`docs/adr/`**。第一条过得了门槛的 ADR 会带着它一起创建。

开始之前不需要存在任何东西，技能也不会预先创建什么。

## 两种产物，两道门槛

术语表和 ADR 的门槛不同。这个技能的大部分麻烦来自把两者搞混。

| | `GLOSSARY.md` | `docs/adr/NNNN-slug.md` |
| --- | --- | --- |
| 装什么 | 术语。某样东西**是什么**，一两句话，被否掉的同义词列在 `_Avoid_` 下 | 一个决定，一到三句：上下文、选择、理由 |
| 写它的门槛 | 一个含糊的词变得标准 | **三条全过**：难以撤销、缺少上下文会让人意外、是真实取舍的结果 |
| 什么时候写 | 就地写，术语定下来的当下 | 提议，不假定 |
| 绝不装什么 | 实现细节、[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)、草稿纸、通用编程概念 | 这次会话每个选择的日记 |

ADR 的三道测试漏掉任何一条，就没有 ADR。容易撤销的决定反正会被撤销；不让人意外的决定没人会问；没有真正替代方案的决定，记下来的只是“我们做了显而易见的事”。

`GLOSSARY.md` 那条规则最要紧，因为它是实践中被破坏的那一条。**它就是一份术语表，仅此而已。** 不加约束的话，模型会把“写进 `GLOSSARY.md`”当成把你说过的每个答案都存下来的许可，文件就变成一份不断生长的规格说明。这是关于这个技能被报告最多的问题，横跨多个模型。

## 交叉核对，以及它到哪里为止

你说明某样东西怎么运作时，技能去核对代码，并把矛盾点出来。*“你的代码取消的是整个 Order，但你刚说部分取消是可能的，哪个对？”* 技能让语言和代码在改变任何一方之前先公开地取得一致。

它交叉核对的只有**代码**、已提交的 `GLOSSARY.md` 和 ADR，别的都不看。它不搜你的议题跟踪器。如果你们团队几个月前在一条已关闭的议题里争过某个命名冲突并定了下来，技能还会把它当新问题再提一遍。有一个[未实现的请求](https://github.com/mattpocock/skills/issues/717)要修这一点。在那之前，变通办法是把这条指令写进你自己的 `docs/agents/domain.md`，那些技能本来就会读它。

## 常见问题

**我的 `GLOSSARY.md` 有 500 行。1000 行。3000 行。怎么办？**
大小是症状。原因是这个文件收进了从来不属于术语表的实现细节和决定。修法是一条直接指令：`/grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`。对着膨胀的文件跑一遍，大部分内容就没了。只有当文件变精炼、却仍然覆盖两个读者不愿同时握住的领域时，才用 `GLOSSARY-MAP.md` 拆它。拆一个膨胀的文件，你得到几个膨胀的文件。技能在这方面的指引还不够强，防不住它一开始的长大，相关议题仍未关闭。

**为什么是 `GLOSSARY.md` 而不是 `CONTEXT.md`？**
1.3.0 之前是 `CONTEXT.md`（以及 `CONTEXT-MAP.md`）。这个文件是术语表，仅此而已，所以 `GLOSSARY.md` 这个名字就说明了这一点；而且正如一位读者说的，“对 AI 代理来说，一切都是[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)”。如果你的仓库里还有 `CONTEXT.md`，重跑 `/setup-matt-pocock-skills`：它会提议用 `git mv` 改名，并更新 `docs/agents/domain.md`。这套技能里每个技能都找 `GLOSSARY.md`，所以保留旧名字意味着要逐个给它们打补丁。

**`/ubiquitous-language` 去哪了？**
它被移除了，而且不是弃用。它的职责并进了 `domain-modeling`，后者持续维护整个模型，而不是从一场对话里导出术语表就完。词汇约束现在更重要了，不是更不重要。它跑在拷问、分诊和画地图底下，而不是作为一趟你得记着单独做的工序。

**我怎么给一个没有术语表的代码库弄一份？**
明确地要，而不是等它自己积累。`/grill-with-docs help me scaffold my existing repo with a GLOSSARY.md` 是有记录的做法。预期一场很长的盘问。一位用户报告在文件成形之前问了 50 多个问题。顺手用的话，在存量仓库上建立术语表慢得太多。

**我能保留领域模型，但用我自己的 ADR 格式吗？**
目前不能干净地做到。术语表那一半和 ADR 那一半装在同一个技能里，所以一个有既定 ADR 约定的团队（不同模板、不同位置、不同命名）会拿到与自己家风格冲突的指令。当前的选择是本地复制技能并改它，或者在你仓库自己的代理文档里覆盖 ADR 约定。把两者拆开是一个[未实现的请求](https://github.com/mattpocock/skills/issues/557)。

**术语表真的值回成本吗？它是又一份要审的东西，还可能过时。**
有时确实不值。DDD 越靠近实现就越不管用。回报在上游，在命名和概念对齐上，不在聚合根和分层仪式上。同义词控制在命名边界上要紧：模块名、表名、状态枚举、议题标题、命令行命令。在普通行文里要紧得多。还有一种反对意见：领域术语压缩的是*人与人之间*本来共享它们的沟通，而代理对白话描述的反应是一样的。按这种读法，术语表的价值是让你和你的审查者跟代理在做的事保持一致，而不是让代理更强。一天的构建上，跳过它。而且一份没人审过、由代理写的术语表比没有更糟：它塞满自信的断言，之后的会话会当真。

**它能替我把含糊的提示变成领域语言吗？**
不能，也没有这个计划。你自己都不理解的领域语言，写下来也没有意义。这个技能在你已经理解之后强制精确；它不为你发明你没有的词汇。相关的陷阱是用了领域词却没做建模。正确的名词配在错误的概念上，产出的东西读起来对，但其实不对。

## 它在生效的表现

- 它会打断你半句话，问你说的是两者中的哪一个，而不是挑一个继续。
- `GLOSSARY.md` 在对话*过程中*变，而不是结尾来一波。
- 它拒绝为一件你明天就可能撤销的事写 ADR，并说出三道测试里哪一条没过。
- 新条目用一两句话说明某样东西*是什么*，并在 `_Avoid_` 下点出你放弃的那些词。
- 当你的代码和你的说法不一致时，它把你的代码引用回来给你看。
- `GLOSSARY.md` 变短的次数和变长一样多。

## 它在哪里合用

`domain-modeling` 是一个**模型调用的参考**，跑在其他技能*底下*的时候比单独跑的时候多。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 在拷问会话里驱动它，[wayfinder](https://aihero.dev/skills-wayfinder) 在画地图时加载它，[triage](https://aihero.dev/skills-triage) 用它让[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)保持项目自己的说法，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在决定落定时调用它。最亲近的兄弟是 [codebase-design](https://aihero.dev/skills-codebase-design)。两者合起来是其他一切底下的词汇层，这个管*领域*，那个管模块的*形状*。它也可以直接调用，当你想只做这套功课、而不去走本来会加载它的那个技能的各个步骤时。不确定哪个技能合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
