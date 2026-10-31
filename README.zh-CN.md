<p>
  <a href="https://www.aihero.dev/s/skills-newsletter">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skills-repo-dark_2x.png">
      <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png">
      <img alt="Skills" src="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png" width="369">
    </picture>
  </a>
</p>

# 面向真正工程师的技能

[![skills.sh](https://skills.sh/b/mattpocock/skills)](https://skills.sh/mattpocock/skills)

我每天用来做真实工程的 agent 技能，不是凭感觉写代码（vibe coding）。

开发真实应用很难。GSD、BMAD、Spec-Kit 这类方案试图通过接手整个流程来帮忙。但这样做也就拿走了你的控制权，让流程本身的缺陷变得难以排查。

这些技能被设计得小、易于改造、可以组合。它们适用于任何模型。它们建立在数十年的工程经验之上。随便改，改成你自己的。玩得开心。

如果你想跟进这些技能的变更，以及我新写的技能，可以加入我的邮件列表，那里有约 60,000 名开发者：

[订阅邮件列表](https://www.aihero.dev/s/skills-newsletter)

## 安装（30 秒配置）

插件会自动更新。[skills.sh](https://skills.sh/mattpocock/skills) 会把可编辑的文件复制进你的项目，需要你手动更新。每个 agent 只选一种方式，因为两种都装会让每个技能各出现两次。

### 1. 获取技能

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

默认自动更新。

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add mattpocock/skills
codex plugin add mattpocock-skills@mattpocock
```

启动时自动更新。

</details>

<details>
<summary><strong>GitHub Copilot</strong>（CLI 和 VS Code）</summary>

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

然后一次性把下面内容加到 `~/.copilot/settings.json`：

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": { "source": { "source": "github", "repo": "mattpocock/skills" }, "autoUpdate": true }
  }
}
```

在 VS Code 中运行 **Chat: Install Plugin From Source**，输入 `https://github.com/mattpocock/skills`。它会每天更新。

</details>

<details>
<summary><strong>Gemini CLI</strong>（手动更新）</summary>

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

要更新时重新运行这两条命令。

</details>

<details>
<summary><strong>其他 agent，或想要可编辑文件</strong>（手动更新）</summary>

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, opencode, devin, windsurf, amp, pi; omit -a to choose
```

安装器问你要装哪些技能时，要包含 `setup-matt-pocock-skills`。更新时运行 `npx skills@latest update`，然后重新运行 `add` 来获取新技能。

</details>

### 2. 运行 `/setup-matt-pocock-skills`

在你的 agent 里，每个仓库运行一次。它会：

- 问你要用哪个议题跟踪器（GitHub、GitLab、本地文件，或你描述的其他工具）
- 问你分诊工单时打哪些标签（`/triage` 依赖标签）
- 问你要把我们创建的文档保存在哪里

### 3. 搞定，可以开工了。

## 这些技能为什么存在

我写这些技能，是为了解决我在 Claude Code、Codex 和其他编码 agent 上常见的几类失败。

### 问题一：agent 没做我想要的

> "No-one knows exactly what they want"
>
> David Thomas & Andrew Hunt，[《程序员修炼之道》](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**问题**。软件开发中最常见的失败是理解不一致。你以为开发者知道你要什么。然后你看到它做出来的东西，才发现它完全没懂你的意思。

到了 AI 时代，情况一样。你和 agent 之间存在沟通落差。解决它的办法是**拷问环节（grilling session）**：让 agent 就你要做的东西向你提出具体问题。

**解决办法**是用：

- [`/grill-me`](./skills/productivity/grill-me/SKILL.zh-CN.md)：用于非代码场景
- [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.zh-CN.md)：和 [`/grill-me`](./skills/productivity/grill-me/SKILL.zh-CN.md) 一样，但多了些好东西（见下文）

这两个是我最受欢迎的技能。它们帮你在动手前与 agent 达成一致，深入思考你要做的改动。每次想改点什么，都该用它们。

### 问题二：agent 太啰嗦

> With a ubiquitous language, conversations among developers and expressions of the code are all derived from the same domain model.
>
> Eric Evans，[《领域驱动设计》](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

**问题**：项目开始时，开发者和他们要服务的人（领域专家）通常说着不同的语言。

我在 agent 身上感受到同样的张力。agent 通常被直接扔进一个项目，一边干一边猜那些行话是什么意思。所以本来一个词能说清的事，它用了二十个词。

**解决办法**是共享语言。它是一份文档，帮 agent 读懂项目中使用的行话。

<details>
<summary>
示例
</summary>

这是我 `course-video-manager` 仓库里的一个[术语表](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md)示例（在那个固定提交上它仍叫 `CONTEXT.md`，那时技能还没有改这个约定的名字）。哪个更容易读？

- **之前**：“课程里某个章节中的一节课被‘落实’（也就是说，在文件系统里给它分配了一个位置）时会有个问题”
- **之后**：“实体化级联（materialization cascade）有个问题”

这种简洁在一次次会话中不断带来回报。

</details>

这个做法内置在 [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.zh-CN.md) 里。它是一次拷问环节，但会顺手帮你和 AI 建立共享语言，并把难以解释的决策记录成 ADR。

它有多强，很难解释清楚。它可能是这个仓库里最酷的一个技巧。试一试就知道了。

> [!TIP]
> 共享语言除了减少啰嗦，还有很多好处：
>
> - **变量、函数和文件命名一致**，都使用共享语言
> - 因此**代码库对 agent 来说更好浏览**
> - agent **在思考上花的 token 更少**，因为它可以使用更精炼的语言

### 问题三：代码跑不起来

> "Always take small, deliberate steps. The rate of feedback is your speed limit. Never take on a task that’s too big."
>
> David Thomas & Andrew Hunt，[《程序员修炼之道》](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**问题**：假设你和 agent 已经就做什么达成一致。要是 agent 还是产出烂东西呢？

这时候该看你的反馈回路了。如果拿不到代码实际运行情况的反馈，agent 就只能盲飞。

**解决办法**：你需要常见的那套反馈回路：静态类型、浏览器访问权限和自动化测试。

对自动化测试来说，红-绿-重构循环至关重要。也就是 agent 先写一个失败的测试，再让测试通过。这能给 agent 稳定一致的反馈，产出的代码好得多。

我做了 **[`/tdd`](./skills/engineering/tdd/SKILL.zh-CN.md) 技能**，可以装进任何项目。它推行红-绿-重构，并给 agent 大量关于什么样的测试好、什么样的测试差的指引。

调试方面，我还做了 **[`/diagnosing-bugs`](./skills/engineering/diagnosing-bugs/SKILL.zh-CN.md)** 技能，把最佳调试实践包装成一个有纪律的循环，逐阶段放行。

### 问题四：我们造了一团泥

> "Invest in the design of the system _every day_."
>
> Kent Beck，[《解析极限编程》](https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658)

> "The best modules are deep. They allow a lot of functionality to be accessed through a simple interface."
>
> John Ousterhout，[《软件设计哲学》](https://www.amazon.co.uk/Philosophy-Software-Design-2nd/dp/173210221X)

**问题**：大多数用 agent 做出来的应用既复杂又难改。因为 agent 能大幅加快写代码的速度，它们也加快了软件熵增。代码库变复杂的速度前所未有。

**解决办法**是一种全新的 AI 驱动开发方式：在意代码的设计。

这个理念内置在这些技能的每一层里：

- [`/to-spec`](./skills/engineering/to-spec/SKILL.zh-CN.md) 在写规格说明之前会先问你要碰哪些模块

更关键的是，[`/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.zh-CN.md) 会巡查代码库，找出可以加深模块的候选位置，并把候选项交给你。建议每隔几天就在你的代码库上跑一次。它只是一次巡查，不是抢救：在一个确实很老的代码库上它能找到真实的候选位置，但它不会替你理开这团泥。

### 小结

软件工程的基本功比以往更重要。这些技能是我把这些基本功浓缩成可重复实践的尝试，希望能帮你做出职业生涯中最好的应用。玩得开心。

## 技能参考

全部技能按一个维度划分：谁能调用它们。**用户调用**的技能只有你亲自输入时才会触发（例如 `/grill-me`），它们的职责是组织流程。**模型调用**的技能可以由你调用，也可以在任务合适时由 agent 自动取用，它们承载可复用的纪律。用户调用的技能可以调用模型调用的技能，但绝不能调用另一个用户调用的技能。

### 工程（Engineering）

我每天写代码时使用的技能。

**用户调用**

- **[ask-matt](./skills/engineering/ask-matt/SKILL.zh-CN.md)**：问哪个技能或哪条流程适合你当前的情况。它是本仓库用户调用技能之上的路由。
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.zh-CN.md)**：一次拷问环节，同时构建项目的领域模型，明确术语，并同步更新 `GLOSSARY.md` 和 ADR。
- **[triage](./skills/engineering/triage/SKILL.zh-CN.md)**：让议题沿着分诊角色组成的状态机前进。
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.zh-CN.md)**：扫描代码库，找出可以加深模块的位置，以可视化 HTML 报告的形式呈现，然后对你选中的那个进行拷问。
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.zh-CN.md)**：为这些工程技能配置仓库（议题跟踪器、分诊标签、领域文档布局）。使用其他工程技能前，每个仓库运行一次。
- **[to-spec](./skills/engineering/to-spec/SKILL.zh-CN.md)**：把当前对话转成规格说明，并发布到议题跟踪器。不做访谈，只是把你们已经讨论过的内容整理出来。
- **[to-tickets](./skills/engineering/to-tickets/SKILL.zh-CN.md)**：把任何计划、规格说明或对话拆成一组曳光弹式的工单，每张工单声明自己阻塞了谁、被谁阻塞，可以写成文本放进本地文件，也可以写成真实跟踪器上的原生阻塞链接。
- **[implement](./skills/engineering/implement/SKILL.zh-CN.md)**：实现一份规格说明或一组工单描述的工作，在事先约定好的接缝处驱动 `/tdd`，并在提交前用 `/code-review` 收尾。
- **[implement-spec](./skills/engineering/implement-spec/SKILL.zh-CN.md)**：在一个集成分支上实现整份规格说明。把工单当作任务图来推进，在已就绪的前沿上并发运行实现者子代理以取得最大并发度，然后用 `/code-review` 收尾。
- **[wayfinder](./skills/engineering/wayfinder/SKILL.zh-CN.md)**：把远超一次 agent 会话容量的一大块工作，规划成议题跟踪器上由决策工单组成的共享地图，然后一张一张解决，直到通往目的地的路清晰可见。
- **[retro](./skills/engineering/retro/SKILL.zh-CN.md)**：在一次会话之后，对编码 agent 的环境（代码导航、自动化检查、编码规范、引导文件、工具）提出改进建议，最严重的问题排在前面。

