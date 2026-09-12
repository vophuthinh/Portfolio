/**
 * Interactive AI Agent & RAG Pipeline Simulator
 * An interactive "Show, Don't Tell" playground showcasing production Agentic RAG,
 * Model Context Protocol (MCP) tool routing, and Zero-Hallucination Guardrails.
 */

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

    this.isExecuting = false;
    this.activeMode = 'rag'; // 'rag' | 'mcp'

    this.presets = {
      'rag-policy': {
        mode: 'rag',
        query: 'Tìm kiếm chính sách bảo mật dữ liệu & quy định LLM nội bộ HPT 2026',
        steps: [
          { title: 'Intent Classification & Routing', tool: 'SemanticRouter', detail: 'Route: INTERNAL_SEC_POLICY (confidence: 0.994)', latency: 12 },
          { title: 'HyDE Query Expansion', tool: 'EmbeddingEngine', detail: 'Generated 1536-dim hypothetical dense embedding vector', latency: 42 },
          { title: 'Hybrid Dense + BM25 Vector Search', tool: 'ChromaDB / Qdrant', detail: 'Scanned 42,000 document chunks. Top cosine: 0.892', latency: 68 },
          { title: 'Cross-Encoder Reranker', tool: 'BGE-Reranker-Large', detail: 'Filtered 12 candidate chunks down to top 3 context slices', latency: 34 },
          { title: 'Self-Reflection & Hallucination Guardrail', tool: 'LlamaGuard + FactCheck', detail: 'Groundedness verified: 100% (0 ungrounded claims)', latency: 28 },
          { title: 'Streaming Response Synthesis', tool: 'vLLM / Enterprise LLM', detail: 'Deterministic context injected with inline source citations', latency: 75 }
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
          { title: 'Planner Agent Decomposition', tool: 'ReAct Supervisor', detail: 'Phân tích nhiệm vụ thành 3 sub-tasks tuần tự', latency: 18 },
          { title: 'MCP Tool Call 1: Database Query', tool: 'mcp://timescale-db/query_metrics', detail: 'Lấy 85,000 bản ghi telemetry truy vấn Q2-2026', latency: 55 },
          { title: 'MCP Tool Call 2: Code Sandbox', tool: 'mcp://python-sandbox/calc_percentiles', detail: 'Tính toán P50=42ms, P95=85ms, P99=140ms; lỗi 0.01%', latency: 62 },
          { title: 'Safety & Permission Validation', tool: 'MCP Security Gate', detail: 'Sandbox cô lập: Read-only access, CPU quota: 25%', latency: 15 },
          { title: 'Final Agent Synthesis', tool: 'Autonomous Synthesizer', detail: 'Tổng hợp báo cáo định dạng Markdown & đề xuất tối ưu hóa', latency: 45 }
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
      'custom-prompt': {
        mode: 'rag',
        query: 'Hệ thống AI Agent này có thể giải quyết bài toán gì cho doanh nghiệp?',
        steps: [
          { title: 'Intent Classification & Routing', tool: 'SemanticRouter', detail: 'Route: ENTERPRISE_SOLUTION_INQUIRY', latency: 14 },
          { title: 'Knowledge Base Semantic Retrieval', tool: 'Milvus / ChromaDB', detail: 'Trích xuất hồ sơ giải pháp production của Võ Phú Thịnh', latency: 48 },
          { title: 'Context Grounding Verification', tool: 'ZeroHallucination Engine', detail: 'Kiểm chứng dựa trên 3 dự án production thực tế', latency: 22 },
          { title: 'Streaming Architectural Synthesis', tool: 'Enterprise Agent', detail: 'Tạo kế hoạch triển khai giải pháp tối ưu cho doanh nghiệp', latency: 60 }
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

    this.init();
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
  }

  async runSimulation() {
    if (this.isExecuting) return;
    this.isExecuting = true;

    const query = this.queryInput ? this.queryInput.value.trim() : '';
    let presetData = this.presets[this.currentPresetKey] || this.presets['custom-prompt'];

    // If query was modified by user
    if (query !== presetData.query) {
      presetData = {
        ...presetData,
        query,
      };
    }

    // Update UI state
    this.runBtn.disabled = true;
    this.runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Processing Pipeline...</span>';
    if (this.terminalOutput) this.terminalOutput.textContent = '';
    if (this.pipelineStepsContainer) this.pipelineStepsContainer.innerHTML = '';

    // Reset stats display
    if (this.statLatency) this.statLatency.textContent = '0ms';
    if (this.statTtft) this.statTtft.textContent = '...';
    if (this.statTokens) this.statTokens.textContent = '0 t/s';
    if (this.statHallucination) this.statHallucination.textContent = '0.0%';

    let totalLatency = 0;

    // Render step skeletons
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

    // Execute steps sequentially with realistic micro-delays
    for (let i = 0; i < presetData.steps.length; i++) {
      const step = presetData.steps[i];
      const stepEl = document.getElementById(`sim-step-${i}`);
      if (stepEl) {
        stepEl.classList.remove('pending');
        stepEl.classList.add('running');
      }

      await this.sleep(step.latency * 5); // smooth visual delay
      totalLatency += step.latency;

      if (stepEl) {
        stepEl.classList.remove('running');
        stepEl.classList.add('completed');
        const timeEl = stepEl.querySelector('.step-time');
        if (timeEl) timeEl.textContent = `${step.latency}ms`;
      }

      if (this.statLatency) {
        this.statLatency.textContent = `${totalLatency}ms`;
      }
    }

    // Step complete: Stream Token Output
    const ttft = Math.round(totalLatency * 0.45);
    if (this.statTtft) this.statTtft.textContent = `${ttft}ms`;
    if (this.statTokens) this.statTokens.textContent = '94 t/s';
    if (this.statHallucination) this.statHallucination.textContent = '0.00%';

    await this.streamText(presetData.output);

    this.runBtn.disabled = false;
    this.runBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Execute Pipeline</span>';
    this.isExecuting = false;
  }

  async streamText(fullText) {
    if (!this.terminalOutput) return;
    this.terminalOutput.textContent = '';

    const chars = fullText.split('');
    let current = '';

    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      this.terminalOutput.textContent = current;
      // Faster streaming for large paragraphs
      if (i % 3 === 0) {
        await this.sleep(12);
      }
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function initAISimulator() {
  return new AISimulatorController();
}
