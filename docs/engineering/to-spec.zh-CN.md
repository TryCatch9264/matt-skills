## 它做什么

`to-spec` 把你刚做完的那场对话变成一份**[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)**，并作为单条议题发布到你的议题跟踪器。

它不访谈你。当你用它的时候，决定已经做完了。所以它综合已知的东西（对话线索、代码库、你的 `GLOSSARY.md` 和 ADR），不再开一轮新问题。规格说明记录你已做的决定。它不是做新决定的地方。

## 什么时候用它

通过打 `/to-spec` 调用；[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会自己去用它。

当这次构建大到一次代理[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)装不下、必须拆到多次会话时用它。触发条件就这一条：

| 你在哪 | 跑什么 |
| --- | --- |
| 什么都还没定 | 先 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 已定，工作能装进一个[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window) | [implement](https://aihero.dev/skills-implement)：跳过规格说明 |
| 已定，工作横跨多次会话 | `/to-spec`，然后 [to-tickets](https://aihero.dev/skills-to-tickets) |
| [wayfinder](https://aihero.dev/skills-wayfinder) 的地图已经清晰 | `/to-spec #<map_issue>` |

## 前提条件

`to-spec` 把规格说明作为议题发布，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为本仓库配置好跟踪器和分诊标签词表。两种跟踪器都行：GitHub 这样的真实跟踪器，或者 `.scratch/` 下的本地 Markdown 文件，后者不需要额外配置。

## 规格说明是一份决定记录

规格说明存在的原因是上下文窗口会结束。你在[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)过程中定下了很多东西：方案的形态、争论过的取舍、以及你有意拒绝的东西。所有这一切都在一场你即将清掉的对话里。规格说明把它们留住。

所以规格说明不验证也不决定任何东西。它用你项目自己的词汇记录你已做的决定，好让一个新会话能接手这项工作，而不必你再解释一遍。如果规格说明写了你没说过的东西，那就是缺陷。

## 先定接缝，再写正文

动笔之前，`to-spec` 先勾出这个功能将在哪些**接缝**上测试，并和你确认。它优先复用已有接缝而不是新增，并选它所能做到的最高接缝。一个改动的理想接缝数量是一。

其他技能之后会用到这些商定的接缝。[tdd](https://aihero.dev/skills-tdd) 只在事先商定的接缝上工作。[code-review](https://aihero.dev/skills-code-review) 对照规格说明审查 diff，所以一个没人商定过的接缝会变成一条审查发现。这两个连接都经过这份文档。这就是为什么接缝那场对话要在这里认真做，不要留到实现阶段。

## 常见问题

**`/to-prd` 去哪了？**
就是这个技能，v1.1 改的名。“规格说明（spec）”现在是贯穿全篇的唯一说法，旧的 `to-prd` slug 不再可用，所以按新名字重装。旧词汇由*规格说明*和*工单*这一对取代。规格说明是目的地以及把它固定下来的那些决定。[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)是抵达那里的步骤。如果你改变方向，删掉没做完的工单，保留规格说明。

**为什么规格说明也拿 `ready-for-agent` 标签？我不想让代理照着它去实现。**
这个标签的意思是“不需要再分诊了”：文档足够完整，代理可以据此工作。它标记的是一个输入，不是一张工作单。但轮询 `ready-for-agent` 的 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 代理看不出这个区别。它们会试图在一次运行里把整份规格说明建出来，而不是去领那些工单切片。这是关于这个技能被报告最多的问题。在它改变之前，要么在 AFK 代理的提示里明确排除父级规格说明，要么在 `/to-tickets` 跑完之后把标签去掉。

**为什么不能从拷问直接去 `/to-tickets`，跳过规格说明？**
很多时候就该这样。规格说明只在跨多次会话的工作里值得占用那一步。它的价值在于工单是一次性的，而规格说明不是。每个工单的大小为一个全新的上下文窗口设计，之后被删除或关闭；规格说明留着，作为记录它们背后推理的唯一地方。对单次会话的改动，这什么也给不了你，你还要多付一步综合，而这一步里[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)可能跑偏。从拷问直接去 `/implement`。

**我刚做完一张 wayfinder 地图。该喂给它什么？**
给它地图主议题，`/to-spec #<map_issue>`，不是那些单张的决策工单。[wayfinder](https://aihero.dev/skills-wayfinder) 产出的决定散布在一张地图上，而不是交付物。`to-spec` 把它们收拢成一份可执行的文档。如果把地图直接接进 `/implement`，你就丢掉了这一步。

**规格说明是给我审的，还是只给代理看的？**
主要给代理，读起来也是这样：完整、密集、满是引用。你自己读接缝和“不在范围内”两节。在这两处，一个错误的决定现在最容易抓住，以后最难发现。确实有人抱怨要读整份，而且没有摘要模式。但如果规格说明让你意外，说明拷问太浅，不是规格说明太长。

**工单开始之后，我要把规格说明冻住，还是让代理改写它？**
没有任何机制让它保持同步。实践中它是你在那一刻所知的一个快照，实现一教你新东西它就过时了。工作交付之后就把它当一次性材料。你的 `GLOSSARY.md` 和 ADR 才是打算长期存在的文件。如果实现过程中学到应该长期保留的东西，放那里，不要放在改过的规格说明里。

**我的工作是重构或模块边界，不是功能。模板合适吗？**
不太合适，这是已知的局限。模板很依赖用户故事，而用户故事不适合架构工作。你最后会围绕其实是接口和不变量问题的决定，写一堆没人要过的故事。改用“实现决定”和“测试决定”两节。把长期有效的架构决定通过 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 记成 ADR，而不是写在规格说明里。

**它会去跟踪器里查相关工作，或者引用它遵守的 ADR 吗？**
两者都不会。它会读并遵守它改动范围的 ADR，但不链接它们。它写之前也不在跟踪器里搜重叠的议题，所以一份规格说明可能重复别人已经提过的工作，而且不会有任何提醒。如果这个范围很热，先自己搜一遍跟踪器。

**`/to-tickets` 读不了我的规格说明：它一直截断。**
议题跟踪器可能无法完整返回一份很大的规格说明，而本地没有副本可以替代。修法是：`/to-spec` 和 `/to-tickets` 之间不要[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing)或[压缩（compact）](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个窗口里跑它们，`/to-tickets` 就不必再去取那份规格说明。

## 它在生效的表现

- 它动手写，而不是又问你一轮新问题。
- 写之前先给你看接缝，并且尽可能少地提出接缝。
- 它用你项目的名词，不用通用的产品管理套话。
- 里面每个决定你都记得自己做过。它没有为了填满某一节而编东西。
- “不在范围内”一节列的是真东西。你拒绝的那些通常是这一页上最有用的几行。

## 它在哪里合用

`to-spec` 是主构建链上的一个步骤，但只在跨多次会话的那条分支上：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

上游，[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 做出那些这个技能只负责记录的决定；一张做完的 [wayfinder](https://aihero.dev/skills-wayfinder) 地图也从这里接入链条。下游，[to-tickets](https://aihero.dev/skills-to-tickets) 把规格说明切成曳光弹工单，交给 [implement](https://aihero.dev/skills-implement) 构建。不确定哪个技能或流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
