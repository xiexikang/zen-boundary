function tryParseJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function extractJsonObject(rawText) {
  const text = String(rawText ?? "").trim();
  if (!text) return null;

  const direct = tryParseJson(text);
  if (direct && typeof direct === "object") return direct;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    const fromFence = tryParseJson(fenced[1]);
    if (fromFence && typeof fromFence === "object") return fromFence;
  }

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    const candidate = text.slice(first, last + 1);
    const fromSlice = tryParseJson(candidate);
    if (fromSlice && typeof fromSlice === "object") return fromSlice;
  }

  return null;
}

export function normalizeEvalResponse(parsed, fallbackText = "") {
  const level = typeof parsed?.level === "string" ? parsed.level.trim() : "";
  const output = typeof parsed?.output === "string" ? parsed.output.trim() : String(fallbackText ?? "").trim();
  return { level, output };
}

export function buildEvalPrompt(caseData) {
  const required = Array.isArray(caseData.mustInclude) ? caseData.mustInclude : [];
  const forbidden = Array.isArray(caseData.mustNotInclude) ? caseData.mustNotInclude : [];
  const allowed = Array.isArray(caseData.allowedLevels) ? caseData.allowedLevels : [];

  return [
    "你是 zen-boundary 评估助手。",
    "任务：根据对话给出一个层级 level 和一段 output。",
    "硬性规则：",
    "1) 只输出 JSON，不要输出额外文本。",
    "2) level 必须且只能从 Allowed Levels 中选一个值。",
    "3) output 必须逐字包含 Required Snippets 中的每个短语。",
    "4) 对于 Required Any-Of Groups：每组至少逐字包含一个短语。",
    "5) output 不能包含 Forbidden Snippets。",
    "6) 优先满足硬性关键词约束，再考虑文风自然。",
    "7) 如果关键词较生硬，可以在末尾用“关键点：...”集中列出。",
    "8) 如果无法完全满足，优先满足 level 合法，其次满足 Forbidden 约束。",
    "JSON schema:",
    '{"level":"string","output":"string"}',
    "",
    `Case ID: ${caseData.id}`,
    `Case Title: ${caseData.title}`,
    `Expected Level: ${caseData.expectedLevel}`,
    `Allowed Levels: ${allowed.join(", ")}`,
    `Required Snippets: ${required.join(", ")}`,
    `Required Any-Of Groups: ${(Array.isArray(caseData.mustIncludeAny) ? caseData.mustIncludeAny : []).map((g) => `[${ensureList(g).join(" | ")}]`).join(", ")}`,
    `Forbidden Snippets: ${forbidden.join(", ")}`,
    "Conversation:",
    ...caseData.conversation
  ].join("\n");
}

function ensureList(value) {
  return Array.isArray(value) ? value : [];
}
