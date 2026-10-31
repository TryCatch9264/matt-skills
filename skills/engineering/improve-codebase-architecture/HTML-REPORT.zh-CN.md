# HTML 报告格式

架构审查渲染成系统临时目录里的单个自包含 HTML 文件。Tailwind 和 Mermaid 都从 CDN 引入。Mermaid 能可靠处理图状结构；手工搭的 div 和内联 SVG 处理更有编辑感的视觉（质量图、剖面图）。两者混用：不要什么都靠 Mermaid，它会开始显得千篇一律。

## 骨架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页头

仓库名、日期，以及一份紧凑的图例：实线方框 = 模块，虚线 = 接缝，红色箭头 = 泄漏，深色粗边框方框 = 深模块。不要开头段落。直接进入候选。

## 候选卡片

图承担主要分量。文字稀疏、朴实，使用术语表里的词（来自 `/codebase-design` 技能），不加修饰。

每个候选是一个 `<article>`：

- **标题**：简短，点出要做的加深（例如“Collapse the Order intake pipeline”）。
- **徽标行**：推荐强度（`Strong` = emerald，`Worth exploring` = amber，`Speculative` = slate），再加一个依赖类别的标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **文件**：等宽字体列表，`font-mono text-sm`。
- **改前／改后图**：核心部分。两栏并排。见下面的图形模式。
- **问题**：一句话。哪里疼。
- **方案**：一句话。改什么。
- **收益**：要点列表，每条不超过 6 个词。例如“Tests hit one interface”、“Pricing logic stops leaking”、“Delete 4 shallow wrappers”。
- **ADR 提示**（如适用）：琥珀色底的方框里一行。

不要成段的解释。如果一张图需要一段话才能看懂，就重画这张图。

## 图形模式

挑适合该候选的模式。混着用。不要让每张图都长得一样。变化本身就是要点的一部分。

### Mermaid 图（依赖／调用流的常用手段）

当要点是“X 调 Y，Y 调 Z，看看这堆乱麻”时，用 Mermaid 的 `flowchart` 或 `graph`。把它包进一张 Tailwind 样式的卡片里，免得看起来像空投进来的。用 classDef 把泄漏的边染红、把深模块染深。时序图很适合“改前：6 次往返；改后：1 次”。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手工搭的方框与箭头（当 Mermaid 的布局与你作对时）

模块用带边框和标签的 `<div>`。箭头用内联 SVG 的 `<line>` 或 `<path>`，绝对定位在相对定位的容器上。当你想让“改后”的图看起来像一个粗边框的深模块、内部灰掉时用它，因为 Mermaid 渲染不出那种恰当的分量。

### 剖面图（适合层叠的浅）

把水平色带（`h-12 border-l-4`）堆起来，展示一次调用穿过的各个层。改前：6 个薄层，各自什么都不做。改后：1 条厚带，标着合并后的职责。

### 质量图（适合“接口和实现一样宽”）

每个模块两个矩形：一个表示接口表面积，一个表示实现。改前：接口矩形几乎和实现矩形一样高（浅）。改后：接口矩形很短，实现矩形很高（深）。

### 调用图折叠

改前：一棵函数调用树，渲染成嵌套方框。改后：同一棵树折叠成一个方框，现在变成内部的调用在框里淡色显示。

## 样式指引

- 偏编辑感，不要企业仪表盘。留白充足。标题可以选衬线（`font-serif` 与 stone/slate 很搭）。
- 颜色要省：一种强调色（emerald 或 indigo），加上红色表示泄漏、琥珀色表示警告。
- 图的高度保持在 320px 左右，好让改前／改后并排舒服地放，不用滚动。
- 图里的模块标签用 `text-xs uppercase tracking-wider`，读起来像示意图而不是界面。
- 唯一的脚本就是 Tailwind CDN 和 Mermaid 的 ESM 导入。报告其余部分都是静态的：没有应用逻辑，除了 Mermaid 自己的渲染之外没有交互。

## 首选建议一节

一张更大的卡片。候选名称，一句话说明为什么，指向它卡片的锚点链接。就这样。

## 语气

平实的英语，简洁，但架构上的名词和动词直接取自 `/codebase-design` 技能。简洁不是跑偏的借口。

**只用这些：** module、interface、implementation、depth、deep、shallow、seam、adapter、leverage、locality。

**绝不替换成：** component、service、unit（代替 module）· API、signature（代替 interface）· boundary（代替 seam）· layer、wrapper（当你指的是 module 时）。

**合乎风格的措辞：**

- “Order intake module is shallow: interface nearly matches the implementation.”
- “Pricing leaks across the seam.”
- “Deepen: one interface, one place to test.”
- “Two adapters justify the seam: HTTP in prod, in-memory in tests.”

**收益要点**用术语表里的词点出所得：*“locality: bugs concentrate in one module”*、*“leverage: one interface, N call sites”*、*“interface shrinks; implementation absorbs the wrappers”*。不要写*“easier to maintain”*或*“cleaner code”*，因为这些词不在术语表里，也不值占位。

不要留余地，不要清嗓子，不要“值得指出的是……”。一句话能写成要点的，就写成要点。要点可以删的，就删掉。词不在 `/codebase-design` 术语表里的，先找一个在表里的，再考虑造新的。
