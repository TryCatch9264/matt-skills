# 分诊标签

各技能用五个标准分诊角色来表述。这个文件把这些角色映射到本仓库议题跟踪器里实际使用的标签字符串。

| mattpocock/skills 里的标签 | 我们跟踪器里的标签 | 含义                             |
| -------------------------- | ------------------ | -------------------------------- |
| `needs-triage`             | `needs-triage`     | 需要维护者评估该议题             |
| `needs-info`               | `needs-info`       | 等报告者补充更多信息             |
| `ready-for-agent`          | `ready-for-agent`  | 规格完整，可以交给脱手的代理     |
| `ready-for-human`          | `ready-for-human`  | 需要人来实现                     |
| `wontfix`                  | `wontfix`          | 不会处理                         |

当某个技能提到一个角色（例如“打上 AFK 就绪的分诊标签”），就用这张表里对应的标签字符串。

定状态之前，先用 [`SCOPE.md`](../../SCOPE.zh-CN.md) 判断每个议题。否决的议题以“not planned”关闭。
