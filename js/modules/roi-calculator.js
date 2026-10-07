/**
 * Enterprise LLM Inference Cost & ROI Calculator
 * Quantitative interactive tool demonstrating cost optimization via:
 * 1. Semantic Caching (Qdrant)
 * 2. Context Window Pruning (BGE-Reranker)
 * 3. Hybrid Routing & Self-Hosted vLLM Infrastructure
 */

export class ROICalculatorController {
  constructor() {
    this.container = document.getElementById("ai-roi-calculator");
    if (!this.container) return;

    // Inputs & Sliders
    this.querySlider = document.getElementById("roi-query-slider");
    this.queryDisplay = document.getElementById("roi-query-display");
    this.contextSlider = document.getElementById("roi-context-slider");
    this.contextDisplay = document.getElementById("roi-context-display");
    this.presetButtons = document.querySelectorAll(".roi-preset-btn");

    // Output metric elements
    this.costStandardEl = document.getElementById("roi-cost-standard");
    this.costOptimizedEl = document.getElementById("roi-cost-optimized");
    this.savingsMonthlyEl = document.getElementById("roi-savings-monthly");
    this.savingsAnnualEl = document.getElementById("roi-savings-annual");
    this.savingsPercentEl = document.getElementById("roi-savings-percent");

    // Comparison Visual Bars
    this.barStandard = document.getElementById("roi-bar-standard");
    this.barOptimized = document.getElementById("roi-bar-optimized");

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    if (this.querySlider) {
      this.querySlider.addEventListener("input", () => {
        this.updateQueryDisplay();
        this.calculate();
      });
    }

    if (this.contextSlider) {
      this.contextSlider.addEventListener("input", () => {
        this.updateContextDisplay();
        this.calculate();
      });
    }

    this.presetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.presetButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const queries = parseInt(btn.dataset.queries, 10);
        const context = parseInt(btn.dataset.context, 10);

        if (!isNaN(queries) && this.querySlider) {
          this.querySlider.value = queries;
          this.updateQueryDisplay();
        }

        if (!isNaN(context) && this.contextSlider) {
          this.contextSlider.value = context;
          this.updateContextDisplay();
        }

        this.calculate();
      });
    });
  }

  updateQueryDisplay() {
    if (!this.querySlider || !this.queryDisplay) return;
    const val = parseInt(this.querySlider.value, 10);
    this.queryDisplay.textContent = `${val.toLocaleString("en-US")} queries / day`;
  }

  updateContextDisplay() {
    if (!this.contextSlider || !this.contextDisplay) return;
    const val = parseInt(this.contextSlider.value, 10);
    this.contextDisplay.textContent = `${val.toLocaleString("en-US")} tokens / query`;
  }

  calculate() {
    const dailyQueries = this.querySlider ? parseInt(this.querySlider.value, 10) : 15000;
    const avgContext = this.contextSlider ? parseInt(this.contextSlider.value, 10) : 4000;
    const avgOutputTokens = 450;
    const daysPerMonth = 30;
    const monthlyQueries = dailyQueries * daysPerMonth;

    // 1. Unoptimized cloud frontier model baseline (update these rates when the reference model changes)
    // ($2.50 per 1M input tokens, $10.00 per 1M output tokens)
    const standardInputCost = (monthlyQueries * avgContext * 2.5) / 1000000;
    const standardOutputCost = (monthlyQueries * avgOutputTokens * 10.0) / 1000000;
    const standardTotalMonthly = Math.round(standardInputCost + standardOutputCost);

    // 2. Thinh's Optimized Architecture:
    // - Lever 1: 28% Semantic Cache Hit (0 token cost for cached queries)
    const effectiveQueries = monthlyQueries * 0.72;
    // - Lever 2: Context Pruning via Cross-Encoder Reranker (reduces context window by 55%)
    const prunedContext = avgContext * 0.45;
    // - Lever 3: Hybrid local vLLM / Quantized Model (70% local at $0.35/1M token equivalent compute, 30% frontier cloud)
    const optimizedInputTokens = effectiveQueries * prunedContext;
    const optimizedOutputTokens = effectiveQueries * avgOutputTokens;

    const cloudPortionInput = optimizedInputTokens * 0.3 * (2.5 / 1000000);
    const cloudPortionOutput = optimizedOutputTokens * 0.3 * (10.0 / 1000000);
    const localPortionInput = optimizedInputTokens * 0.7 * (0.35 / 1000000);
    const localPortionOutput = optimizedOutputTokens * 0.7 * (1.2 / 1000000);

    const optimizedTotalMonthly = Math.max(120, Math.round(cloudPortionInput + cloudPortionOutput + localPortionInput + localPortionOutput + 65)); // +65 for hosting overhead

    const monthlySavings = Math.max(0, standardTotalMonthly - optimizedTotalMonthly);
    const annualSavings = monthlySavings * 12;
    const percentSavings = standardTotalMonthly > 0 ? Math.round((monthlySavings / standardTotalMonthly) * 100) : 0;

    // Render formatted metrics
    this.renderOutputs({
      standardMonthly: standardTotalMonthly,
      optimizedMonthly: optimizedTotalMonthly,
      monthlySavings,
      annualSavings,
      percentSavings,
    });
  }

  renderOutputs({ standardMonthly, optimizedMonthly, monthlySavings, annualSavings, percentSavings }) {
    if (this.costStandardEl) {
      this.costStandardEl.textContent = `$${standardMonthly.toLocaleString("en-US")} / month`;
    }

    if (this.costOptimizedEl) {
      this.costOptimizedEl.textContent = `$${optimizedMonthly.toLocaleString("en-US")} / month`;
    }

    if (this.savingsMonthlyEl) {
      this.savingsMonthlyEl.textContent = `$${monthlySavings.toLocaleString("en-US")}`;
    }

    if (this.savingsAnnualEl) {
      this.savingsAnnualEl.textContent = `Saves $${annualSavings.toLocaleString("en-US")} / year`;
    }

    if (this.savingsPercentEl) {
      this.savingsPercentEl.textContent = `-${percentSavings}% CHI PHÍ`;
    }

    // Update Comparison Bar Widths
    if (this.barStandard) {
      this.barStandard.style.width = "100%";
    }

    if (this.barOptimized && standardMonthly > 0) {
      const optimizedWidthPercent = Math.max(12, Math.min(100, Math.round((optimizedMonthly / standardMonthly) * 100)));
      this.barOptimized.style.width = `${optimizedWidthPercent}%`;
    }
  }
}

export function initRoiCalculator() {
  return new ROICalculatorController();
}
