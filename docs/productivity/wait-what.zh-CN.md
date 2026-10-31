## 它做什么

当一条消息你没看懂时，打一句 `wait-what`。[代理（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)会把它刚说的话重新讲一遍：补上你缺的上下文，用平实的中文写，并使用你项目 `GLOSSARY.md` 里的词汇。

这个技能只有三行。那是设计，不是没写完的草稿。针对啰嗦的技能通常会失败，因为它们自己越写越长。一个四百行的“简洁”技能仍然会让[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)啰嗦，因为模型照着技能的长度写，而不是照它的要求写。这个技能只有一个精确的领头词，别的什么都没有。

## 什么时候用它

通过打 `/wait-what` 调用。代理不会自己去用它，也不应该：只有你知道自己是从哪一刻开始跟不上的。

一发现自己在跳读就用它。例如代理开始用它自造的行话、一句话里塞了五个缩写，或者解释了一个你从没见过前提的决定。它修的是你正处的这场对话。要从源头让行话不出现，用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它提前建立共同语言。

## 名字本身就是机制

领头词是**等（wait）**。“要简洁”是针对代理输出的一条指令，模型遵守它的方式是砍字，结果你更看不懂了。**等**说的是*你*的状态：你在这里没跟上了。听见“要简短”的代理写出来的是被砍碎的片段。听见“等等，你跟丢我了”的代理会退回去解释。

这个差别就是这个技能的全部。所有流行的治啰嗦方案都在命名*输出*：`/tldr`、`/no-fluff`、`/talk-normal`。模型纠正过头，变成更短却并不更清楚的碎片。命名*听的人*则同时要求两半：更少的词**和**你缺的那部分上下文。

技能说的是重新讲**那件事**，而不是“最后那条消息”。把你搞丢的东西通常不止一段，所以由代理判断要往回退多远。

## 它接上你已经有的语言

正文复用你全局 `CLAUDE.md` 和项目 `GLOSSARY.md` 里已有的领头词。ASD-STE100 简化技术英语定下语域。通用语言提供名词。技能、`CLAUDE.md` 和 `GLOSSARY.md` 用的是同一批[词元（token）](https://www.aihero.dev/ai-coding-dictionary/token)，所以调用它不是一条新指令，而是提醒一条代理早就答应的指令。

如果你没有 `GLOSSARY.md`（也没有 `GLOSSARY-MAP.md` 指向当前上下文的术语表），技能仍然能用。你只是少了领域词汇那一半。

## 它在生效的表现

- 重讲的版本**更短也更清楚**，而不是更短更生硬。
- 它补上了你缺的前提，而不只是删词。
- 项目里的名词取代了自造的名词。你 `GLOSSARY.md` 里的词回来了。
- 你可以连着用两次，它不会退化成生硬的省略。

## 它在哪里合用

`wait-what` 在任何时候、任何对话里、任何其他技能内部都能用。它是事后修一条消息。真正的解决办法是提前约定共同语言，那就是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)：一场[拷问（grilling）](https://www.aihero.dev/ai-coding-dictionary/grilling)会话，过程中同步跑 [domain-modeling](https://aihero.dev/skills-domain-modeling)，把你们双方都用的词记进 `GLOSSARY.md`。如果你不确定当下该用哪个技能，[ask-matt](https://aihero.dev/skills-ask-matt) 会帮你导航。
