# 工程

我日常做代码工作时用的技能。

## 用户调用

只有你打出名字才能触达（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 里的 `policy.allow_implicit_invocation: false`）。

- **[ask-matt](./ask-matt/SKILL.zh-CN.md)**：问清哪个技能或哪条流程适合你的处境。它是本仓库用户调用技能的导航器。
- **[grill-with-docs](./grill-with-docs/SKILL.zh-CN.md)**：一边拷问，一边建立项目的领域模型，磨利用词，并就地更新 `GLOSSARY.md` 和 ADR。
- **[triage](./triage/SKILL.zh-CN.md)**：让议题沿着分诊角色的状态机流转。
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.zh-CN.md)**：扫描代码库找出可以加深的地方，以可视化 HTML 报告呈现，然后把你挑中的那一个拷问透。
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.zh-CN.md)**：把这个仓库配置好，以使用这些工程技能（议题跟踪器、分诊标签、领域文档布局）。每个仓库运行一次。
- **[to-spec](./to-spec/SKILL.zh-CN.md)**：把当前对话整理成一份规格说明，发布到议题跟踪器。
- **[to-tickets](./to-tickets/SKILL.zh-CN.md)**：把任何计划、规格说明或对话拆成一组曳光弹工单，每个工单声明自己的阻塞关系，可以写成本地文件里的文字，也可以写成真实跟踪器上的原生阻塞链接。
- **[implement](./implement/SKILL.zh-CN.md)**：实现由规格说明或一组工单描述的工作，在事先商定的接缝上驱动 `/tdd`，提交前用 `/code-review` 收尾。
- **[implement-spec](./implement-spec/SKILL.zh-CN.md)**：在一个集成分支上实现整份规格说明。把工单当作任务图推进，沿可领取的前沿并行运行实现子代理以求最大并发，最后用 `/code-review` 收尾。
- **[wayfinder](./wayfinder/SKILL.zh-CN.md)**：把一大块（超过单个代理会话容量）工作规划成议题跟踪器上共享的一张决策工单地图，逐个解决，直到通往目的地的路清晰起来。
- **[retro](./retro/SKILL.zh-CN.md)**：会话结束后，就编码代理所处的环境（导航、自动检查、编码规范、引导文件、工具）提出改进建议，最严重的排最前。

## 模型调用

模型或用户都能触达（触发措辞写得丰富，模型才能主动用到它们）。

- **[prototype](./prototype/SKILL.zh-CN.md)**：做一个用完就丢的原型回答某个设计问题：状态／逻辑用单个可分享的 HTML 文件，界面则用几个可切换的版本。

- **[diagnosing-bugs](./diagnosing-bugs/SKILL.zh-CN.md)**：针对难缠缺陷和性能退化的有章法的诊断循环：建立能对这个缺陷变红的反馈回路 → 最小化 → 提假设 → 加观测 → 修复 → 回归测试。
- **[research](./research/SKILL.zh-CN.md)**：针对高可信度的一手来源调查一个问题，把结论以带引用的 Markdown 文件写进仓库，作为后台代理运行。
- **[tdd](./tdd/SKILL.zh-CN.md)**：带红-绿-重构循环的测试驱动开发。一次一个纵向切片地实现功能或修复缺陷。
- **[domain-modeling](./domain-modeling/SKILL.zh-CN.md)**：通过质疑用词、用场景施压、就地更新 `GLOSSARY.md` 和 ADR，主动建立并磨利项目的领域模型。
- **[codebase-design](./codebase-design/SKILL.zh-CN.md)**：设计深模块所需的共同章法与词汇：小接口、干净的接缝、可以通过接口测试。
- **[code-review](./code-review/SKILL.zh-CN.md)**：对自某个固定点以来的 diff 做双轴审查：**标准**（是否符合仓库的编码规范，并对照 Fowler 的坏味道基线？）和**规格**（是否忠实实现了它来源的议题／规格说明？），由并行子代理执行。
- **[pr](./pr/SKILL.zh-CN.md)**：PR 正文应有的形态：用能说清改动的最小视图作摘要，附上改动有效的改前／改后证据，并给出合并风险判断（单向门还是双向门，以及影响面）。
- **[wizard](./wizard/SKILL.zh-CN.md)**：生成一个交互式 bash 向导，带人走完只有本人才能做的步骤：配置基础设施、设置凭据或 CI 密钥、操作不熟悉的第三方后台，或者跑一次性迁移或切换。
