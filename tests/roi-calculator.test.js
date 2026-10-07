// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";

describe("ROICalculatorController", () => {
  let ROICalculatorController;

  beforeEach(async () => {
    document.body.innerHTML = `
      <div id="ai-roi-calculator">
        <input type="range" id="roi-query-slider" min="1000" max="80000" step="1000" value="15000" />
        <span id="roi-query-display"></span>
        <input type="range" id="roi-context-slider" min="1000" max="16000" step="500" value="4000" />
        <span id="roi-context-display"></span>

        <button class="roi-preset-btn" data-queries="3000" data-context="3000"></button>
        <button class="roi-preset-btn active" data-queries="15000" data-context="4000"></button>
        <button class="roi-preset-btn" data-queries="50000" data-context="8000"></button>

        <span id="roi-cost-standard"></span>
        <span id="roi-cost-optimized"></span>
        <span id="roi-savings-monthly"></span>
        <span id="roi-savings-annual"></span>
        <span id="roi-savings-percent"></span>

        <div id="roi-bar-standard"></div>
        <div id="roi-bar-optimized"></div>
      </div>
    `;

    const mod = await import("../js/modules/roi-calculator.js");
    ROICalculatorController = mod.ROICalculatorController;
  });

  it("should initialize with default values and calculate savings correctly", () => {
    const calc = new ROICalculatorController();
    const savingsMonthly = document.getElementById("roi-savings-monthly").textContent;
    const savingsPercent = document.getElementById("roi-savings-percent").textContent;
    const costStandard = document.getElementById("roi-cost-standard").textContent;

    expect(savingsMonthly).not.toBe("");
    expect(savingsPercent).toContain("-");
    expect(savingsPercent).toContain("%");
    expect(costStandard).toContain("$");
  });

  it("should recalculate when slider values change", () => {
    const calc = new ROICalculatorController();
    const querySlider = document.getElementById("roi-query-slider");
    querySlider.value = "30000";
    querySlider.dispatchEvent(new Event("input"));

    expect(document.getElementById("roi-query-display").textContent).toBe("30,000 queries / day");
  });

  it("should apply preset button values when clicked", () => {
    const calc = new ROICalculatorController();
    const enterpriseBtn = document.querySelectorAll(".roi-preset-btn")[2]; // 50k queries
    enterpriseBtn.dispatchEvent(new Event("click"));

    expect(document.getElementById("roi-query-slider").value).toBe("50000");
    expect(document.getElementById("roi-context-slider").value).toBe("8000");
    expect(enterpriseBtn.classList.contains("active")).toBe(true);
  });
});
