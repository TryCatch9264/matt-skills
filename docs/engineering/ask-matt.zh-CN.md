## 它做什么

`ask-matt` 是本仓库技能的导航器。你描述自己的处境（一个开不了头的想法、一堆涌来的缺陷报告、一场跑得太长的[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)），它点出合适的技能或技能序列，以及那个序列里需要人做决定的地方在哪里。

它只推荐，然后停。它不拷问、不写[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)、不开文件、也不触发它刚点名的技能；你拿回来的是下一句该打的东西，由你打出去。它还是本仓库技能的一份手绘地图，而不是对你装了什么的扫描，所以它不会带你越过你自己的技能或别人的技能。

## 什么时候用它

通过打 `/ask-matt` 调用；代理不会自己去用它。

| 你的处境 | 导航器给你什么 |
| --- | --- |
| 有个想法，但不知道从哪开始 | 主流程的头部，以及这次构建小到能否跳过规格说明 |
| 缺陷和需求从别人那里涌来 | [triage](https://aihero.dev/skills-triage) 这个入口，以及为什么你自己生成的[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)不该走它 |
| 两个技能看起来可以互换 | 它们之间的分界，而这通常是一条具体的判据，不是口味问题。[grill-me](https://aihero.dev/skills-grill-me) 还是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 取决于你在不在工作目录里；[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 还是 [wayfinder](https://aihero.dev/skills-wayfinder) 取决于这项工作一次会话装不装得下 |
| 会话很长，要就[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)做个决定 | 阶段边界上五个选项的有序判断树 |
| 你已经挑好技能 | 没什么有用的。直接调用那个技能。 |

## 前提条件

导航器点名技能，不安装它们。它指向的一切都得装着，建议才可执行，而它只认识本仓库里已收录的技能。

依赖跟踪器的那些路线（分诊、`to-spec`、`to-tickets`、`implement`）假定 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 已经在仓库里配好了议题跟踪器。即使还没配，导航器也会推荐它们。

## 流程，不是技能

这个技能的领头词是**流程**，一条*穿过*技能的路径，而不是单个技能。你说出自己的处境，导航器把你放到某条流程的某一步上。那与“这是匹配你关键词的技能”是不同的回答。路线有五类，技能自身完整描述了它们：

- **主流程**，从想法到交付。拷问、规格说明、工单、实现（一次一张工单，或者用 [implement-spec](https://aihero.dev/skills-implement-spec) 并行做整个任务图）、审查，然后 [retro](https://aihero.dev/skills-retro)，它把这次构建教给的东西回馈进代理的环境。它有两个分支。一个是原型绕道，用于某个问题需要可运行的代码才能定下来时。另一个是规格说明与工单的拆分，只有当构建横跨多次会话时才值回成本。
- **入口**，针对那种先产生工作、再汇入主流程的处境：涌来的缺陷报告、有东西坏了，或者一项太模糊太大、一次会话握不住的工作。
- **代码库健康**，维护而不是功能开发。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 扫描代码寻找加深机会，每找到一个就作为一个想法重新进入主流程。
- **独立技能**，在所有流程之外，你自己单独用：原型、问卷、研究。
- **底下的词汇层**，两个参考，在其他技能遇到问题在词而不在过程时被拉进来。

## 阶段边界

技能的另一个关键想法是**阶段边界**。阶段是会话里的一个工作块（[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)、实现、QA），而两个阶段之间的边界是“这份上下文我该怎么处理”这个问题唯一该出场的地方。阶段中途没什么可决定：继续，或者把剩下的拆给[子代理（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)。

| 选项 | 什么时候用 |
| --- | --- |
| **继续** | 下一阶段需要这一阶段的原文，或者你还剩 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)。它是唯一让会话保持为[一手来源（primary source）](https://www.aihero.dev/ai-coding-dictionary/primary-source)的做法，所以先把它排除掉 |
| **`/clear`** | 你身后的一切都可以丢。最便宜的选项，而如果你判断错了，就撤不回来 |
| **[handoff](https://aihero.dev/skills-handoff)** | 有东西必须移动：新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、新目录、同事、在阶段中途分出去的支线任务 |
| **子代理** | 任务界定得够紧，能在你[离开键盘](https://www.aihero.dev/ai-coding-dictionary/afk)时跑 |
| **`/compact`** | 上面都不是。它是默认选项，判断树常常落在这里 |

人们常把其中两个搞错，所以导航器给的是顺序而不只是清单。`/handoff` 看起来是在上下文窗口之间搬家的通用办法，但不是。它给你的只是可携性。`/compact` 是判断树里的最后一个选项，不是第一个，因为它上面的四个选项每个都更便宜或更精确。

## 常见问题

**是不是就有一份按正确顺序排好的技能清单？**

人们一直在 README 里要。这个技能就是那份清单。一张静态表格会说 `wayfinder → to-spec → to-tickets → implement → code-review → retro`，而在多数情况下都是错的。要紧的是那些分支：有没有代码库、构建是否跨会话、说话能不能定下这个问题。代价是导航器靠手工维护，所以落后于仓库。`/grilling` 发布很久之后导航器才写到它。

**它告诉我一半技能没安装。**

这是一个已知缺陷，没修。导航器带你走的技能多数设了 `disable-model-invocation: true`，这意味着 harness 把它们从注入代理上下文的技能列表里漏掉了。代理把那个列表当成穷尽的，于是报告它们缺失。有一份报告描述它在一次会话里宣称整条规格说明加工单的流程都不存在，改道去裸的 `/grilling` 和 `/tdd`。插件二十七个技能里有十六个带这个标记，所以这是常见情况而不是边缘情况。它们是装着的。照样打那条斜杠命令，或者查 `.claude-plugin/plugin.json`，那才是现有内容的权威。

**它描述了一个技能的行为，而那个技能并不那样做。**

这也是一个真实缺陷，也没修。导航器凭自己对每个技能的一行摘要来回答，而不是去读那个技能。有一份详细报告在一次会话里追到三处，其中一条建议让你跳过 [to-spec](https://aihero.dev/skills-to-spec)，依据只是“把线程变成规格说明”这行摘要。导航器从没打开过 `to-spec/SKILL.md`。每一次它都是等用户顶回去之后才核对，从不主动核对。那里跳过 `to-spec` 真的丢了一次接缝检查，出来的工单少算了工作量。当导航器对另一个技能做出你会据此行动的陈述时，先让它打开那个 `SKILL.md`。地图完全没覆盖的问题也一样，比如要不要用[计划模式（plan mode）](https://www.aihero.dev/ai-coding-dictionary/agent-mode)：那个答案是这个[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)的推断，不是写在这里的东西。

**为什么它是散文而不是编号检查清单？**

这个抱怨有道理。有一条未关闭的议题认为大部分导航是确定性的，而叙述让它难以扫读。没人拦你去要压缩形式：“只给我序列”就给你序列。散文承载的是带条件的那部分：分支、哪里该由人做决定、哪里该在步骤之间清空或压缩。扁平清单恰好丢掉了这些。

**它能带我越过我自己的技能，或者别人的技能吗？**

不能。有三份彼此独立的提议要求一个能读你本地 `skills/` 目录、从已安装的东西里推荐的导航器。`ask-matt` 不是那个。它是一套技能的手绘地图，对你写的或从别处装的技能一无所知。

**它让我去改一个 SKILL.md。**

这个建议常常是对的，但改动往往留不住。有人问它怎么让 [implement](https://aihero.dev/skills-implement) 关闭工单，被告知往技能里加一行，马上就看到了问题。`npx skills update` 会覆盖那个文件，而插件安装是只读的。把常设行为放在你自己的 `CLAUDE.md` 或 `AGENTS.md` 里，或者在调用时说清楚。你在提示里做的改动能挺过更新。人们就是这样把流程指向 Linear 而不是 GitHub，或者让它挑哪些打开的工单可以并行跑。

**它点了一个我没有的技能，或者漏了一个我有的。**

假定它已经消失之前，先查变更日志看有没有改名。`writing-great-skills` 改成了 [writing-for-agents](https://aihero.dev/skills-writing-for-agents)，没有别名；`to-prd` 改成了 [to-spec](https://aihero.dev/skills-to-spec)；`pathfinder` 改成了 [wayfinder](https://aihero.dev/skills-wayfinder)。有四个技能被彻底并入吸收它们的技能：`ubiquitous-language`、`design-an-interface`、`qa` 和 `request-refactor-plan`。如果它漏了一个你有的技能，那是导航器自己的滞后，上面说过。

## 它在生效的表现

- 它以点出该打什么结束，并在那里停住，而不是自己开始干活。
- 它给出的路线提到了在哪里清空或压缩上下文、在哪里该由你审查，而不只是一串技能名字。
- 两个技能很近时，它说是哪一个，以及为什么另一个不适合你。
- 它关于另一个技能行为的任何陈述，在轨迹里都能看到它读了那个技能的 `SKILL.md`。
- 你在它交回来的东西里认出自己的处境，而不是最近的通用场景。

## 它在哪里合用

`ask-matt` 是一个**独立导航器**，架在整套技能之上。它从不是链条里的一步。它指向每一条链条，其他文档页也都链接回它，好让它们不必各自重画那张图。从这里你多数会落到 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)（主流程的头部）或者 [triage](https://aihero.dev/skills-triage)（针对从外来的工作而不是你发起的工作的那个入口）。

它是它所描述技能之上的[二手来源（secondary source）](https://www.aihero.dev/ai-coding-dictionary/secondary-source)。导航器和 `SKILL.md` 不一致时，`SKILL.md` 是对的。
