import { Utils } from "../utils.js";
import { projectsData, projectConfig } from "../projects-data.js";
import { openModal } from "./modals.js";

/**
 * Projects Module
 * Handles project rendering, filtering, and modal display
 */

export class ProjectsController {
  constructor() {
    this.projects = projectsData || [];
    this.config = projectConfig || {
      MAX_TECH_CHIPS_DISPLAY: 4,
      MAX_IMPACT_CHIPS_DISPLAY: 3,
    };
    this.projectsGrid = document.getElementById("projectsGrid");
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectModal = document.getElementById("projectModal");
    this.projectModalTitle = document.getElementById("projectModalTitle");
    this.projectModalContent = document.getElementById("projectModalContent");

    this.init();
  }

  init() {
    if (this.projects.length === 0) {
      const logger = this.getLogger();
      logger.error(
        "Projects data not loaded! Make sure projects-data.js is included before this module",
      );
    }

    this.renderProjects();
    this.setupFilterButtons();
    this.setupProjectClickHandlers();
  }

  getLogger() {
    return Utils.getLogger();
  }

  escapeHtml(text) {
    return Utils.escapeHtml(text);
  }

  renderProjects() {
    if (!this.projectsGrid) {
      const projectSection = document.getElementById("project");
      if (projectSection) {
        const errorMsg = document.createElement("div");
        errorMsg.style.cssText =
          "color: var(--text-black-900); text-align: center; padding: 40px 20px; background: var(--bg-black-100); border-radius: 12px; margin: 20px;";
        errorMsg.innerHTML = `
          <h3 style="margin-bottom: 10px">⚠️ Unable to load projects</h3>
          <p style="color: var(--text-black-700)">Please refresh the page or try again later.</p>
        `;
        projectSection.appendChild(errorMsg);
      }
      return;
    }

    this.projectsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid var(--bg-black-50); border-top-color: var(--skin-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="color: var(--text-black-700); margin-top: 20px; font-size: 16px;">Loading projects...</p>
      </div>
    `;

    setTimeout(() => {
      this.projectsGrid.style.display = "";
      this.projectsGrid.innerHTML = this.projects
        .map((project) => this.renderProjectCard(project))
        .join("");
      this.attachProjectImageErrorHandlers();
    }, 100);
  }

  attachProjectImageErrorHandlers() {
    if (!this.projectsGrid) return;
    const images = this.projectsGrid.querySelectorAll(".project-cover img");
    images.forEach((img) => {
      img.addEventListener("error", function () {
        this.style.opacity = "0.3";
        const cover = this.closest(".project-cover");
        if (cover) {
          cover.classList.add("img-error");
        }
      });
    });
  }

  renderProjectCard(project) {
    const imagePath =
      project.image || `./assets/images/portfolio/portfolio-${project.id}.jpg`;

    const techChips = (project.stack || [])
      .slice(0, this.config.MAX_TECH_CHIPS_DISPLAY)
      .map((tech) => `<span class="tech-chip">${this.escapeHtml(tech)}</span>`)
      .join("");

    const impactChips = (project.impact || [])
      .slice(0, this.config.MAX_IMPACT_CHIPS_DISPLAY)
      .map(
        (imp) =>
          `<span class="impact-chip"><span class="impact-label">${this.escapeHtml(imp.label)}</span> <span class="impact-value">${this.escapeHtml(imp.value)}</span></span>`,
      )
      .join("");

    const hasGithub = project.github && project.github !== "#";
    const githubHref = hasGithub ? this.escapeHtml(project.github) : "#";
    const githubTarget = hasGithub
      ? 'target="_blank" rel="noopener noreferrer"'
      : "";
    const githubButton = hasGithub
      ? `<a href="${githubHref}" ${githubTarget} title="📂 View source code on GitHub" class="btn-card btn-github-card" aria-label="View on GitHub"><i class="fab fa-github"></i> <span>GitHub</span></a>`
      : "";

    const hasLink = project.link && project.link !== "#";
    const projectHref = hasLink ? this.escapeHtml(project.link) : "#";
    const projectTarget = hasLink
      ? 'target="_blank" rel="noopener noreferrer"'
      : "";
    const projectButton = hasLink
      ? `<a href="${projectHref}" ${projectTarget} title="🚀 View live demo" class="btn-card btn-demo-card" aria-label="View live demo"><i class="fas fa-external-link-alt"></i> <span>Live Demo</span></a>`
      : "";

    const internalLabel =
      !hasGithub && !hasLink
        ? `<span class="btn-card btn-internal-card" title="Internal company project"><i class="fas fa-lock"></i> <span>Internal Project</span></span>`
        : "";

    return `
      <div class="project-item" data-category="${project.category}" data-project-id="${project.id}">
        <div class="project-card">
          <div class="project-cover">
            <img src="${imagePath}" alt="${this.escapeHtml(project.title)}" loading="lazy" decoding="async" />
          </div>
          <div class="project-content">
            <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
            <p class="project-summary">${this.escapeHtml(project.summary)}</p>
            ${impactChips ? `<div class="project-impact-chips">${impactChips}</div>` : ""}
            <div class="project-tech-chips">
              ${techChips}
            </div>
            <div class="project-actions">
              ${githubButton}
              ${projectButton}
              ${internalLabel}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupFilterButtons() {
    if (this.filterButtons.length > 0) {
      const hasActive = Array.from(this.filterButtons).some((btn) =>
        btn.classList.contains("active"),
      );
      if (!hasActive && this.filterButtons[0]) {
        this.filterButtons[0].classList.add("active");
      }
    }

    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.filterButtons.forEach((btn) => {
          if (btn) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
          }
        });

        if (button) {
          button.classList.add("active");
          button.setAttribute("aria-pressed", "true");
        }

        const filterValue = button.getAttribute("data-filter");
        if (!filterValue || !this.projectsGrid) return;

        const projectItems =
          this.projectsGrid.querySelectorAll(".project-item");
        projectItems.forEach((item) => {
          if (!item) return;
          if (
            filterValue === "all" ||
            item.getAttribute("data-category") === filterValue
          ) {
            item.classList.remove("is-hidden");
          } else {
            item.classList.add("is-hidden");
          }
        });
      });
    });
  }

  setupProjectClickHandlers() {
    if (!this.projectsGrid) return;

    this.projectsGrid.addEventListener("click", (e) => {
      const clickedButton = e.target.closest(
        ".btn-github-card, .btn-demo-card, .btn-card, .project-actions a",
      );
      if (clickedButton) {
        e.stopPropagation();
        if (
          clickedButton.classList.contains("is-disabled") ||
          clickedButton.classList.contains("disabled") ||
          clickedButton.getAttribute("href") === "#"
        ) {
          e.preventDefault();
        }
        return;
      }

      const projectCard = e.target.closest(".project-card");
      if (projectCard) {
        const projectItem = projectCard.closest(".project-item");
        if (projectItem) {
          const projectIdAttr = projectItem.getAttribute("data-project-id");
          if (projectIdAttr) {
            const projectId = parseInt(projectIdAttr, 10);
            if (!isNaN(projectId)) {
              this.openProjectModal(projectId);
            }
          }
        }
      }
    });
  }

  openProjectModal(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    const logger = this.getLogger();

    if (!project) {
      logger.warn(`Project with ID ${projectId} not found`);
      return;
    }
    if (!this.projectModal) {
      logger.warn("projectModal element not found");
      return;
    }

    if (this.projectModalTitle) {
      this.projectModalTitle.textContent = project.title;
    }

    if (this.projectModalContent) {
      const imagePath =
        project.image ||
        `./assets/images/portfolio/portfolio-${project.id}.jpg`;

      const techStackTags = project.stack
        .map(
          (tech) => `<span class="stack-tag">${this.escapeHtml(tech)}</span>`,
        )
        .join("");

      const impactCards = project.impact
        .map(
          (imp) =>
            `<div class="modal-impact-card">
              <span class="modal-impact-card-label">${this.escapeHtml(imp.label)}</span>
              <span class="modal-impact-card-value">${this.escapeHtml(imp.value)}</span>
            </div>`,
        )
        .join("");

      const hasGithub = project.github && project.github !== "#";
      const hasLink = project.link && project.link !== "#";

      let linksHtml = "";
      if (hasGithub || hasLink) {
        linksHtml = `<div class="modal-links">`;
        if (hasGithub) {
          linksHtml += `<a href="${this.escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer" class="modal-link-btn modal-link-github"><i class="fab fa-github"></i> View on GitHub</a>`;
        }
        if (hasLink) {
          linksHtml += `<a href="${this.escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" class="modal-link-btn modal-link-demo"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
        }
        linksHtml += `</div>`;
      }

      this.projectModalContent.innerHTML = `
        <div class="modal-hero">
          <img src="${imagePath}" alt="${this.escapeHtml(project.title)}" loading="lazy" />
        </div>

        <div class="modal-body">
          <div class="modal-section modal-section-problem">
            <div class="modal-section-icon"><i class="fa fa-exclamation-circle"></i></div>
            <div class="modal-section-content">
              <h3>Problem</h3>
              <p>${this.escapeHtml(project.problem)}</p>
            </div>
          </div>

          <div class="modal-section modal-section-solution">
            <div class="modal-section-icon"><i class="fa fa-lightbulb"></i></div>
            <div class="modal-section-content">
              <h3>Solution</h3>
              <p>${this.escapeHtml(project.solution)}</p>
            </div>
          </div>

          <div class="modal-section modal-section-tech">
            <div class="modal-section-icon"><i class="fa fa-code"></i></div>
            <div class="modal-section-content">
              <h3>Tech Stack</h3>
              <div class="stack-tags">${techStackTags}</div>
            </div>
          </div>

          <div class="modal-section modal-section-results">
            <div class="modal-section-icon"><i class="fa fa-chart-line"></i></div>
            <div class="modal-section-content">
              <h3>Key Metrics</h3>
              <div class="modal-impact-grid">${impactCards}</div>
            </div>
          </div>

          <div class="modal-section modal-section-outcome">
            <div class="modal-section-icon"><i class="fa fa-trophy"></i></div>
            <div class="modal-section-content">
              <h3>Outcome</h3>
              <p>${this.escapeHtml(project.results)}</p>
            </div>
          </div>

          ${linksHtml}
        </div>
      `;
    }

    if (typeof openModal === "function") {
      openModal(this.projectModal);
    } else {
      this.projectModal.style.display = "flex";
      this.projectModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
}
