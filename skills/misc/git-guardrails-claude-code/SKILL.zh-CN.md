---
name: git-guardrails-claude-code
description: 配置 Claude Code 钩子，在危险 git 命令（push、reset --hard、clean、branch -D 等）执行之前拦下它们。当用户想防止破坏性的 git 操作、添加 git 安全钩子，或在 Claude Code 中阻止 git push/reset 时使用。
---

# 配置 git 护栏

配置一个 PreToolUse 钩子，在 Claude 执行危险 git 命令之前拦截并阻止它。

## 会被拦下的命令

- `git push`（包括 `--force` 在内的所有变体）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被拦下时，Claude 会看到一条消息，说明它无权使用这些命令。

## 步骤

### 1. 确认范围

问用户：只给**当前项目**装（`.claude/settings.json`），还是给**所有项目**装（`~/.claude/settings.json`）？

### 2. 复制钩子脚本

随附的脚本在：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

按所选范围复制到目标位置：

- **项目级**：`.claude/hooks/block-dangerous-git.sh`
- **全局**：`~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 赋予可执行权限。

### 3. 把钩子加进配置

加到对应的配置文件：

**项目级**（`.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**全局**（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

如果配置文件已经存在，把钩子合并进现有的 `hooks.PreToolUse` 数组。不要覆盖其他配置。

### 4. 询问是否需要自定义

问用户是否要往拦截列表里增加或删除某些模式。据此修改复制过去的脚本。

### 5. 验证

跑一个快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应当以退出码 2 结束，并向 stderr 打印一条 BLOCKED 消息。
