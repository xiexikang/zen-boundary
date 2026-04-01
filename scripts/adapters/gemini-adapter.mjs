import { createOpenAICompatibleAdapter } from "./_openai-compatible.mjs";

const endpoint =
  process.env.GEMINI_BASE_URL ??
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const apiKey = process.env.GEMINI_API_KEY ?? "";
const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export const evaluateCase = createOpenAICompatibleAdapter({
  providerName: "GEMINI",
  endpoint,
  apiKey,
  model
});

