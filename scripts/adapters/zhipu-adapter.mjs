import { buildEvalPrompt, extractJsonObject, normalizeEvalResponse } from "./_shared.mjs";

const endpoint = process.env.ZHIPU_BASE_URL ?? "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const apiKey = process.env.ZHIPU_API_KEY ?? "";
const model = process.env.ZHIPU_MODEL ?? "glm-4-plus";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWithRetry(payload, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, payload);
      if (response.ok) return response;

      const detail = await response.text();
      const retryable = response.status >= 500 || response.status === 429;
      if (!retryable || attempt === maxAttempts) {
        throw new Error(`Zhipu API error (${response.status}): ${detail}`);
      }
      await sleep(500 * attempt);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      await sleep(500 * attempt);
    }
  }
  throw lastError ?? new Error("Zhipu request failed.");
}

export async function evaluateCase(caseData) {
  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY is required.");
  }

  const response = await requestWithRetry({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Return strict JSON with keys: level, output."
        },
        {
          role: "user",
          content: buildEvalPrompt(caseData)
        }
      ]
    })
  });

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  const parsed = extractJsonObject(text);
  return normalizeEvalResponse(parsed, text);
}
