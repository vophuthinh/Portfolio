/**
 * Interactive AI Agent & RAG Pipeline Simulator
 * An interactive "Show, Don't Tell" playground showcasing production Agentic RAG,
 * Model Context Protocol (MCP) tool routing, and grounding guardrails.
 */

import { escapeHtml } from '../utils.js';

export class AISimulatorController {
  constructor() {
    this.container = document.getElementById('ai-lab');
    if (!this.container) return;

    this.runBtn = document.getElementById('btn-run-sim');
    this.queryInput = document.getElementById('sim-query-input');
    this.pipelineStepsContainer = document.getElementById('sim-pipeline-steps');
    this.terminalOutput = document.getElementById('sim-terminal-output');
    this.presetChips = document.querySelectorAll('.sim-preset-chip');

    this.statLatency = document.getElementById('stat-sim-latency');
    this.statTtft = document.getElementById('stat-sim-ttft');
    this.statTokens = document.getElementById('stat-sim-tokens');
    this.statHallucination = document.getElementById('stat-sim-hallucination');

    // Inference Run Receipt (Thermal Print Benchmark Ticket)
    this.receiptEl = document.getElementById('inference-receipt');
    this.receiptTraceId = document.getElementById('receipt-trace-id');
    this.receiptArchVal = document.getElementById('receipt-arch-val');
    this.receiptHallucinationVal = document.getElementById('receipt-hallucination-val');
    this.receiptTokenBurn = document.getElementById('receipt-token-burn');
    this.receiptLatencyVal = document.getElementById('receipt-latency-val');
    this.receiptEnvVal = document.getElementById('receipt-env-val');

    this.skip = false;
    this.isExecuting = false;
    this.activeMode = 'rag'; // 'rag' | 'mcp'

    this.presets = {
      'rag-policy': {
        mode: 'rag',
        query: 'Tìm kiếm chính sách bảo mật dữ liệu & quy định LLM nội bộ HPT 2026',
        steps: [
          { title: 'Intent Classification & Routing', node: 'Router', tool: 'SemanticRouter', detail: 'Route: INTERNAL_SEC_POLICY (confidence: 0.994)', latency: 12 },
          { title: 'HyDE Query Expansion', node: 'HyDE', tool: 'EmbeddingEngine', detail: 'Generated 1536-dim hypothetical dense embedding vector', latency: 42 },
          { title: 'Hybrid Dense + BM25 Vector Search', node: 'Qdrant', tool: 'ChromaDB / Qdrant', detail: 'Scanned 42,000 document chunks. Top cosine: 0.892', latency: 68 },
          { title: 'Cross-Encoder Reranker', node: 'Reranker', chunks: { total: 12, keep: 3 }, tool: 'BGE-Reranker-Large', detail: 'Filtered 12 candidate chunks down to top 3 context slices', latency: 34 },
          { title: 'Self-Reflection & Hallucination Guardrail', node: 'Guardrail', tool: 'LlamaGuard + FactCheck', detail: 'Groundedness verified: 100% (0 ungrounded claims)', latency: 28 },
          { title: 'Streaming Response Synthesis', node: 'LLM', tool: 'vLLM / Enterprise LLM', detail: 'Deterministic context injected with inline source citations', latency: 75 }
        ],
        output: `### [XÁC THỰC BỞI HPT SEC-GUARDRAIL // CHÍNH SÁCH 2026]

Theo quy chế an toàn thông tin & bảo mật dữ liệu AI nội bộ HPT (Ban hành 2026):

1. **Quyền riêng tư & Phân loại dữ liệu**:
   - Mọi truy vấn gửi tới LLM đều qua tầng **Data Masking & PII Redaction** tự động (loại bỏ CCCD, API Key, thông tin khách hàng).
   - Tuyệt đối không huấn luyện (train/fine-tune) trên dữ liệu nhạy cảm của khách hàng ngân hàng & tài chính.

2. **Kiến trúc RAG không ảo giác**:
   - Hệ thống áp dụng kiểm tra **Strict Groundedness**: Nếu độ tương đồng cosine < 0.75 hoặc không tìm thấy tài liệu căn cứ, Agent sẽ trả về thông báo từ chối minh bạch thay vì tự suy diễn (Zero Hallucination).

*(Tham chiếu: Document ID #SEC-HPT-2026-v2.1 • Latency: 259ms • Groundedness: 100%)*`
      },
      'mcp-agent': {
        mode: 'mcp',
        query: 'Phân tích hiệu năng hệ thống RAG Q2 và thực thi script kiểm tra độ trễ P99',
        steps: [
          { title: 'Planner Agent Decomposition', node: 'Planner', tool: 'ReAct Supervisor', detail: 'Phân tích nhiệm vụ thành 3 sub-tasks tuần tự', latency: 18 },
          { title: 'MCP Tool Call 1: Database Query', node: 'MCP: DB', tool: 'mcp://timescale-db/query_metrics', detail: 'Lấy 85,000 bản ghi telemetry truy vấn Q2-2026', latency: 55 },
          { title: 'MCP Tool Call 2: Code Sandbox', node: 'MCP: Sandbox', tool: 'mcp://python-sandbox/calc_percentiles', detail: 'Tính toán P50=42ms, P95=85ms, P99=140ms; lỗi 0.01%', latency: 62 },
          { title: 'Safety & Permission Validation', node: 'Security Gate', tool: 'MCP Security Gate', detail: 'Sandbox cô lập: Read-only access, CPU quota: 25%', latency: 15 },
          { title: 'Final Agent Synthesis', node: 'Synthesis', tool: 'Autonomous Synthesizer', detail: 'Tổng hợp báo cáo định dạng Markdown & đề xuất tối ưu hóa', latency: 45 }
        ],
        output: `### [KẾT QUẢ THỰC THI MULTI-AGENT QUA GIAO THỨC MCP]

Agent đã thực thi thành công 2 MCP Tools trong môi trường sandbox an toàn:

- **Tổng số truy vấn phân tích**: 85,420 lượt (Trung bình 850+ Q&A/ngày)
- **Độ trễ trung bình (P50)**: 42ms
- **Độ trễ ngưỡng cao (P95)**: 85ms
- **Độ trễ tối đa (P99)**: 140ms
- **Tỉ lệ hoàn thành thành công**: 99.98%

**Đánh giá của Agent**:
Kiến trúc Hybrid Search kết hợp Caching lớp 1 đã giảm 35% chi phí token API và duy trì độ ổn định tuyệt đối trong giờ cao điểm.`
      },
      'voice-agent': {
        mode: 'rag',
        query: 'Voice: "Lyly, tóm tắt lịch họp chiều nay và nhắc tôi gửi báo cáo"',
        receipt: { arch: 'Realtime Voice Agent (STT → Agentic RAG → TTS) over WebSocket', burn: '-410 TOKENS', p99: '< 320ms first audio / P99: 290ms', env: 'WebSocket Gateway // FastAPI + Qdrant + Gemini' },
        steps: [
          { title: 'Streaming Speech-to-Text', node: 'STT', tool: 'WebSocket Audio Gateway', detail: 'Partial transcript streamed in 20ms frames; end-of-speech detected', latency: 38 },
          { title: 'Barge-in & Interrupt Handling', node: 'VAD', tool: 'VAD + Interrupt Controller', detail: 'No overlap detected; TTS channel reserved', latency: 8 },
          { title: 'Calendar & Memory Retrieval', node: 'Retrieval', tool: 'Qdrant hybrid search', detail: 'Pulled 4 meetings and 1 pending action item for today', latency: 44, chunks: { total: 9, keep: 4 } },
          { title: 'Tool Call: Create Reminder', node: 'MCP: Reminder', tool: 'mcp://tasks/create_reminder', detail: 'Reminder "Send report" scheduled for 16:30 (write scope approved)', latency: 31 },
          { title: 'Streaming Answer + TTS', node: 'LLM + TTS', tool: 'Gemini + streaming TTS', detail: 'First audio chunk emitted before full answer is generated', latency: 52 }
        ],
        output: `### [VOICE AGENT // LYLY]

**You said:** "Tóm tắt lịch họp chiều nay và nhắc tôi gửi báo cáo."

**Summary (4 meetings):**
- 13:30 Sprint review, Room B
- 14:30 Client sync, call link attached
- 15:15 RAG evaluation review
- 16:00 1:1 with manager

**Done:** reminder "Send report" set for 16:30.

*(First audio in ~290ms. Barge-in supported: interrupt me any time.)*`
      },
      'self-heal': {
        mode: 'rag',
        query: 'Retrieval fails: "Doanh thu Q3 theo khu vực" returns low-confidence chunks',
        receipt: { arch: 'Self-Healing Corrective RAG (retry + query rewrite + web fallback)', burn: '-690 TOKENS', p99: '< 380ms / P99: 340ms', env: 'Qdrant + Corrective RAG loop // Azure OpenAI' },
        steps: [
          { title: 'First Retrieval Attempt', node: 'Retrieval', tool: 'Qdrant hybrid search', detail: 'Top cosine 0.52 < 0.75 threshold: retrieval marked UNRELIABLE', latency: 46, chunks: { total: 12, keep: 1 } },
          { title: 'Relevance Grader', node: 'Grader', tool: 'LLM-as-judge', detail: 'Verdict: INSUFFICIENT. Triggering corrective loop (not answering yet)', latency: 24 },
          { title: 'Query Rewrite & Decomposition', node: 'Rewrite', tool: 'QueryRewriter', detail: 'Split into: "Q3 revenue" + "region breakdown" + metadata filter fy=2026', latency: 31 },
          { title: 'Second Retrieval Attempt', node: 'Retry', tool: 'Qdrant + metadata filter', detail: 'Top cosine 0.91. 3 grounded chunks from finance_q3.xlsx', latency: 52, chunks: { total: 12, keep: 3 } },
          { title: 'Grounding Guardrail', node: 'Guardrail', tool: 'LlamaGuard + FactCheck', detail: 'Groundedness 100%. Every number traced to a source cell', latency: 27 },
          { title: 'Cited Answer Synthesis', node: 'LLM', tool: 'Enterprise LLM', detail: 'Answer generated with inline citations', latency: 58 }
        ],
        output: `### [SELF-HEALING RETRIEVAL // CORRECTIVE RAG]

**Attempt 1 failed quality gate** (cosine 0.52 < 0.75), so the agent did NOT answer from weak context.

**Attempt 2 (after query rewrite + filter):**
- **APAC:** 41% of Q3 revenue
- **EMEA:** 33%
- **Americas:** 26%

*(Sources: finance_q3.xlsx!B4:D6 • Groundedness: 100% • 1 corrective retry)*`
      },
      'compare': {
        mode: 'rag',
        query: 'Compare: Naive RAG vs Agentic RAG on "Chính sách nghỉ phép 2026 của HPT?"',
        receipt: { arch: 'Naive RAG vs Agentic RAG (side-by-side evaluation)', burn: '-520 TOKENS', p99: '< 300ms / P99: 270ms', env: 'Eval Harness // Qdrant + BGE Reranker + Guardrail' },
        steps: [
          { title: 'Naive RAG: Top-k Vector Only', node: 'Naive: top-k', tool: 'Dense vector search (k=3)', detail: 'Retrieved 3 chunks: 2 from the 2024 policy (stale), 1 unrelated', latency: 40, chunks: { total: 12, keep: 3 } },
          { title: 'Naive RAG: Direct Generation', node: 'Naive: LLM', tool: 'LLM (no guardrail)', detail: 'Answered "12 days" from the 2024 policy. WRONG for 2026', latency: 55 },
          { title: 'Agentic RAG: Router + Metadata Filter', node: 'Router', tool: 'SemanticRouter', detail: 'Detected year=2026, route: HR_POLICY, filter applied', latency: 14 },
          { title: 'Agentic RAG: Hybrid Search + Reranker', node: 'Reranker', tool: 'BM25 + Dense + BGE-Reranker', detail: 'Top slice: HR-POLICY-2026-v3, section 4.2', latency: 61, chunks: { total: 12, keep: 2 } },
          { title: 'Agentic RAG: Groundedness Guardrail', node: 'Guardrail', tool: 'LlamaGuard + FactCheck', detail: 'Claim "15 days" verified against source', latency: 26 }
        ],
        output: `### [EVAL // NAIVE RAG vs AGENTIC RAG]

**Question:** Chính sách nghỉ phép 2026 của HPT?

**[X] Naive RAG:** "12 ngày phép/năm."
   Stale source (2024 policy), no verification. Confident but wrong.

**[OK] Agentic RAG:** "15 ngày phép/năm, cộng 1 ngày cho mỗi 5 năm thâm niên."
   Source: HR-POLICY-2026-v3, section 4.2. Groundedness verified.

**Why it wins:** metadata routing + reranking + a guardrail that checks every claim before answering.`
      },
      'refuse': {
        mode: 'rag',
        query: 'Giá Bitcoin hôm nay là bao nhiêu?',
        receipt: { arch: 'Out-of-scope query blocked by Grounding Guardrail', burn: '-90 TOKENS', p99: '< 120ms / P99: 110ms', env: 'Router + Guardrail // no LLM generation performed' },
        steps: [
          { title: 'Intent Classification & Routing', node: 'Router', tool: 'SemanticRouter', detail: 'Route: UNKNOWN (best match confidence 0.31 < 0.60)', latency: 11 },
          { title: 'Knowledge Base Retrieval', node: 'Retrieval', tool: 'Qdrant hybrid search', detail: 'Top cosine 0.38 < 0.75. No grounding document found', latency: 41, chunks: { total: 12, keep: 0 } },
          { title: 'Grounding Guardrail: BLOCK', node: 'Guardrail', tool: 'LlamaGuard + FactCheck', detail: 'Refusing to generate: an ungrounded answer would be a hallucination', latency: 19 }
        ],
        output: `### [GUARDRAIL // TRANSPARENT REFUSAL]

I could not find a grounded source for this question, so I will not guess.

That is the point of grounded design: **no evidence, no answer.**

Pick another trace above to see a grounded answer.`
      },
      'custom-prompt': {
        mode: 'rag',
        query: 'Hệ thống AI Agent này có thể giải quyết bài toán gì cho doanh nghiệp?',
        steps: [
          { title: 'Intent Classification & Routing', node: 'Router', tool: 'SemanticRouter', detail: 'Route: ENTERPRISE_SOLUTION_INQUIRY', latency: 14 },
          { title: 'Knowledge Base Semantic Retrieval', node: 'Retrieval', tool: 'Milvus / ChromaDB', detail: 'Trích xuất hồ sơ giải pháp production của Võ Phú Thịnh', latency: 48 },
          { title: 'Context Grounding Verification', node: 'Grounding', tool: 'ZeroHallucination Engine', detail: 'Kiểm chứng dựa trên 3 dự án production thực tế', latency: 22 },
          { title: 'Streaming Architectural Synthesis', node: 'Synthesis', tool: 'Enterprise Agent', detail: 'Tạo kế hoạch triển khai giải pháp tối ưu cho doanh nghiệp', latency: 60 }
        ],
        output: `### [TỔNG KẾT NĂNG LỰC TRIỂN KHAI CHO DOANH NGHIỆP]

Tôi chuyên thiết kế và đưa vào vận hành thực tế các hệ thống AI cấp doanh nghiệp:

1. **Enterprise Agentic RAG**:
   - Tra cứu và tổng hợp thông tin từ hàng triệu văn bản PDF, hợp đồng, chính sách với độ chính xác cao và dẫn nguồn trực tiếp.
2. **Autonomous Multi-Agent Systems & MCP**:
   - Tự động hóa quy trình nghiệp vụ phức tạp thông qua các công cụ MCP chuẩn hóa (kết nối CRM, SQL DB, ERP, API bên thứ ba).
3. **Mô hình triển khai an toàn & bảo mật**:
   - Hỗ trợ On-Premises (vLLM, Ollama, DeepSeek/Llama) hoặc Private Cloud, bảo vệ 100% dữ liệu mật doanh nghiệp.`
      }
    };

    this.initExtras();
    this.init();
  }

