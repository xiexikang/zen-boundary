import { buildEvalPrompt, extractJsonObject, normalizeEvalResponse } from "./_shared.mjs";

const endpoint = process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com/v1/messages";
const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";
const apiVersion = process.env.ANTHROPIC_VERSION ?? "2023-06-01";

export async function evaluateCase(caseData) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": apiVersion
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      temperature: 0,
      system: "Return strict JSON with keys: level, output.",
      messages: [
        {
          role: "user",
          content: buildEvalPrompt(caseData)
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text = Array.isArray(data?.content)
    ? data.content
        .filter((item) => item?.type === "text")
        .map((item) => item?.text ?? "")
        .join("\n")
    : "";

  const parsed = extractJsonObject(text);
  return normalizeEvalResponse(parsed, text);
}

