// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";

// Set up the DOM before importing the module: ModalsController is a
// singleton constructed at import time (mirrors how it's used in the real
// app), so the modal elements must exist first for it to find them.
document.body.innerHTML = `
  <div
    id="projectModal"
    class="modal"
    role="dialog"
    aria-labelledby="projectModalTitle"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-content">
      <button type="button" class="close" data-modal-close="projectModal" aria-label="Close modal">&times;</button>
      <h2 id="projectModalTitle"></h2>
      <div id="projectModalContent">
        <a href="#" class="modal-link">A link inside the modal</a>
      </div>
    </div>
  </div>
  <button id="trigger">Open project</button>
`;

const { modalsController } = await import("../js/modules/modals.js");

const modal = document.getElementById("projectModal");
const trigger = document.getElementById("trigger");
const closeBtn = modal.querySelector(".close");
const link = modal.querySelector(".modal-link");

describe("ModalsController focus management", () => {
  beforeEach(() => {
    modal.classList.remove("open");
    modal.style.display = "none";
    document.body.focus();
  });

  it("moves focus to the first focusable element inside the modal on open", () => {
    modalsController.openModal(modal, trigger);

    expect(document.activeElement).toBe(closeBtn);
  });

  it("restores focus to the trigger element on close", () => {
    modalsController.openModal(modal, trigger);
    modalsController.closeModal(modal);

    expect(document.activeElement).toBe(trigger);
  });

  it("defaults the trigger to document.activeElement when none is passed", () => {
    trigger.focus();
    modalsController.openModal(modal);
    modalsController.closeModal(modal);

    expect(document.activeElement).toBe(trigger);
  });

  it("does not reopen an already-open modal (no focus reset)", () => {
    modalsController.openModal(modal, trigger);
    link.focus();
    modalsController.openModal(modal, trigger);

    expect(document.activeElement).toBe(link);
  });

  it("Tab on the last focusable element wraps to the first (focus trap)", () => {
    modalsController.openModal(modal, trigger);
    link.focus();

    modal.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(document.activeElement).toBe(closeBtn);
  });

  it("Shift+Tab on the first focusable element wraps to the last (focus trap)", () => {
    modalsController.openModal(modal, trigger);
    closeBtn.focus();

    modal.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(document.activeElement).toBe(link);
  });

  it("Escape closes the topmost open modal and restores focus", () => {
    modalsController.openModal(modal, trigger);
    expect(modal.classList.contains("open")).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    expect(modal.classList.contains("open")).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("clicking the close button (data-modal-close) closes the modal", () => {
    modalsController.openModal(modal, trigger);

    closeBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(modal.classList.contains("open")).toBe(false);
  });
});