  // Flow strip, chunk filter and Skip button are built here so the HTML stays small.
  initExtras() {
    const panel = this.pipelineStepsContainer?.parentElement;
    if (panel) {
      this.flowEl = document.createElement('div');
      this.flowEl.className = 'sim-flow';
      this.flowEl.setAttribute('aria-hidden', 'true');
      this.chunksEl = document.createElement('div');
      this.chunksEl.className = 'sim-chunks';
      this.chunksEl.hidden = true;
      panel.insertBefore(this.flowEl, this.pipelineStepsContainer);
      panel.insertBefore(this.chunksEl, this.pipelineStepsContainer);
    }
    if (this.runBtn?.parentElement) {
      this.skipBtn = document.createElement('button');
      this.skipBtn.type = 'button';
      this.skipBtn.className = 'btn-skip-pipeline';
      this.skipBtn.hidden = true;
      this.skipBtn.innerHTML = '<i class="fa-solid fa-forward"></i> <span>Skip</span>';
      this.skipBtn.addEventListener('click', () => { this.skip = true; });
      this.runBtn.after(this.skipBtn);
    }
  }

  renderFlow(data, doneCount = -1) {
    if (!this.flowEl) return;
    const nodes = ['Query', ...data.steps.map((st) => st.node || st.tool), 'Answer'];
    this.flowEl.innerHTML = nodes
      .map((n, i) => `${i ? '<span class="flow-link"></span>' : ''}<span class="flow-node" data-i="${i}">${escapeHtml(n)}</span>`)
      .join('');
    for (let i = 0; i <= doneCount; i++) this.markFlow(i, 'done');
  }

