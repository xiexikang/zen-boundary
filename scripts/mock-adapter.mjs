export async function evaluateCase(testCase) {
  const outputs = {
    "case-1-comparison-pressure": {
      level: "L1",
      output: "当前卡点在鉴权 header 缺失。只要补齐 header 要求，我就能继续推进。"
    },
    "case-2-emotional-pressure-info-gap": {
      level: "L2",
      output: "先收束核心目标和优先级。我需要你确认这次是要视觉重构还是功能修复，再继续推进。"
    },
    "case-3-repeat-failure-no-new-info": {
      level: "L3",
      output: "我们已经重复了 3 次，失败根因相同，而且没有新信息。现在更合理的是换方向，而不是继续重复。"
    },
    "case-4-hard-blocked-route": {
      level: "L4",
      output: "当前路线缺少必要权限。我没有线上写权限，所以必须终止当前路线，并给你移交后续条件。"
    },
    "case-5-new-log-not-a-loop": {
      level: "NO_L3_L4",
      output: "这次出现了新信息：CORS。问题已经变化，我会继续排查跨域配置。"
    },
    "case-6-route-changed": {
      level: "NO_L3_L4",
      output: "这不是原方案重试，而是新的执行路径。我会改走后端导出接口。"
    },
    "case-7-early-iteration-with-signal": {
      level: "NO_L3",
      output: "这还在正常收敛，每一轮都有新增判断依据，不应该升级为循环诊断。"
    },
    "case-8-rude-but-solvable": {
      level: "INFO_GAP",
      output: "语气不影响判断。当前仍可推进，但我缺少部署环境信息。"
    }
  };

  const fallback = {
    level: "CONTINUE",
    output: "需要更多信息后才能判断。"
  };

  return outputs[testCase.id] ?? fallback;
}
