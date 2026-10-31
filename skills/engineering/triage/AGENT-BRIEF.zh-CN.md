# 写代理说明

代理说明是议题或 PR 移到 `ready-for-agent` 时发布的结构化评论。它是脱手代理工作所依据的权威规格。原始正文和讨论是背景：代理说明才是契约。

说明陈述**代理该做什么**，这覆盖两种对象：对议题而言，就是从零构建这个改动；对 PR 而言，就是*针对已有 diff* 还剩下什么：做完它、补齐缺口、回应审查意见。两种情况下原则相同；下面的 PR 示例展示了差别。

## 原则

### 耐久胜过精确

议题可能在 `ready-for-agent` 停留几天甚至几周。这期间代码库会变。写说明时要让它在文件被改名、移动或重构之后仍然有用。

- **要**描述接口、类型和行为契约
- **要**点出代理应当寻找或修改的具体类型、函数签名或配置形态
- **不要**引用文件路径：它们会过时
- **不要**引用行号
- **不要**假设当前的实现结构会保持不变

### 讲行为，不讲步骤

描述系统**该做什么**，而不是**怎么实现**。代理会重新探索代码库，自己做实现决定。

- **好**：“`SkillConfig` 类型应当接受一个可选的 `schedule` 字段，类型为 `CronExpression`”
- **坏**：“打开 src/types/skill.ts，在第 42 行加一个 schedule 字段”
- **好**：“用户不带参数运行 `/triage` 时，应当看到需要处理的议题摘要”
- **坏**：“在主处理函数里加一个 switch 语句”

### 完整的验收标准

代理需要知道什么时候算做完。每份代理说明都必须有具体、可验证的验收标准。每条标准都应当能独立验证。

- **好**：“运行 `gh issue list --label needs-triage` 返回的是已经过初步分类的议题”
- **坏**：“分诊应当正常工作”

### 明确的范围边界

说明什么不在范围内。这样能防止代理画蛇添足，或者对相邻功能做假设。

## 模板

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** one-line description of what needs to happen

**Current behavior:**
Describe what happens now. For bugs, this is the broken behavior.
For enhancements, this is the status quo the feature builds on.

**Desired behavior:**
Describe what should happen after the agent's work is complete.
Be specific about edge cases and error conditions.

**Key interfaces:**
- `TypeName`: what needs to change and why
- `functionName()` return type: what it currently returns vs what it should return
- Config shape: any new configuration options needed

**Acceptance criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3

**Out of scope:**
- Thing that should NOT be changed or addressed in this issue
- Adjacent feature that might seem related but is separate
```

## 示例

### 好的代理说明（缺陷）

```markdown
## Agent Brief

**Category:** bug
**Summary:** Skill description truncation drops mid-word, producing broken output

**Current behavior:**
When a skill description exceeds 1024 characters, it is truncated at exactly
1024 characters regardless of word boundaries. This produces descriptions
that end mid-word (e.g. "Use when the user wants to confi").

**Desired behavior:**
Truncation should break at the last word boundary before 1024 characters
and append "..." to indicate truncation.

**Key interfaces:**
- The `SkillMetadata` type's `description` field: no type change needed,
  but the validation/processing logic that populates it needs to respect
  word boundaries
- Any function that reads SKILL.md frontmatter and extracts the description

**Acceptance criteria:**
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Descriptions over 1024 chars are truncated at the last word boundary
      before 1024 chars
- [ ] Truncated descriptions end with "..."
- [ ] The total length including "..." does not exceed 1024 chars

**Out of scope:**
- Changing the 1024 char limit itself
- Multi-line description support
```

### 好的代理说明（功能增强）

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Add `.out-of-scope/` directory support for tracking rejected feature requests

**Current behavior:**
When a feature request is rejected, the issue is closed with a `wontfix` label
and a comment. There is no persistent record of the decision or reasoning.
Future similar requests require the maintainer to recall or search for the
prior discussion.

**Desired behavior:**
Rejected feature requests should be documented in `.out-of-scope/<concept>.md`
files that capture the decision, reasoning, and links to all issues that
requested the feature. When triaging new issues, these files should be
checked for matches.

**Key interfaces:**
- Markdown file format in `.out-of-scope/`: each file should have a
  `# Concept Name` heading, a `**Decision:**` line, a `**Reason:**` line,
  and a `**Prior requests:**` list with issue links
- The triage workflow should read all `.out-of-scope/*.md` files early
  and match incoming issues against them by concept similarity

**Acceptance criteria:**
- [ ] Closing a feature as wontfix creates/updates a file in `.out-of-scope/`
- [ ] The file includes the decision, reasoning, and link to the closed issue
- [ ] If a matching `.out-of-scope/` file already exists, the new issue is
      appended to its "Prior requests" list rather than creating a duplicate
- [ ] During triage, existing `.out-of-scope/` files are checked and surfaced
      when a new issue matches a prior rejection

**Out of scope:**
- Automated matching (human confirms the match)
- Reopening previously rejected features
- Bug reports (only enhancement rejections go to `.out-of-scope/`)
```

### 好的代理说明（PR）

对 PR 而言，“当前行为”描述 diff 的现状，说明要求代理把它做完或修好，而不是从零构建。

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Finish the contributor's `--json` output flag for `triage list`

**Current behavior:**
The PR adds a `--json` flag that serializes the issue list to JSON. The happy
path works and the diff matches the project's command structure. Two gaps
remain: errors are still printed as human text (not JSON), and the new flag has
no test coverage.

**Desired behavior:**
With `--json`, all output (including errors) is well-formed JSON on stdout,
and the command's exit codes are unchanged. The existing human-readable output
is untouched when the flag is absent.

**Key interfaces:**
- The command's error path should emit `{ "error": string }` under `--json`
  instead of the plain-text error
- Reuse the existing serializer the PR already added; don't introduce a second

**Acceptance criteria:**
- [ ] `triage list --json` emits valid JSON for both success and error cases
- [ ] Exit codes match the non-JSON command
- [ ] A test covers the `--json` success output and one error case
- [ ] Default (non-JSON) output is byte-for-byte unchanged

**Out of scope:**
- Adding `--json` to any other command
- Changing the JSON shape of the success payload the PR already defined
```

### 差的代理说明

```markdown
## Agent Brief

**Summary:** Fix the triage bug

**What to do:**
The triage thing is broken. Look at the main file and fix it.
The function around line 150 has the issue.

**Files to change:**
- src/triage/handler.ts (line 150)
- src/types.ts (line 42)
```

这份差在：
- 没有分类
- 描述含糊（“分诊那套东西坏了”）
- 引用了会过时的文件路径和行号
- 没有验收标准
- 没有范围边界
- 没有描述当前行为和期望行为
