# 翻译进度

本文件记录 `matt-skills` 仓库 Markdown 文件的中文翻译进度。

## 任务边界

- 范围：`SCOPE.md`、`README.md`、`GLOSSARY.md`、`CLAUDE.md`，`docs/` 下全部 Markdown，`skills/` 下除 `deprecated/`、`in-progress/` 之外的 Markdown。
- 不在范围：`CHANGELOG.md`、`CONTRIBUTING.md`、`.agents/`、`.out-of-scope/`、`.changeset/`、`.github/`、`skills/deprecated/`、`skills/in-progress/`，以及所有非 Markdown 文件（脚本、YAML、JSON）。
- 输出方式：保留英文原件，译文写到同目录的 `*.zh-CN.md`（例如 `README.zh-CN.md`、`docs/engineering/tdd.zh-CN.md`、`skills/engineering/tdd/SKILL.zh-CN.md`）。
- 内部链接：指向仓库内其他 Markdown 的链接改写为对应的 `.zh-CN.md`；外部 URL、图片、锚点、代码块、命令、路径保持原样。
- 翻译基线：`a496f55`。英文原件在这个提交之后的改动，需要同步进对应译文；每个文件被翻译时的英文内容哈希记录在 `translations.lock.json`。

## 术语约定

| 英文 | 译法 |
| --- | --- |
| skill | 技能 |
| bucket | 分组目录 |
| promoted | 已收录 |
| harness | harness，首次出现加注“agent 运行器” |
| user-invoked / model-invoked | 用户调用 / 模型调用 |
| issue | 议题 |
| Issue tracker | 议题跟踪器 |
| ticket | 工单 |
| triage | 分诊 |
| subagent | 子代理 |
| spec | 规格说明 |
| frontmatter | frontmatter |
| red-green-refactor | 红-绿-重构 |

## 进度统计

- 总数：90 个文件
- 已完成：90
- 剩余：0

## 待翻译文件清单

处理顺序：顶层四个文件 → `skills/`（按文件大小升序）→ `docs/`（按文件大小升序）。完成一个就把对应条目标记为 `[x]`。

### 顶层

- [x] SCOPE.md
- [x] GLOSSARY.md
- [x] CLAUDE.md
- [x] README.md

### skills/

- [x] skills/productivity/grill-me/SKILL.md
- [x] skills/engineering/grill-with-docs/SKILL.md
- [x] skills/productivity/wait-what/SKILL.md
- [x] skills/engineering/pr/CREDITS.md
- [x] skills/engineering/implement/SKILL.md
- [x] skills/misc/README.md
- [x] skills/engineering/research/SKILL.md
- [x] skills/productivity/handoff/SKILL.md
- [x] skills/engineering/setup-matt-pocock-skills/triage-labels.md
- [x] skills/engineering/tdd/mocking.md
- [x] skills/productivity/README.md
- [x] skills/productivity/teach/MISSION-FORMAT.md
- [x] skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md
- [x] skills/productivity/teach/RESOURCES-FORMAT.md
- [x] skills/engineering/setup-matt-pocock-skills/domain.md
- [x] skills/productivity/grilling/SKILL.md
- [x] skills/productivity/teach/GLOSSARY-FORMAT.md
- [x] skills/engineering/tdd/tests.md
- [x] skills/misc/setup-pre-commit/SKILL.md
- [x] skills/engineering/domain-modeling/GLOSSARY-FORMAT.md
- [x] skills/misc/git-guardrails-claude-code/SKILL.md
- [x] skills/engineering/codebase-design/DEEPENING.md
- [x] skills/productivity/writing-for-agents/SKILL-MECHANICS.md
- [x] skills/engineering/codebase-design/DESIGN-IT-TWICE.md
- [x] skills/engineering/domain-modeling/ADR-FORMAT.md
- [x] skills/productivity/teach/LEARNING-RECORD-FORMAT.md
- [x] skills/misc/migrate-to-shoehorn/SKILL.md
- [x] skills/engineering/implement-spec/SKILL.md
- [x] skills/productivity/to-questionnaire/SKILL.md
- [x] skills/engineering/prototype/SKILL.md
- [x] skills/engineering/to-spec/SKILL.md
- [x] skills/engineering/domain-modeling/SKILL.md
- [x] skills/misc/scaffold-exercises/SKILL.md
- [x] skills/engineering/tdd/SKILL.md
- [x] skills/engineering/setup-matt-pocock-skills/issue-tracker-gitlab.md
- [x] skills/engineering/wizard/SKILL.md
- [x] skills/engineering/pr/SKILL.md
- [x] skills/engineering/ask-matt/PHASE-BOUNDARIES.md
- [x] skills/engineering/README.md
- [x] skills/engineering/retro/SKILL.md
- [x] skills/engineering/triage/OUT-OF-SCOPE.md
- [x] skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md
- [x] skills/engineering/to-tickets/SKILL.md
- [x] skills/engineering/improve-codebase-architecture/SKILL.md
- [x] skills/engineering/prototype/LOGIC.md
- [x] skills/engineering/codebase-design/SKILL.md
- [x] skills/engineering/triage/SKILL.md
- [x] skills/engineering/improve-codebase-architecture/HTML-REPORT.md
- [x] skills/engineering/code-review/SKILL.md
- [x] skills/engineering/prototype/UI.md
- [x] skills/engineering/setup-matt-pocock-skills/SKILL.md
- [x] skills/engineering/triage/AGENT-BRIEF.md
- [x] skills/engineering/diagnosing-bugs/SKILL.md
- [x] skills/productivity/teach/SKILL.md
- [x] skills/productivity/writing-for-agents/SKILL.md
- [x] skills/engineering/wayfinder/SKILL.md
- [x] skills/engineering/ask-matt/SKILL.md

