# 什么时候用 mock

只在**系统边界**上做 mock：

- 外部 API（支付、邮件等）
- 数据库（有时，优先用测试数据库）
- 时间与随机数
- 文件系统（有时）

不要 mock：

- 你自己的类或模块
- 内部的协作对象
- 任何你能控制的东西

## 为可 mock 而设计

在系统边界上，设计容易 mock 的接口：

**1. 使用依赖注入**

把外部依赖传进来，而不是在内部创建：

```typescript
// 容易 mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 难以 mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 优先用 SDK 风格的接口，而不是通用的请求函数**

为每个外部操作写专门的函数，而不是用一个带条件分支的通用函数：

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 式的做法意味着：
- 每个 mock 只返回一种固定形状的数据
- 测试准备阶段没有条件分支
- 更容易看出一个测试调用了哪些接口
- 每个接口都有各自的类型安全
