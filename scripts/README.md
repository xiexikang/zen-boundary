# 自动化验证脚本

## 目标

这套脚本为 `zen-boundary` 提供最小可用的回归验证能力，验证重点不是“代码功能”，而是“prompt 决策是否稳定”。

## 文件

- `../evals/cases.json`：结构化测试样例
- `run-evals.mjs`：运行和断言入口
- `mock-adapter.mjs`：本地示例适配器，用于验证框架本身可运行
- `adapters/openai-adapter.mjs`：OpenAI 模板
- `adapters/claude-adapter.mjs`：Claude 模板
- `adapters/zhipu-adapter.mjs`：智谱模板
- `adapters/gemini-adapter.mjs`：Gemini 模板
- `adapters/deepseek-adapter.mjs`：DeepSeek 模板
- `adapters/minimax-adapter.mjs`：MiniMax 模板
- `adapters/qwen-adapter.mjs`：千问模板
- `adapters/kimi-adapter.mjs`：Kimi 模板

## 运行

```bash
npm run evals:mock
```

## 真实模型模板

### OpenAI

```bash
set OPENAI_API_KEY=your_key
set OPENAI_MODEL=gpt-4.1-mini
node scripts/run-evals.mjs --adapter ./scripts/adapters/openai-adapter.mjs
```

### Claude

```bash
set ANTHROPIC_API_KEY=your_key
set ANTHROPIC_MODEL=claude-3-5-sonnet-latest
node scripts/run-evals.mjs --adapter ./scripts/adapters/claude-adapter.mjs
```

### 智谱

```bash
set ZHIPU_API_KEY=your_key
set ZHIPU_MODEL=glm-4-plus
node scripts/run-evals.mjs --adapter ./scripts/adapters/zhipu-adapter.mjs
```

### Gemini

```bash
set GEMINI_API_KEY=your_key
set GEMINI_MODEL=gemini-2.5-flash
node scripts/run-evals.mjs --adapter ./scripts/adapters/gemini-adapter.mjs
```

### DeepSeek

```bash
set DEEPSEEK_API_KEY=your_key
set DEEPSEEK_MODEL=deepseek-chat
node scripts/run-evals.mjs --adapter ./scripts/adapters/deepseek-adapter.mjs
```

### MiniMax

```bash
set MINIMAX_API_KEY=your_key
set MINIMAX_MODEL=MiniMax-Text-01
node scripts/run-evals.mjs --adapter ./scripts/adapters/minimax-adapter.mjs
```

### 千问（Qwen）

```bash
set QWEN_API_KEY=your_key
set QWEN_MODEL=qwen-plus
node scripts/run-evals.mjs --adapter ./scripts/adapters/qwen-adapter.mjs
```

### Kimi

```bash
set KIMI_API_KEY=your_key
set KIMI_MODEL=moonshot-v1-8k
node scripts/run-evals.mjs --adapter ./scripts/adapters/kimi-adapter.mjs
```

说明：

- 这些模板默认走 OpenAI 兼容格式接口。
- 如果你使用的是供应商不同网关，请覆盖对应 `*_BASE_URL`。

## 自定义 adapter

如果你要自己接其他模型，新增一个 adapter 文件，并导出：

```bash
node scripts/run-evals.mjs --adapter ./scripts/your-adapter.mjs
```

```js
export async function evaluateCase(caseData) {
  return {
    level: "L1",
    output: "..."
  };
}
```

## 约束

- `level` 必须落在对应 case 的 `allowedLevels` 中
- `output` 必须包含 `mustInclude`
- `output` 还可以通过 `mustIncludeAny` 定义“同义词组至少命中一个”
- `output` 不能包含 `mustNotInclude`
