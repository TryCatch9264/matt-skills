## 它做什么

`to-tickets` 拿一份计划、一份[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)，或者你正处的这场对话，把它拆成议题跟踪器上的一组[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)。每张工单声明自己的**阻塞关系**：必须先完成才能开工的其他工单。

每张工单都是**曳光弹**：一次改动穿过所有层次（数据库结构、API、界面、测试）的窄而完整的路径，一落地就可以单独演示。这就是这个技能与那片显而易见的切分方式的不同之处：后者一次切一层，最后再集成。它还把每张工单的大小控制在一个全新[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)装得下，因为接手工单的是一场从没看过你规格说明的[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)。

## 什么时候用它

通过打 `/to-tickets` 调用。[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会自己去用它。

| 你在哪 | 跑什么 |
| --- | --- |
| 你有一条规格说明议题，而构建跨多次会话 | `/to-tickets`，或者 `/to-tickets #<spec_issue>` |
| 计划只在对话里，从没写下来 | `/to-tickets` 直接读那条线程，不需要规格说明 |
| 整个改动装得进一个上下文窗口 | [implement](https://aihero.dev/skills-implement)，跳过工单 |
| 什么都还没定 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，然后 [to-spec](https://aihero.dev/skills-to-spec) |
| 一张 [wayfinder](https://aihero.dev/skills-wayfinder) 地图已经清晰 | 先 [to-spec](https://aihero.dev/skills-to-spec) 收拢地图，再 `/to-tickets` |

`to-tickets` 产出的工单从构造上就是代理可开工的。不要对它们跑 [triage](https://aihero.dev/skills-triage)。分诊是给从别人那里来的工作用的。

## 前提条件

`to-tickets` 发布到跟踪器，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须已为本仓库配置好一个，连同分诊标签词表。两种都行：GitHub 或 Linear 这样的真实跟踪器，或者 `.scratch/` 下的本地 Markdown 文件，后者不需要额外配置。

## 曳光弹，不是分层

**横向**切片交付改动的一层。每一层都落地之前什么都不管用，而每张工单的验收标准不得不伸进另一张工单拥有的工作里。**纵向**切片（曳光弹）一次交付穿过所有层的一条细路径，所以它能单独验证，并且拥有它评判的一切。

这是人们最常破坏的规则。有一个团队跑过一叠 26 张按层切分的工单（语料、生产者、聚合器、选择器），结果每关一张工单大约要跑二十次代理，其中约四分之三返工。他们自己的事后复盘把每一类失败都追回到横向切分，而不是实现本身。

发布任何东西之前发生两件事。`to-tickets` 找前置重构（那个原则：“先把改动变容易，再做容易的改动”），把那部分排在最前。然后它把拆分作为编号列表呈现给你并提问：粒度对吗、阻塞关系是真的吗、有没有该合并或拆开的。你认可之前什么都进不了跟踪器，那次提问就是你顶回去的地方。

## 阻塞关系

阻塞关系是这个产物的要点。它们以两种方式工作，取决于跟踪器：

| 跟踪器 | 阻塞关系住在哪 | 你怎么推进 |
| --- | --- | --- |
| 本地 Markdown | `.scratch/<feature>/issues/<NN>-<slug>.md` 下一个工单一个文件里的文字，按阻塞者在前编号 | 从上到下，手工 |
| 真实跟踪器（GitHub、Linear） | 原生阻塞链接，或者跟踪器支持的话用子议题 | 任何阻塞项已完成的工单都在**前沿**上，可以被领取 |

阻塞关系在两种情况下都在工单里。跟踪器只决定有没有东西能并行地依据它们行动。`to-tickets` 产出产物；把它跑起来（一次一个会话，或者一队会话）是你的活，不是技能的。

## 大范围重构的例外

有一种形态打破曳光弹规则。**大范围重构**指一次机械改动（重命名一列、改一个共享符号的类型），它的**影响面**覆盖整个代码库。一次编辑弄坏上千个调用点，所以没有任何纵向切片能保持通过。

`to-tickets` 改为按**先扩展、后收缩**来安排顺序：

- **扩展**：在旧形式旁边加上新形式，什么都不弄坏。
- **迁移**：按影响面分批把调用点搬过去（按包、按目录），一批一张工单，都阻塞于扩展那一步。旧形式还在，CI 保持通过。
- **收缩**：在没有调用方剩余之后删掉旧形式，这个工单阻塞于所有迁移批次。

如果连各批次单独也保持不了通过，它们就共用一个集成分支，并且全部阻塞一条最终的集成验证工单。CI 只需要在那张工单处是绿的。

## 常见问题

**它为一个三行的改动产出了十二张工单。**
过度拆分是关于这个技能被报告最多的问题，很多用户都遇到。还是模型（model）默认切成原子单元，丢掉了让它们有意义的分组。提问那一步就是你修这个的地方。让它合并工单，它就会合并。也有一个下限：整个改动装得进一个上下文窗口时，你根本不需要这个技能。直接去 [implement](https://aihero.dev/skills-implement)。

**工单变成一层一张：数据库结构全在一张，API 全在另一张。**
这正是纵向切片规则要防的失败，而技能有时还是产出它。在提问那一步，对每张工单问一个问题抓住它：这张做完我能演示什么？答不上来的就是横向切片。有人给每张工单加一行“演示路径”，并报告说这能把模型推向纵向切片。

**在 GitHub 上，工单没有作为规格说明议题的子议题创建。**
这个在十来次运行、多个模型上被报告过，[最完整的记录在议题 #554](https://github.com/mattpocock/skills/issues/554)。已修：`to-tickets` 现在把每张工单设为其源议题的子议题，GitHub 跟踪器模板给出了命令（`gh issue create --parent <n>`，`gh` 2.94+）。重跑 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 来刷新旧的 `docs/agents/issue-tracker.md`。

**“Blocked by”被写进了议题正文，而不是真正的阻塞链接。**
这是同一类问题，[在议题 #513 里被报告](https://github.com/mattpocock/skills/issues/513)，那位代理甚至声称 GitHub 根本没有原生阻塞关系。有的：`gh issue create --blocked-by 12,15`。因为技能先发布阻塞者，它们的编号在创建时总是可用的。正文文字本该是给没有原生阻塞关系的跟踪器用的退路，不是默认做法。工单模板现在在阻塞关系是原生的时候省略 `## Blocked by`。

**本地工单放在哪？v1.1 的说明说的是根目录的 `tickets.md`。**
确实说过，而那是个缺陷。单个共享文件在并行代理写入时也会造成竞态。本地模式现在改为在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下一个工单一个文件，按依赖顺序，与本地跟踪器模板已经描述的布局一致。`NN` 前缀是真实的工单 ID，所以 `/implement 03` 能用，而不必重打一长串标题。

**它读我的规格说明时一直截断。**
一份非常大的规格说明可能超出议题跟踪器能干净返回的限度。没有本地副本可以退回去用，于是代理不断花[工具调用（tool call）](https://www.aihero.dev/ai-coding-dictionary/tool-call)去取片段，永远到不了结尾。`/to-spec` 和 `/to-tickets` 之间不要[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing)或[压缩（compact）](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个上下文窗口里跑它们，代理就不必再把规格说明取回来。

**验收标准什么都没评判：有些在任何工作开始之前就通过了。**
模板要求写标准，却不说它们能不能失败，于是这种情况会发生。三种形态反复出现：一条在基准提交上就已经成立的标准、一条只有别的工单的工作才能满足的标准，以及一条只是复述请求而不从产物推导的标准。纵向切片能防住大部分，因为交付新行为的切片在基准提交上由构造方式就会失败。这一步仍然值得手工做。对每条标准，说出能显示它为假的观察，并确认它在实现者起步的那个提交上是失败的。

**工单发布好了。我实际上怎么跑它们？**
技能停在产物，没有自动派发模式。派发是手工的：看看板，数出没有未关闭阻塞项的工单，然后开那么多代理会话。给每张工单一个新的上下文，之间清空。[implement](https://aihero.dev/skills-implement) 结束时并不能可靠地关闭或勾掉工单，无论 GitHub 上还是本地 Markdown 里都是，所以工单状态你自己更新。

## 它在生效的表现

- 每张工单都能回答“这张做完我能演示什么？”，而答案是行为，不是某一层。
- 列表在发布任何东西之前先编号呈给你，每张带一行“阻塞于”。
- 最上面那张没有阻塞项，可以立刻开工。
- 工单正文里没有文件路径或行号，除了原型产出的片段。
- 每张工单读起来像一件新会话能在你不在场时完成的活。
- 前置重构（如果找到了）排在顺序最前，而不是混进功能工单里。

## 它在哪里合用

`to-tickets` 是主构建链上的一步：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

上游是 [to-spec](https://aihero.dev/skills-to-spec)，它把一份定好的规格说明交给你来切。两者保持在同一个上下文窗口里，之间不要清空。下游是 [implement](https://aihero.dev/skills-implement)，它每个新会话构建一张工单，用 [tdd](https://aihero.dev/skills-tdd) 处理测试，用 [code-review](https://aihero.dev/skills-code-review) 收尾。[implement-spec](https://aihero.dev/skills-implement-spec) 是另一条下行路线：它把相同的阻塞关系读作任务图，并在一条集成分支上并行构建每张就绪工单。不确定哪个技能或流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
