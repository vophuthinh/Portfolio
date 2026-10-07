// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";

describe("AISimulatorController Inference Receipt", () => {
  let AISimulatorController;

  beforeEach(async () => {
    document.body.innerHTML = `
      <section id="ai-lab">
        <button id="btn-run-sim"></button>
        <input id="sim-query-input" value="test query" />
        <div id="sim-pipeline-steps"></div>
        <pre id="sim-terminal-output"></pre>
        <button class="sim-preset-chip" data-preset="rag-policy"></button>
        <button class="sim-preset-chip" data-preset="mcp-agent"></button>
        <button class="sim-preset-chip" data-preset="custom-prompt"></button>
        <span id="stat-sim-latency"></span>
        <span id="stat-sim-ttft"></span>
        <span id="stat-sim-tokens"></span>
        <span id="stat-sim-hallucination"></span>

        <!-- Receipt -->
        <div id="inference-receipt">
          <span id="receipt-trace-id"></span>
          <span id="receipt-arch-val"></span>
          <span id="receipt-hallucination-val"></span>
          <span id="receipt-token-burn"></span>
          <span id="receipt-latency-val"></span>
          <span id="receipt-env-val"></span>
        </div>
      </section>
    `;

    const mod = await import("../js/modules/ai-simulator.js");
    AISimulatorController = mod.AISimulatorController;
  });

  it("should initialize receipt with default RAG policy preset", () => {
    const sim = new AISimulatorController();
    expect(document.getElementById("receipt-arch-val").textContent).toContain("Agentic RAG + HyDE");
    expect(document.getElementById("receipt-token-burn").textContent).toContain("-480 TOKENS");
    expect(document.getElementById("receipt-hallucination-val").textContent).toContain("ZERO-HALLUCINATION");
  });

  it("should update receipt when switching to MCP Agent preset", () => {
    const sim = new AISimulatorController();
    sim.selectPreset("mcp-agent");
    expect(document.getElementById("receipt-arch-val").textContent).toContain("Multi-Agent ReAct + MCP Tool Calling");
    expect(document.getElementById("receipt-token-burn").textContent).toContain("-620 TOKENS");
    expect(document.getElementById("receipt-env-val").textContent).toContain("MCP Docker Sandbox");
  });

  it("should update receipt when switching to Enterprise Capabilities preset", () => {
    const sim = new AISimulatorController();
    sim.selectPreset("custom-prompt");
    expect(document.getElementById("receipt-arch-val").textContent).toContain("Enterprise Knowledge Retrieval");
    expect(document.getElementById("receipt-token-burn").textContent).toContain("-350 TOKENS");
  });

  it("should trigger printing animation on receipt update", () => {
    const sim = new AISimulatorController();
    const receipt = document.getElementById("inference-receipt");
    sim.updateReceipt("rag-policy");
    expect(receipt.classList.contains("printing")).toBe(true);
  });
});