  // idx 0 = Query, 1..n = steps, n+1 = Answer
  markFlow(idx, state) {
    const node = this.flowEl?.querySelector(`.flow-node[data-i="${idx}"]`);
    if (!node) return;
    node.classList.remove('active', 'done');
    node.classList.add(state);
    if (state === 'active' && node.previousElementSibling) node.previousElementSibling.classList.add('flow');
    if (state === 'done' && node.previousElementSibling) node.previousElementSibling.classList.remove('flow');
  }

  renderChunks(total, keep) {
    if (!this.chunksEl) return;
    this.chunksEl.hidden = false;
    this.chunksEl.innerHTML =
      `<span class="chunks-label">Context chunks</span>` +
      Array.from({ length: total }, (_, i) => `<span class="chunk-chip ${i < keep ? 'keep' : 'drop'}" style="--d:${i * 40}ms">#${i + 1}</span>`).join('') +
      `<span class="chunks-note">${total} → ${keep} kept</span>`;
  }

  init() {
    this.bindEvents();
    // Pre-populate with default preset
    this.selectPreset('rag-policy');
  }

  bindEvents() {
    if (this.runBtn) {
      this.runBtn.addEventListener('click', () => this.runSimulation());
    }

    if (this.queryInput) {
      this.queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !this.isExecuting) {
          this.runSimulation();
        }
      });
    }

    this.presetChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const presetKey = chip.dataset.preset;
        if (presetKey && !this.isExecuting) {
          this.selectPreset(presetKey);
        }
      });
    });
  }

  selectPreset(presetKey) {
    const data = this.presets[presetKey];
    if (!data) return;

    this.presetChips.forEach((c) => c.classList.remove('active'));
    const targetChip = document.querySelector(`.sim-preset-chip[data-preset="${presetKey}"]`);
    if (targetChip) targetChip.classList.add('active');

    if (this.queryInput) {
      this.queryInput.value = data.query;
    }
    this.currentPresetKey = presetKey;
    this.updateReceipt(presetKey, false);
    this.renderFlow(data);
    if (this.chunksEl) this.chunksEl.hidden = true;
  }

  async runSimulation() {
    if (this.isExecuting) return;
    this.isExecuting = true;
    this.skip = false;

    const presetData = this.presets[this.currentPresetKey] || this.presets['custom-prompt'];

    this.runBtn.disabled = true;
    this.runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Processing Pipeline...</span>';
    if (this.skipBtn) this.skipBtn.hidden = false;
    if (this.terminalOutput) this.terminalOutput.textContent = '';
    if (this.pipelineStepsContainer) this.pipelineStepsContainer.innerHTML = '';
    if (this.chunksEl) this.chunksEl.hidden = true;
    this.renderFlow(presetData);
    this.markFlow(0, 'done');

    if (this.statLatency) this.statLatency.textContent = '0ms';
    if (this.statTtft) this.statTtft.textContent = '...';
    if (this.statTokens) this.statTokens.textContent = '0 t/s';
    if (this.statHallucination) this.statHallucination.textContent = '0.0%';

    let totalLatency = 0;

    presetData.steps.forEach((step, index) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'sim-step-item pending';
      stepEl.id = `sim-step-${index}`;
      stepEl.innerHTML = `
        <div class="step-indicator">
          <span class="step-num">${index + 1}</span>
          <span class="step-spinner"></span>
        </div>
        <div class="step-body">
          <div class="step-header">
            <span class="step-title">${step.title}</span>
            <span class="step-tool">${step.tool}</span>
          </div>
          <div class="step-detail">${step.detail}</div>
        </div>
        <div class="step-meta">
          <span class="step-time">--</span>
        </div>
      `;
      this.pipelineStepsContainer.appendChild(stepEl);
    });

    for (let i = 0; i < presetData.steps.length; i++) {
      const step = presetData.steps[i];
      const stepEl = document.getElementById(`sim-step-${i}`);
      if (stepEl) {
        stepEl.classList.remove('pending');
        stepEl.classList.add('running');
      }
      this.markFlow(i + 1, 'active');

      await this.sleep(step.latency * 5);
      totalLatency += step.latency;

      if (stepEl) {
        stepEl.classList.remove('running');
        stepEl.classList.add('completed');
        const timeEl = stepEl.querySelector('.step-time');
        if (timeEl) timeEl.textContent = `${step.latency}ms`;
      }
      this.markFlow(i + 1, 'done');
      if (step.chunks) this.renderChunks(step.chunks.total, step.chunks.keep);

      if (this.statLatency) {
        this.statLatency.textContent = `${totalLatency}ms`;
      }
    }
    this.markFlow(presetData.steps.length + 1, 'done');

    // Step complete: Stream Token Output
    const ttft = Math.round(totalLatency * 0.45);
    if (this.statTtft) this.statTtft.textContent = `${ttft}ms`;
    if (this.statTokens) this.statTokens.textContent = '94 t/s';
    if (this.statHallucination) this.statHallucination.textContent = '0.00%';

    // Update the thermal print receipt with executed metrics
    this.updateReceipt(this.currentPresetKey, true, totalLatency);

    await this.streamText(presetData.output);

    this.runBtn.disabled = false;
    this.runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span>Replay Trace</span>';
    if (this.skipBtn) this.skipBtn.hidden = true;
    this.isExecuting = false;
  }

  updateReceipt(presetKey, isExecuted = false, actualLatency = 0) {
    if (!this.receiptEl) return;

    // Trigger thermal print feed animation
    this.receiptEl.classList.remove('printing');
    void this.receiptEl.offsetWidth; // Trigger reflow
    this.receiptEl.classList.add('printing');

    const traceNum = Math.floor(1000 + Math.random() * 9000);
    if (this.receiptTraceId) {
      this.receiptTraceId.textContent = `TRACE #HPT-RAG-2026-${traceNum}`;
    }

    const r = this.presets[presetKey]?.receipt;
    if (r) {
      if (this.receiptArchVal) this.receiptArchVal.textContent = r.arch;
      if (this.receiptTokenBurn) this.receiptTokenBurn.textContent = r.burn;
      if (this.receiptLatencyVal) this.receiptLatencyVal.textContent = isExecuted && actualLatency ? `${actualLatency}ms (${r.p99.split('/ ')[1] || r.p99} / SIMULATED)` : r.p99;
      if (this.receiptEnvVal) this.receiptEnvVal.textContent = r.env;
    } else if (presetKey === 'mcp-agent') {
      if (this.receiptArchVal) {
        this.receiptArchVal.textContent = 'Multi-Agent ReAct + MCP Tool Calling (Timescale & Python Sandbox)';
      }
      if (this.receiptTokenBurn) {
        this.receiptTokenBurn.textContent = '-620 TOKENS';
      }
      if (this.receiptLatencyVal) {
        this.receiptLatencyVal.textContent = isExecuted && actualLatency
          ? `${actualLatency}ms (P99: 140ms / SIMULATED)`
          : '< 180ms / P99: 140ms';
      }
      if (this.receiptEnvVal) {
        this.receiptEnvVal.textContent = 'Isolated MCP Docker Sandbox // TimescaleDB Telemetry';
      }
    } else if (presetKey === 'custom-prompt') {
      if (this.receiptArchVal) {
        this.receiptArchVal.textContent = 'Enterprise Knowledge Retrieval & Solution Synthesis';
      }
      if (this.receiptTokenBurn) {
        this.receiptTokenBurn.textContent = '-350 TOKENS';
      }
      if (this.receiptLatencyVal) {
        this.receiptLatencyVal.textContent = isExecuted && actualLatency
          ? `${actualLatency}ms (P99: 160ms / SIMULATED)`
          : '< 200ms / P99: 160ms';
      }
      if (this.receiptEnvVal) {
        this.receiptEnvVal.textContent = 'Milvus / ChromaDB + vLLM Grounded Synthesis';
      }
    } else {
      // 'rag-policy'
      if (this.receiptArchVal) {
        this.receiptArchVal.textContent = 'Agentic RAG + HyDE + BGE Reranker-Large';
      }
      if (this.receiptTokenBurn) {
        this.receiptTokenBurn.textContent = '-480 TOKENS';
      }
      if (this.receiptLatencyVal) {
        this.receiptLatencyVal.textContent = isExecuted && actualLatency
          ? `${actualLatency}ms (P99: < 260ms / SIMULATED)`
          : '< 260ms (simulated)';
      }
      if (this.receiptEnvVal) {
        this.receiptEnvVal.textContent = 'Enterprise Sandbox // Qdrant + Azure OpenAI';
      }
    }

    if (this.receiptHallucinationVal) {
      this.receiptHallucinationVal.textContent = presetKey === 'refuse' ? 'BLOCKED (NO GROUNDING FOUND)' : 'ANSWER GROUNDED IN SOURCES';
    }
  }

  // Minimal markdown: escape first, then bold/italic/headings. Safe for innerHTML.
  renderMd(text) {
    return escapeHtml(text)
      .replace(/^### (.*)\n?/gm, '<span class="md-h">$1</span>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\*\((.*)\)\*$/gm, '<em class="md-src">($1)</em>');
  }

  async streamText(fullText) {
    if (!this.terminalOutput) return;
    const cursor = '<span class="sim-cursor"></span>';
    let i = 0;
    while (i < fullText.length && !this.skip) {
      i = Math.min(fullText.length, i + 3);
      this.terminalOutput.innerHTML = this.renderMd(fullText.slice(0, i)) + cursor;
      if (this.statTokens) this.statTokens.textContent = `${Math.round(i / 4)} tok`;
      await this.sleep(12);
    }
    this.terminalOutput.innerHTML = this.renderMd(fullText);
    if (this.statTokens) this.statTokens.textContent = '94 t/s';
  }

  sleep(ms) {
    return this.skip ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function initAISimulator() {
  return new AISimulatorController();
}
