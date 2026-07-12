// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";

// Set up the DOM before importing: ProjectsController and the modals
// singleton it depends on are both constructed at import time (mirrors the
// real app), so the containers must exist first.
document.body.innerHTML = `
  <section id="project">
    <div class="row">
      <button class="filter-btn active" data-filter="all">All</button>
    </div>
    <div id="projectsGrid"></div>
  </section>

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
      <div id="projectModalContent"></div>
    </div>
  </div>
`;

const { ProjectsController } = await import("../js/modules/projects.js");
new ProjectsController();

const modal = document.getElementById("projectModal");
const card = document.querySelector(".project-card");

function pressKey(el, key) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
  return event;
}

describe("ProjectsController keyboard accessibility", () => {
  beforeEach(() => {
    modal.classList.remove("open");
    modal.style.display = "none";
    document.body.focus();
  });

  it("renders project cards as focusable, labeled buttons (WCAG 2.1.1)", () => {
    expect(card.getAttribute("tabindex")).toBe("0");
    expect(card.getAttribute("role")).toBe("button");
    expect(card.getAttribute("aria-label")).toMatch(/^View case study: /);
  });

  it("opens the project modal when Enter is pressed on a focused card", () => {
    card.focus();
    pressKey(card, "Enter");

    expect(modal.classList.contains("open")).toBe(true);
    expect(document.getElementById("projectModalTitle").textContent).not.toBe(
      "",
    );
  });

  it("opens the project modal when Space is pressed and prevents page scroll", () => {
    card.focus();
    const event = pressKey(card, " ");

    expect(event.defaultPrevented).toBe(true);
    expect(modal.classList.contains("open")).toBe(true);
  });

  it("does not open the project modal when Enter is pressed on a link inside the card", () => {
    const githubLink = document.querySelector(".btn-github-card");
    expect(githubLink).not.toBeNull();
    githubLink.focus();

    pressKey(githubLink, "Enter");

    expect(modal.classList.contains("open")).toBe(false);
  });

  it("restores focus to the project card after the modal is closed via Escape", () => {
    card.focus();
    pressKey(card, "Enter");

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );

    expect(modal.classList.contains("open")).toBe(false);
    expect(document.activeElement).toBe(card);
  });
});
