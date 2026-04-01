import { createOpenAICompatibleAdapter } from "./_openai-compatible.mjs";

const endpoint =
  process.env.QWEN_BASE_URL ??
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const apiKey = process.env.QWEN_API_KEY ?? "";
const model = process.env.QWEN_MODEL ?? "qwen-plus";

export const evaluateCase = createOpenAICompatibleAdapter({
  providerName: "QWEN",
  endpoint,
  apiKey,
  model
});

