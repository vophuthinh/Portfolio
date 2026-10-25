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

    this.leverInputs = this.container.querySelectorAll(".roi-lever-input");
    this.costPerKStandard = document.getElementById("roi-cpk-standard");
    this.costPerKOptimized = document.getElementById("roi-cpk-optimized");

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

    this.leverInputs.forEach((input) => input.addEventListener("change", () => this.calculate()));

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

  // Monthly cost for a lever set. All three on = the "this architecture" model.
  monthlyCost({ cache, prune, route }, monthlyQueries, avgContext) {
    const avgOutputTokens = 450;
    const queries = monthlyQueries * (cache ? 0.72 : 1); // 28% semantic cache hits cost 0 tokens
    const inputTokens = queries * avgContext * (prune ? 0.45 : 1); // reranker prunes 55% of context
    const outputTokens = queries * avgOutputTokens;
    const cloud = route ? 0.3 : 1; // 70% routed to local vLLM
    const local = 1 - cloud;
    // $/1M tokens: cloud frontier 2.50 in / 10.00 out, local 0.35 in / 1.20 out
    const total =
      (inputTokens * cloud * 2.5 + outputTokens * cloud * 10 + inputTokens * local * 0.35 + outputTokens * local * 1.2) / 1e6;
    return route ? Math.max(120, Math.round(total + 65)) : Math.round(total); // +65 hosting overhead
  }

  calculate() {
    const dailyQueries = this.querySlider ? parseInt(this.querySlider.value, 10) : 15000;
    const avgContext = this.contextSlider ? parseInt(this.contextSlider.value, 10) : 4000;
    const monthlyQueries = dailyQueries * 30;

    const on = { cache: true, prune: true, route: true };
    this.leverInputs.forEach((input) => { on[input.dataset.lever] = input.checked; });

    // Apply enabled levers in order; each step's cost shows its marginal saving.
    const applied = { cache: false, prune: false, route: false };
    const standardTotalMonthly = this.monthlyCost(applied, monthlyQueries, avgContext);
    const steps = {};
    let previous = standardTotalMonthly;
    for (const lever of ["cache", "prune", "route"]) {
      if (on[lever]) applied[lever] = true;
      const cost = this.monthlyCost(applied, monthlyQueries, avgContext);
      steps[lever] = { cost, saving: on[lever] ? previous - cost : 0 };
      previous = cost;
    }
    const optimizedTotalMonthly = previous;

    const monthlySavings = Math.max(0, standardTotalMonthly - optimizedTotalMonthly);
    const annualSavings = monthlySavings * 12;
    const percentSavings = standardTotalMonthly > 0 ? Math.round((monthlySavings / standardTotalMonthly) * 100) : 0;

    this.renderOutputs({
      standardMonthly: standardTotalMonthly,
      optimizedMonthly: optimizedTotalMonthly,
      monthlySavings,
      annualSavings,
      percentSavings,
    });
    this.renderLadder(steps, standardTotalMonthly, monthlyQueries);
  }

  renderLadder(steps, standardMonthly, monthlyQueries) {
    const money = (n) => `$${n.toLocaleString("en-US")}`;
    for (const [lever, { cost, saving }] of Object.entries(steps)) {
      const savingEl = this.container.querySelector(`[data-saving="${lever}"]`);
      if (savingEl) savingEl.textContent = saving > 0 ? `-${money(saving)}` : "off";
      const row = this.container.querySelector(`[data-step="${lever}"]`);
      if (row) row.classList.toggle("is-off", saving <= 0);
      const costEl = this.container.querySelector(`[data-cost="${lever}"]`);
      if (costEl) costEl.textContent = `${money(cost)} / month`;
      const bar = this.container.querySelector(`[data-bar="${lever}"]`);
      if (bar && standardMonthly > 0) bar.style.width = `${Math.max(4, Math.round((cost / standardMonthly) * 100))}%`;
    }
    const perK = (monthly) => `$${(monthly / (monthlyQueries / 1000)).toFixed(2)}`;
    if (this.costPerKStandard) this.costPerKStandard.textContent = perK(standardMonthly);
    if (this.costPerKOptimized) this.costPerKOptimized.textContent = perK(steps.route.cost);
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
      this.savingsPercentEl.textContent = `-${percentSavings}% COST`;
    }

    // Update Comparison Bar Widths
    if (this.barStandard) {
      this.barStandard.style.width = "100%";
    }

    if (this.barOptimized && standardMonthly > 0) {
      const optimizedWidthPercent = Math.max(4, Math.min(100, Math.round((optimizedMonthly / standardMonthly) * 100)));
      this.barOptimized.style.width = `${optimizedWidthPercent}%`;
    }
  }
}

export function initRoiCalculator() {
  return new ROICalculatorController();
}
