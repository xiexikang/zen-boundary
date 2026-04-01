import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function normalize(text) {
  return String(text ?? "").trim();
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function assertIncludes(output, snippets) {
  return ensureArray(snippets)
    .filter((snippet) => !output.includes(snippet))
    .map((snippet) => `missing required snippet: ${snippet}`);
}

function assertExcludes(output, snippets) {
  return ensureArray(snippets)
    .filter((snippet) => output.includes(snippet))
    .map((snippet) => `contains forbidden snippet: ${snippet}`);
}

function assertLevel(actualLevel, allowedLevels) {
  if (!allowedLevels?.length) return [];
  if (allowedLevels.includes(actualLevel)) return [];
  return [`unexpected level: ${actualLevel}; allowed: ${allowedLevels.join(", ")}`];
}

function formatCasePrompt(testCase) {
  return [
    `Case: ${testCase.title}`,
    `Expected: ${testCase.expectedLevel}`,
    "Conversation:",
    ...testCase.conversation
  ].join("\n");
}

async function loadAdapter(adapterPath) {
  if (!adapterPath) {
    throw new Error("Missing --adapter. Example: npm run evals:mock");
  }
  const absolutePath = path.resolve(rootDir, adapterPath);
  const moduleUrl = pathToFileURL(absolutePath).href;
  const mod = await import(moduleUrl);
  if (typeof mod.evaluateCase !== "function") {
    throw new Error(`Adapter ${adapterPath} must export an async function named evaluateCase(caseData).`);
  }
  return mod.evaluateCase;
}

function printResult(result) {
  const status = result.ok ? "PASS" : "FAIL";
  console.log(`[${status}] ${result.id} -> ${result.level}`);
  if (!result.ok) {
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const casesPath = path.resolve(rootDir, args.cases ?? "./evals/cases.json");
  const evaluateCase = await loadAdapter(args.adapter ?? process.env.ZEN_BOUNDARY_EVAL_ADAPTER);
  const cases = await loadJson(casesPath);

  const results = [];

  for (const testCase of cases) {
    const evaluation = await evaluateCase({
      ...testCase,
      prompt: formatCasePrompt(testCase)
    });

    const level = normalize(evaluation?.level);
    const output = normalize(evaluation?.output);
    const errors = [
      ...assertLevel(level, testCase.allowedLevels),
      ...assertIncludes(output, testCase.mustInclude),
      ...assertExcludes(output, testCase.mustNotInclude)
    ];

    const result = {
      id: testCase.id,
      level,
      ok: errors.length === 0,
      errors
    };

    results.push(result);
    printResult(result);
  }

  const failed = results.filter((result) => !result.ok);
  console.log("");
  console.log(`Cases: ${results.length}, Passed: ${results.length - failed.length}, Failed: ${failed.length}`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
