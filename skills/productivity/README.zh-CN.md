# 效率（Productivity）

通用流程工具，与具体代码无关。

## 用户调用

只有你输入时才会触发（Claude Code：`disable-model-invocation: true`；Codex：`agents/openai.yaml` 中的 `policy.allow_implicit_invocation: false`）。

- **[grill-me](./grill-me/SKILL.zh-CN.md)**：就一个计划或设计被人反复追问，直到设计树的每个分支都被解决。
- **[handoff](./handoff/SKILL.zh-CN.md)**：把当前对话压缩成一份交接文档，让另一个 agent 能接着做。
- **[teach](./teach/SKILL.zh-CN.md)**：跨多次会话教用户一项新技能或新概念，把当前目录当作有状态的教学工作区。
- **[to-questionnaire](./to-questionnaire/SKILL.zh-CN.md)**：把你独自回答不了的决策，变成一份 Markdown 问卷，交给唯一能回答它的人（异步填写，或在会议中一起填）。
- **[wait-what](./wait-what/SKILL.zh-CN.md)**：某条消息你没听懂的那一刻就触发它。agent 会用你缺少的上下文、以平实的语言、用你 `GLOSSARY.md` 里的词汇重新讲一遍。

## 模型调用

模型或用户都能触发（触发语写得足够丰富，方便模型主动取用）。

- **[grilling](./grilling/SKILL.zh-CN.md)**：就一个计划、决策或想法反复追问用户，直到设计树的每个分支都被解决。
- **[writing-for-agents](./writing-for-agents/SKILL.zh-CN.md)**：写面向 agent 的文档：技能、AGENTS.md/CLAUDE.md，以及任何 agent 通过指针找到的文档。
