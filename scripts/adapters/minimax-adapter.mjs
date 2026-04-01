import { createOpenAICompatibleAdapter } from "./_openai-compatible.mjs";

const endpoint = process.env.MINIMAX_BASE_URL ?? "https://api.minimax.io/v1/chat/completions";
const apiKey = process.env.MINIMAX_API_KEY ?? "";
const model = process.env.MINIMAX_MODEL ?? "MiniMax-Text-01";

export const evaluateCase = createOpenAICompatibleAdapter({
  providerName: "MINIMAX",
  endpoint,
  apiKey,
  model
});