### docs/

- [x] docs/agents/triage-labels.md
- [x] docs/productivity/wait-what.md
- [x] docs/engineering/resolving-merge-conflicts.md
- [x] docs/productivity/grill-me.md
- [x] docs/productivity/writing-for-agents.md
- [x] docs/productivity/to-questionnaire.md
- [x] docs/engineering/pr.md
- [x] docs/engineering/to-spec.md
- [x] docs/productivity/handoff.md
- [x] docs/engineering/retro.md
- [x] docs/engineering/setup-matt-pocock-skills.md
- [x] docs/engineering/research.md
- [x] docs/engineering/prototype.md
- [x] docs/engineering/wizard.md
- [x] docs/engineering/implement-spec.md
- [x] docs/engineering/grill-with-docs.md
- [x] docs/productivity/grilling.md
- [x] docs/engineering/implement.md
- [x] docs/engineering/domain-modeling.md
- [x] docs/engineering/tdd.md
- [x] docs/engineering/diagnosing-bugs.md
- [x] docs/engineering/to-tickets.md
- [x] docs/engineering/code-review.md
- [x] docs/engineering/ask-matt.md
- [x] docs/engineering/improve-codebase-architecture.md
- [x] docs/engineering/codebase-design.md
- [x] docs/productivity/teach.md
- [x] docs/engineering/triage.md
- [x] docs/engineering/wayfinder.md

## 英文原件变更后的同步

`translations.lock.json` 记录每个英文文件在被翻译时的内容哈希（git blob）和当时的提交。检查脚本只比对内容，不看文件时间戳，所以 rebase、cherry-pick 之后判断依然准确。

```bash
npm run i18n:check                 # 列出过时、未登记、孤立、缺译文的文件
npm run i18n:update -- <英文路径>  # 同步完一个文件后，单独刷新它的哈希
```

`i18n:check` 的分类含义：

| 分类 | 含义 | 处理方式 |
| --- | --- | --- |
| `stale` | 英文内容变了，译文还没跟 | 看 diff，只改对应段落，再 `i18n:update` |
| `unregistered` | 已有 `.zh-CN.md`，但清单里没有登记 | `i18n:update` 登记 |
| `orphan` | 清单里的英文文件已被删除或移出范围 | 译文保留并标注“已归档”，从清单移除 |
| `missing translation` | 英文有、译文文件不见了 | 补译或恢复文件 |
| `uncommitted` | 英文文件有未提交的改动 | 先提交英文改动，再跑一次检查 |
| `untranslated` | 英文有、译文还没有（只警告，不报错） | 按清单顺序补译 |

每次 `git pull` 之后的固定动作：

1. `git diff --name-only ORIG_HEAD..HEAD -- '*.md' ':(exclude)*.zh-CN.md'` 看这次英文改了什么。
2. `npm run i18n:check` 确认哪些译文过期。
3. 逐文件对照 diff 修改译文，术语沿用本文件的术语约定。
4. 改完一个就 `npm run i18n:update -- <英文路径>`，不要批量刷新没真正复查过的文件。
5. 把这次待同步的文件记到下面的小节，已完成的 `[x]` 不要改回 `[ ]`。

### 待同步（英文已改，译文未跟）

暂无。

## 会话交接

全部 90 个文件已译完，清单无未勾选条目。后续会话若继续，只剩复查工作。

### 翻译约定（必须延续）

- 输出到同目录的 `*.zh-CN.md`，英文原件不动。
- 代码块整体保持原样，包括代码里的英文注释；只翻译代码块外的说明文字。
- frontmatter 只翻译 `description` 这类展示文案，`name`、`argument-hint` 的键名和 `disable-model-invocation` 等配置值保持不变。
- 引用其他技能的指令（如 "Call the Skill tool with \"tdd\""）保留技能名英文，只翻译动词部分。
- 内部链接指向对应的 `.zh-CN.md`；外部 URL、图片地址、锚点、命令、路径保持原样。
- 每个文件译完就用本文件的清单标记 `[x]`，并更新“进度统计”。
- 译文正文里不使用破折号（`—`、`——`），改用逗号、冒号、句号或括号。

### 已做过的检查

- 范围核对：`SCOPE.md`、`README.md`、`GLOSSARY.md`、`CLAUDE.md`、`docs/`、`skills/`（排除 `deprecated/`、`in-progress/`）共 90 个源文件，每个都有对应 `.zh-CN.md`。
- 链接检查：译文里的相对链接逐个核对存在性。只剩英文原件本来就有的示例路径（`skills/engineering/domain-modeling/GLOSSARY-FORMAT.md` 里的 `./src/ordering/GLOSSARY.md` 等）和代码块里的占位链接。
- 字符检查：没有替换字符（U+FFFD）、没有西里尔／假名／谚文字符混入。
- 破折号检查：`grep -rn "—" --include="*.zh-CN.md" .` 无结果。

### 建议的后续复查

- 术语一致性：`codebase-design` 家族的“接缝／适配器／杠杆／局部性”、`triage` 的五个状态角色、`to-tickets` 的“阻塞关系”已在全库统一，抽查时以这几组为准。
- 少数技能名与栏目名保留了英文（如 `harness`、`frontmatter`、`smart zone`、`dumb zone`），与“术语约定”一致；如需全中文，先改本表再统一替换。
- 英文原件里 `pr/SKILL.md` 的 `metadata.credits`、各 `template.sh` 路径、`scripts/hitl-loop.template.sh` 均按约定未改动。
