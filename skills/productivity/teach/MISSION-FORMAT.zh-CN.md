# MISSION.md 的格式

`MISSION.md` 放在工作区根目录。它记录用户学习这个主题的_原因_。每一个教学决策（接下来教什么、呈现哪些资源、设计哪些练习）都应该能追溯到这份文档。

## 模板

```md
# Mission: {Topic}

## Why
{1-3 sentences. The concrete real-world goal the user is chasing. What changes in their life or work when they have this skill? Avoid abstract framings like "to understand X"; push for the underlying outcome.}

## Success looks like
- {A specific, observable thing the user will be able to do}
- {Another specific thing}
- {…}

## Constraints
- {Time, budget, prior commitments, learning preferences, anything that bounds the approach}

## Out of scope
- {Adjacent topics the user explicitly does not want to chase right now, protecting the zone of proximal development}
```

## 规则

- **一个工作区只对应一个使命。** 如果用户想学两件互不相关的事，那就是两个工作区。
- **具体优先于抽象。**“十月前跑完半程马拉松”比“身体更好一点”强。“给我们团队交付一个 Rust 命令行工具”比“学 Rust”强。
- **不接受含糊。** 如果用户说不清为什么学，先访谈他们，再动笔。糟糕的使命比没有使命更糟。
- **现实变了就修订。** 使命会变。用户的目标一旦移动，就更新这个文件，不要留一个过时的使命继续影响后续会话。
- **保持简短。** 如果 `MISSION.md` 超过一屏，它就不再是指南针，而变成了计划。
