import { createOpenAICompatibleAdapter } from "./_openai-compatible.mjs";

const endpoint = process.env.KIMI_BASE_URL ?? "https://api.moonshot.cn/v1/chat/completions";
const apiKey = process.env.KIMI_API_KEY ?? "";
const model = process.env.KIMI_MODEL ?? "moonshot-v1-8k";

export const evaluateCase = createOpenAICompatibleAdapter({
  providerName: "KIMI",
  endpoint,
  apiKey,
  model
});

