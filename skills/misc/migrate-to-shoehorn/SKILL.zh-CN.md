---
name: migrate-to-shoehorn
description: 把测试文件里的 `as` 类型断言迁移到 @total-typescript/shoehorn。当用户提到 shoehorn、想替换测试里的 `as`，或者需要部分测试数据时使用。
---

# 迁移到 Shoehorn

## 为什么用 shoehorn？

`shoehorn` 让你在测试里传入部分数据，同时让 TypeScript 保持满意。它用类型安全的替代方式替换 `as` 断言。

**只用于测试代码。** 绝不要在生成代码里用 shoehorn。

测试里用 `as` 的问题：

- 约定成俗不该用它
- 必须手动指定目标类型
- 故意传错数据要用双重 `as`（`as unknown as Type`）

## 安装

```bash
npm i @total-typescript/shoehorn
```

## 迁移方式

### 对象很大但只需少量属性

改之前：

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...20 more properties
};

it("gets user by id", () => {
  // Only care about body.id but must fake entire Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...fake all 20 properties
  });
});
```

改之后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

改之前：

```ts
getUser({ body: { id: "123" } } as Request);
```

改之后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

改之前：

```ts
getUser({ body: { id: 123 } } as unknown as Request); // wrong type on purpose
```

改之后：

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 各自的使用场景

| 函数            | 使用场景                             |
| --------------- | ------------------------------------ |
| `fromPartial()` | 传入部分数据，同时仍通过类型检查     |
| `fromAny()`     | 传入故意错误的数据（保留自动补全）   |
| `fromExact()`   | 要求完整对象（以后可换成 fromPartial）|

## 工作流程

1. **收集需求** - 问用户：
   - 哪些测试文件里的 `as` 断言造成了问题？
   - 他们是不是在处理那种只有部分属性重要的大对象？
   - 他们是否需要为测试错误处理而传入故意错误的数据？

2. **安装并迁移**：
   - [ ] 安装：`npm i @total-typescript/shoehorn`
   - [ ] 找出带 `as` 断言的测试文件：`grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 把 `as Type` 换成 `fromPartial()`
   - [ ] 把 `as unknown as Type` 换成 `fromAny()`
   - [ ] 补上从 `@total-typescript/shoehorn` 的导入
   - [ ] 运行类型检查确认