**模型调用**

- **[prototype](./skills/engineering/prototype/SKILL.zh-CN.md)**：做一个用完就能丢的原型来回答某个设计问题：要么是单个可分享的 HTML 文件，用来回答状态和逻辑问题，要么是几个截然不同的界面方案，在同一个路由下可切换。
- **[diagnosing-bugs](./skills/engineering/diagnosing-bugs/SKILL.zh-CN.md)**：针对难缠的缺陷和性能回退的有纪律诊断循环：先建立一个在这个缺陷上会变红的反馈回路 → 最小化复现 → 提假设 → 加观测 → 修复 → 回归测试。
- **[research](./skills/engineering/research/SKILL.zh-CN.md)**：以高可信度的一手资料为依据调查一个问题，把结论保存成带引用的 Markdown 文件放进仓库，以后台 agent 的方式运行。
- **[tdd](./skills/engineering/tdd/SKILL.zh-CN.md)**：以红-绿-重构循环进行测试驱动开发。一次构建一个垂直切片，或修复一个缺陷。
- **[domain-modeling](./skills/engineering/domain-modeling/SKILL.zh-CN.md)**：主动构建并打磨项目的领域模型：用术语表检验各个术语，用边界场景做压力测试，并同步更新 `GLOSSARY.md` 和 ADR。
- **[codebase-design](./skills/engineering/codebase-design/SKILL.zh-CN.md)**：设计深模块时共用的纪律和词汇：在干净的接缝处，用很小的接口承载大量行为，并通过该接口进行测试。
- **[code-review](./skills/engineering/code-review/SKILL.zh-CN.md)**：以两条轴线审查从某个固定点以来的改动：**规范**（是否符合仓库的编码规范，以及 Fowler 坏味道基线？）和**规格**（是否忠实实现了作为起点的议题或规格说明？）。两者以并行子代理运行，互不干扰。
- **[pr](./skills/engineering/pr/SKILL.zh-CN.md)**：一个拉取请求正文应有的形态：用能说清这次改动的最小可视化作为摘要，附上改动前后确实生效的证据，并给出合并风险判断（单向门还是双向门，加上影响范围）。
- **[wizard](./skills/engineering/wizard/SKILL.zh-CN.md)**：生成一个交互式 bash 向导，带着人走完只有人才能做的步骤：开通基础设施、配置凭据或 CI 密钥、摸索不熟悉的第三方控制台，或执行一次性的数据迁移与切换。

