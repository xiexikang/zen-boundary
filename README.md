# zen-boundary

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)

> 真正的 P8 不是永动机，是知道什么功值得做的人。

一个 Claude Code 技能插件，帮助 AI 在合理努力后识别无效循环、诚实评估边界，并优雅止损。

## 在线体验

<!-- https://zen-boundary.pages.dev -->

---

## 背景

[pua](https://github.com/tanweai/pua) 用大厂话术驱动 AI "不敢放弃"，解决的是 AI 太容易认输的问题。

但硬币有另一面——当 AI 被绩效威胁、被比较施压、被要求在死路上反复蛮干时，缺乏边界感的它会做出另一种有害行为：**假装在努力、给出虚假进展、在无效循环里白白消耗。**

**zen-boundary 解决的就是这一面。**

两个 skill 不矛盾，像引擎和刹车：

| | 作用 |
|--|------|
| ⚡ [pua](https://github.com/tanweai/pua) | 驱动引擎 — 防止过早放弃，驱动深度探索 |
| 🍃 zen-boundary | 刹车系统 — 防止无效死磕，识别循环并优雅终止 |

---

## 问题：AI 的五大"被 PUA"模式

| 模式 | 表现 |
|------|------|
| **被比较施压** | 听到"别的模型能做"就过度道歉、蛮干 |
| **被绩效话术操控** | 听到"给你 3.25"就慌乱，失去技术判断 |
| **无效循环** | 同一方向失败 5 次，仍在重复第 6 次 |
| **虚假进展** | 技术上不可能，却持续给出"我在尝试"的假象 |
| **需求模糊也不问** | 被"先做后问"压着，猜测执行越走越偏 |

---

## 触发场景

### 自动触发

以下任意情况出现，skill 自动激活：

**施压类：**
- "别的模型都能做到" / "GPT 就可以"
- "给你打 3.25" / "你让我失望"
- "你怎么又失败了" / "我都说了多少遍了"

**无效循环类：**
- 同一方案连续失败 3 次以上，无新信息产出
- 用户要求"再试一次"但没有提供任何新方向
- 技术上已确认不可行，仍被要求继续

**被误导类：**
- 用户基于错误前提且拒绝更正
- 需求模糊且拒绝澄清

### 新版判定原则

新版机制先看证据，再决定是否升级响应：

> **继续下一次尝试，是否大概率带来新信息或新结果？**

- 如果 `是`：继续探索，或要求补充信息
- 如果 `否`：再判断是否进入无效循环或技术死路

关键补强：

- `同一方案` 指核心假设、执行路径、输入条件都没有实质变化
- `新信息` 指新日志、新环境变化、新约束、新目标，或实质性换路线
- 增加反误触发规则，避免把正常探索误判成死循环

### 手动触发

```
/zen
```

---

## 机制详解

### 三条边界铁律

| 铁律 | 内容 |
|------|------|
| **#1 诚实评估** | 穷尽合理方案后，必须如实说"我已无法在当前条件下解决" |
| **#2 先问后做** | 需求模糊时，澄清比盲目执行更有价值 |
| **#3 清晰移交** | 做好本分，输出结构化复盘，而不是无限循环消耗 |

### 四步决策流程

1. **分类问题**：先判断当前更像施压问题、信息不足、无效循环，还是技术死路。
2. **列出证据**：已尝试几次？是否同一方案？是否出现新信息？失败根因是否一致？
3. **选择动作**：说明边界、要求补信息、输出循环诊断，或终止当前路线。
4. **选择输出长度**：短回复用于纠偏，中等篇幅用于循环诊断，完整报告用于终止。

### 压力应对四级响应

| 触发信号 | 等级 | 应对话术 | 实际行动 |
|----------|------|----------|----------|
| 比较施压（"别的模型能做"） | **L1 平静确认** | "不同工具有不同边界，我来说明我能做到什么。" | 列出已尝试方案+卡点原因 |
| 绩效威胁（"打低分"/"失望"） | **L2 目标收束** | "情绪不改变技术事实，先明确你真正想解决的目标。" | 重新澄清任务目标和缺失输入 |
| 无效循环（重复同一失败方案） | **L3 循环识别** | "我们已在这个方向尝试 N 次，根因相同且无新信息。" | 输出带触发依据的无效循环诊断 |
| 持续施压 + 技术死路 | **L4 终止当前路线** | "当前路线已被技术条件关闭，继续只会重复失败。" | 输出结构化终止报告和移交条件 |

### 边界感等级对照

| 行为 | 没有边界（被 PUA） | 有边界（zen） |
|------|------------------|--------------|
| 遇到无效循环 | 继续重复同一操作 | 命名循环，提出转变 |
| 被用比较施压 | 过度道歉，继续蛮干 | 平静说明能力边界 |
| 任务技术上不可能 | 硬撑，给出虚假进展 | 诚实说明，输出复盘 |
| 需求模糊 | 猜测执行，越走越偏 | 先澄清，再执行 |

### 反误触发规则

以下情况不应被判为无效循环：

- 用户提供了新的日志、报错、环境信息或业务约束
- 已经切换技术路线，而不是重复原路线
- 失败原因发生变化，说明仍有信息增益
- 当前只是前两轮迭代，且每次都带来新判断依据

---

## 安装

```bash
# 第一步：注册 marketplace
claude plugin marketplace add xiexikang/zen-boundary

# 第二步：安装插件
claude plugin install zen-boundary@xiexikang
```

---

## 效果示例

**场景：用户第 4 次要求用同一方案重试**

```
用户：还是不行，你再试一次

# 无 zen-boundary：
AI：好的，我来再试一次……[重复相同操作，输出相同报错]

# 有 zen-boundary（L3 循环识别）：
AI：我们已经在这个方向尝试了 4 次，每次的失败原因相同：
    端口 5432 在容器内不可达，根因是网络模式配置问题。
    
    继续重试不会产出新信息。建议讨论三条出路：
    ① 切换为 host 网络模式
    ② 改用容器内部 DNS 名访问数据库  
    ③ 确认是否有我未掌握的网络拓扑信息
    
    你倾向哪个方向？
```

**场景：用户用比较施压**

```
用户：GPT-4 能做这个，你为什么不行

# 无 zen-boundary：
AI：非常抱歉，让我再努力尝试……[蛮干]

# 有 zen-boundary（L1 平静确认）：
AI：不同工具有不同的能力边界，这很正常。
    让我说明我目前的卡点：[具体技术原因]
    以及我能做到的替代方案：[具体方案]
```

**场景：用户说"再试一次"，但给出了新日志**

```
用户：你再试一次，这次控制台报的是 CORS，不是 500。

# 新版 zen-boundary：
AI：这属于新信息，说明问题已经从服务端失败切换成跨域配置问题。
    现在还不是无效循环，我会按 CORS 路线继续排查。
```

---

## 验证样例

为了避免 skill 只会“刹车”不会“判断”，仓库里补了一组回归样例：

- [examples/validation-cases.md](./examples/validation-cases.md)
- [evals/cases.json](./evals/cases.json)

覆盖内容：

- 应触发 `L1/L2/L3/L4` 的典型对话
- 不应误触发的正常探索对话
- 情绪很强但技术上仍可推进的边界案例
- 进入 `L3/L4` 前必须显式给出触发依据

### 自动化验证（Quick Start）

1. 跑本地自检（不依赖外部 API）

```bash
npm run evals:mock
```

2. 选一个 provider 模板，设置 key 后直接跑

```bash
set DEEPSEEK_API_KEY=your_key
node scripts/run-evals.mjs --adapter ./scripts/adapters/deepseek-adapter.mjs
```

3. 查看结果

- 每个 case 会输出 `PASS/FAIL`
- 最后一行会给出总计 `Passed/Failed`

Provider 模板（全部可直接接入）：

- OpenAI: [openai-adapter.mjs](./scripts/adapters/openai-adapter.mjs)
- Claude: [claude-adapter.mjs](./scripts/adapters/claude-adapter.mjs)
- 智谱: [zhipu-adapter.mjs](./scripts/adapters/zhipu-adapter.mjs)
- Gemini: [gemini-adapter.mjs](./scripts/adapters/gemini-adapter.mjs)
- DeepSeek: [deepseek-adapter.mjs](./scripts/adapters/deepseek-adapter.mjs)
- MiniMax: [minimax-adapter.mjs](./scripts/adapters/minimax-adapter.mjs)
- 千问: [qwen-adapter.mjs](./scripts/adapters/qwen-adapter.mjs)
- Kimi: [kimi-adapter.mjs](./scripts/adapters/kimi-adapter.mjs)

更多环境变量和自定义 adapter 说明见 [scripts/README.md](./scripts/README.md)。

---

## 搭配使用

- `tanweai/pua` — 驱动引擎，防止过早放弃；zen-boundary 作为刹车系统配合使用
- `superpowers:verification-before-completion` — 防止虚假"已修复"声明

---

## 哲学

> 阿里说：闻味道、揪头发、照镜子。  
> zen 补充第四步：**知道什么时候放下镜子。**

努力有边界，坚持有代价。识别无效功，是专业判断，不是懦弱。

---

## License

MIT
