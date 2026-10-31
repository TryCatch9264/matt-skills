## 它做什么

`retro` 回看一次编码[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)，就代理的**[环境（environment）](https://www.aihero.dev/ai-coding-dictionary/environment)**提出改进建议，让下一次运行更顺。它读这次会话自己的记录（默认是当前这次，也可以指向会话日志里的某一次）。它找出代理受挫的时刻，给你一份候选改进清单，最严重的在前。

它改的是环境，不是代码。拿代理交付的那个缺陷、它花了二十次[工具调用（tool call）](https://www.aihero.dev/ai-coding-dictionary/tool-call)才找到的文件、审查者漏掉的规则来说。`retro` 不直接修它们中的任何一个。它问仓库里是什么让这些发生，并提出能防止它们再发生的检查、指针或规范。它也仅仅提出。在你挑中一个候选之前，什么都不会变。

## 什么时候用它

通过打 `/retro` 调用，代理不会自己去用它。

在一次比本该有的更难的会话结束时用它。例如代理找东西找太久、犯了一个工具本可抓住的错误，或者需要它拿不到的信息。顺利的会话没什么可教，发现都来自困难的那些。如果你想对这次会话产出的代码下判断，改用 [code-review](https://aihero.dev/skills-code-review)。

## 发现落到哪里

每个候选属于一个类别，类别决定修法落在哪里：

| 会话里出了什么问题 | 用什么修 |
| --- | --- |
| 代理花了很长时间才找到某个文件或事实 | 从它已经读的文件里加一个**导航指针** |
| 它犯了一个工具本可抓住的错误 | 一项**[自动检查（automated check）](https://www.aihero.dev/ai-coding-dictionary/automated-check)**：lint 规则、类型检查、测试、pre-commit 钩子、CI 任务 |
| 审查者漏掉了一个判断类错误 | 给审查代理在 `CODING_STANDARDS.md` 里加一条规则 |
| `AGENTS.md` 或 `CLAUDE.md` 太大 | 把其中的引导挪出去，放进规范或检查 |
| 某次工具调用对它的回报来说太贵 | 精简那个工具，或者换掉它 |
| 某个引导文件里满是并不改变任何东西的行 | 删掉那些**无效指令** |
| 代理需要它够不到的信息 | 放宽它的访问：把开发服务器日志镜像到文件、给某个服务开只读权限 |

这里的领头想法是：规范属于**审查者**，不属于实现者。实现代理的上下文压力最大，因为它要探索、写代码、调试失败。审查代理只拿到一个 diff，别的什么都没有。所以新规则要放在有余力执行它的地方，也就是审查环节。它绝不放进 [AGENTS.md](https://www.aihero.dev/ai-coding-dictionary/agents-md)，那个文件不管相不相关都会加载进每个会话的[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)。

在写下任何规则之前，`retro` 先给违规分类。**机械型**违规（被禁用的 API、导入形态、文件位置规则）配一个确定性检查，因为检查会失败，而规范文件里的一句话不会。只有真正的判断类问题，任何 linter 都执行不了，才写成文字。如果仓库完全没有防护栏（没有 pre-commit 钩子，也没有跑 lint、类型检查和测试的 CI 任务），`retro` 会把这一点作为一条独立发现报出来。

## 常见问题

**它会自己写 lint 规则，还是等我说可以？能接成每次会话之后自动跑吗？**

它等。`retro` 只提出。在你挑中候选之前什么都不变，所以它不手工编辑任何东西，也不自动安装钩子。这是有意的。有一位用户在被“自动钩子挡住了好改动”之后，正是这么要求的。决定什么值得一个长期检查需要判断，所以技能保持[人在环路里（human-in-the-loop）](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)、由用户调用。确实有人在每次实现跑完之后运行它。但顺利的会话没什么可教，所以每次会话后都跑，多半只会产出没人需要的规则。没有试运行模式。被提出的检查和其他代码一样，所以在让它拦合并之前，先对着仓库试一试。

**这不会越积越多 lint 规则吗？它会建议删掉某条吗？**

部分是，而这是它最弱的地方。它能删文字：引导文件里的无效指令，以及 `AGENTS.md` 或 `CLAUDE.md` 里本该放进规范或检查的引导。文件很大时它会把这些标出来建议删除。它只对着它读的那一次会话来判断，所以把每一条都当作删除测试的候选，而不是判决。它不会回过头审计自己上个月提的 lint 规则、钩子或 CI 任务。它只看到一次会话，所以没法告诉你某条规则现在触发太频繁，或者它背后的缺陷已经消失。你还是得自己修剪检查。一条在好代码上不停触发的规则，就是该删掉它的信号。

**它不会为了填满类别而编出泛泛的建议吗？**

这是对它的最强批评。一位用户发现“活干完之后，AI 往往忘了会话中途的挣扎，然后编些泛泛的建议来满足复盘的类别”。每个候选都必须来自会话自己的记录，所以建议是针对那次会话的。这既有成本也有好处。它很少编出无关的东西，但可能对这一次会话所涉及的内容赋予过多权重。任何你追溯不到具体时刻的候选，就丢掉。严重程度排序也当草稿看，因为一个安静但昂贵的错误可能排在响亮但便宜的后面。

**我的会话很长。现在就跑，还是重开一个新会话？**

默认它复盘当前会话。那是最好的情况，因为挣扎还在上下文窗口里。如果会话已经跑出 [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)，就[清空（clear）](https://www.aihero.dev/ai-coding-dictionary/clearing)它，然后让一个新的 `/retro` 指向会话日志里的上一次会话。

**代理老是犯同样的错误。我该往 `CLAUDE.md` 里加一行吗？**

通常不该，而 `retro` 在这一点上顶回去的次数比别处都多。`CLAUDE.md` 里的一行会加载进每个会话，稀释文件里其他内容的分量，还会随着代码变化而过时。如果这个错误是机械型的，修法是让它失败的检查。如果是判断类的，就放进审查者读的编码规范。`AGENTS.md` 和 `CLAUDE.md` 是用来放导航指针的，别的几乎都不该放。同样的道理，`retro` 不是[记忆系统（memory system）](https://www.aihero.dev/ai-coding-dictionary/memory-system)。它不存储发生过什么。它改变环境，让这个错误无法再发生。

**我的配置里提到 `CODING_STANDARDS.md`，但我没有这个文件。它是从哪来的？**

没有任何技能自带这个文件。第一次会话发现某条属于审查者的判断类规则时，`retro` 会提议创建它。你接受之后，[code-review](https://aihero.dev/skills-code-review) 就会读它。你已有的其他规范文档，比如 `CONTRIBUTING.md`，用法也一样。

**它和 `improve-codebase-architecture` 有什么不同？**

输入不同。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 只需要代码，找的是代码的结构性改进。`retro` 需要会话历史，改进的是代理工作所处的环境，不是代码。两者都用，互不替代。

## 它在生效的表现

- 每个候选都能指回会话里的某个具体时刻，而不是一条泛泛的最佳实践。
- 重复犯的错误变成会失败的检查，而你的 `AGENTS.md` 随着时间变短，而不是变长。
- 如果某项检查本来就存在、只是没接上，那条发现是把它接上，而不是提议新造一个。
- 同类任务的下一次会话更快找到它需要的东西。

## 它在哪里合用

`retro` 是主链的最后一步，在那里复盘这条链走得怎么样：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review → retro
```

在一次值得学习的构建之后运行它，可以在同一场会话里，或者指向那次会话的日志。顺利的构建之后可以跳过。

- [code-review](https://aihero.dev/skills-code-review) 是 `retro` 最常去调的审查代理。新的编码规范放在它的“标准”轴能读到的地方。
- [writing-for-agents](https://aihero.dev/skills-writing-for-agents) 为 `retro` 提议的每个引导文件和技能定下写作风格，`retro` 在开始之前会加载它。

不确定当前情况需要哪个技能时，[ask-matt](https://aihero.dev/skills-ask-matt) 会带你在这整套技能上导航。
