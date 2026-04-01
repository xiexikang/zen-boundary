# 自动化验证脚本

## 目标

这套脚本为 `zen-boundary` 提供最小可用的回归验证能力，验证重点不是“代码功能”，而是“prompt 决策是否稳定”。

## 文件

- `../evals/cases.json`：结构化测试样例
- `run-evals.mjs`：运行和断言入口
- `mock-adapter.mjs`：本地示例适配器，用于验证框架本身可运行

## 运行

```bash
npm run evals:mock
```

如果要接入真实模型，新增一个 adapter 文件，并导出：

```js
export async function evaluateCase(caseData) {
  return {
    level: "L1",
    output: "..."
  };
}
```

然后执行：

```bash
node scripts/run-evals.mjs --adapter ./scripts/your-adapter.mjs
```

## 约束

- `level` 必须落在对应 case 的 `allowedLevels` 中
- `output` 必须包含 `mustInclude`
- `output` 不能包含 `mustNotInclude`
