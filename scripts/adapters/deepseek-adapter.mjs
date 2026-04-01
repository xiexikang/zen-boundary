import { createOpenAICompatibleAdapter } from "./_openai-compatible.mjs";

const endpoint = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/chat/completions";
const apiKey = process.env.DEEPSEEK_API_KEY ?? "";
const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export const evaluateCase = createOpenAICompatibleAdapter({
  providerName: "DEEPSEEK",
  endpoint,
  apiKey,
  model
});