### 效率（Productivity）

通用流程工具，与具体代码无关。

**用户调用**

- **[grill-me](./skills/productivity/grill-me/SKILL.zh-CN.md)**：就一个计划或设计被人反复追问，直到设计树的每个分支都被解决。
- **[handoff](./skills/productivity/handoff/SKILL.zh-CN.md)**：把当前对话压缩成一份交接文档，让另一个 agent 能接着做。
- **[teach](./skills/productivity/teach/SKILL.zh-CN.md)**：跨多次会话教用户一项新技能或新概念，把当前目录当作有状态的教学工作区。
- **[to-questionnaire](./skills/productivity/to-questionnaire/SKILL.zh-CN.md)**：把你独自回答不了的决策，变成一份 Markdown 问卷，交给唯一能回答它的人，异步填写，或在会议中一起填。它会追问你怎么发出去（给谁、你需要拿回什么），而不是追问主题本身。
- **[wait-what](./skills/productivity/wait-what/SKILL.zh-CN.md)**：某条消息你没听懂的那一刻就触发它。agent 会用你缺少的上下文、以平实的语言、用你 `GLOSSARY.md` 里的词汇重新讲一遍。

**模型调用**

- **[grilling](./skills/productivity/grilling/SKILL.zh-CN.md)**：就一个计划、决策或想法反复追问用户，直到设计树的每个分支都被解决。它是 `grill-me`、`grill-with-docs`、`triage`、`wayfinder` 和 `improve-codebase-architecture` 背后可复用的访谈原语。
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.zh-CN.md)**：写面向 agent 的文档：技能、AGENTS.md/CLAUDE.md，以及任何 agent 通过指针找到的文档。
