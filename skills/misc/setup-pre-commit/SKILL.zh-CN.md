---
name: setup-pre-commit
description: 在当前仓库里配置 Husky 提交前钩子，接入 lint-staged（Prettier）、类型检查和测试。当用户想添加提交前钩子、配置 Husky、配置 lint-staged，或想在提交时格式化、类型检查、跑测试时使用。
---

# 配置提交前钩子

## 这套配置会装上什么

- **Husky** 提交前钩子
- **lint-staged**，对所有暂存文件运行 Prettier
- **Prettier** 配置（如果缺失）
- 提交前钩子中的 **typecheck** 和 **test** 脚本

## 步骤

### 1. 判断包管理器

检查 `package-lock.json`（npm）、`pnpm-lock.yaml`（pnpm）、`yarn.lock`（yarn）、`bun.lockb`（bun）。哪个存在用哪个。判断不出来时默认用 npm。

### 2. 安装依赖

作为 devDependencies 安装：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

它会创建 `.husky/` 目录，并在 package.json 里加上 `prepare: "husky"`。

### 4. 创建 `.husky/pre-commit`

写入以下内容（Husky v9 及以上不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**按情况调整**：把 `npm` 换成检测到的包管理器。如果仓库的 package.json 里没有 `typecheck` 或 `test` 脚本，就删掉对应的行，并告诉用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc`（如果缺失）

只在没有任何 Prettier 配置时创建。使用以下默认值：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且有可执行权限
- [ ] `.lintstagedrc` 存在
- [ ] package.json 里的 `prepare` 脚本是 `"husky"`
- [ ] 存在 `prettier` 配置
- [ ] 运行 `npx lint-staged` 确认它能用

### 8. 提交

把改动和新建的文件加入暂存区，用这条信息提交：`Add pre-commit hooks (husky + lint-staged + prettier)`

这次提交会走一遍新的提交前钩子，是一次不错的冒烟测试，能验证整套配置确实工作。

## 备注

- Husky v9 及以上的钩子文件不需要 shebang
- `prettier --ignore-unknown` 会跳过 Prettier 无法解析的文件（图片等）
- 提交前依次运行 lint-staged（快，只处理暂存文件）、完整类型检查和测试
