/**
 * Projects Module
 * Handles project rendering, filtering, and modal display
 */

export class ProjectsController {
  constructor() {
    this.projects = typeof projectsData !== 'undefined' ? projectsData : [];
    this.config = typeof projectConfig !== 'undefined' ? projectConfig : {
      MAX_TECH_CHIPS_DISPLAY: 4,
      MAX_IMPACT_CHIPS_DISPLAY: 3
    };
    this.projectsGrid = document.getElementById('projectsGrid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectModal = document.getElementById('projectModal');
    this.projectModalTitle = document.getElementById('projectModalTitle');
    this.projectModalContent = document.getElementById('projectModalContent');
    
    this.init();
  }
  
  init() {
    if (this.projects.length === 0) {
      const logger = this.getLogger();
      logger.error('Projects data not loaded! Make sure projects-data.js is included before this module');
    }
    
    this.renderProjects();
    this.setupFilterButtons();
    this.setupProjectClickHandlers();
  }
  
  getLogger() {
    return (typeof Utils !== 'undefined' && Utils.getLogger) 
      ? Utils.getLogger() 
      : { 
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console)
        };
  }
  
  escapeHtml(text) {
    return (typeof Utils !== 'undefined' && Utils.escapeHtml) 
      ? Utils.escapeHtml(text) 
      : (() => {
          const div = document.createElement('div');
          div.textContent = text;
          return div.innerHTML;
        })();
  }
  
  renderProjects() {
    if (!this.projectsGrid) {
      const projectSection = document.getElementById('project');
      if (projectSection) {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'color: var(--text-black-900); text-align: center; padding: 40px 20px; background: var(--bg-black-100); border-radius: 12px; margin: 20px;';
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
      this.projectsGrid.style.display = '';
      this.projectsGrid.innerHTML = this.projects.map(project => this.renderProjectCard(project)).join('');
      this.attachProjectImageErrorHandlers();
    }, 100);
  }

  attachProjectImageErrorHandlers() {
    if (!this.projectsGrid) return;
    const images = this.projectsGrid.querySelectorAll('.project-cover img');
    images.forEach((img) => {
      img.addEventListener('error', function () {
        this.style.opacity = '0.3';
        const cover = this.closest('.project-cover');
        if (cover) {
          cover.classList.add('img-error');
        }
      });
    });
  }
  
  renderProjectCard(project) {
    const imagePath = project.image || `./assets/images/portfolio/portfolio-${project.id}.jpg`;
    
    const techChips = (project.stack || []).slice(0, this.config.MAX_TECH_CHIPS_DISPLAY).map(tech =>
      `<span class="tech-chip">${this.escapeHtml(tech)}</span>`
    ).join('');
    
    const impactChips = (project.impact || []).slice(0, this.config.MAX_IMPACT_CHIPS_DISPLAY).map(imp =>
      `<span class="impact-chip"><span class="impact-label">${this.escapeHtml(imp.label)}</span> <span class="impact-value">${this.escapeHtml(imp.value)}</span></span>`
    ).join('');
    
    const githubHref = project.github !== '#' ? this.escapeHtml(project.github) : '#';
    const githubDisabled = project.github === '#' ? 'is-disabled' : '';
    const githubTarget = project.github !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
    const githubAriaDisabled = project.github === '#' ? 'aria-disabled="true"' : '';
    const githubTitle = project.github === '#' ? '🚧 Coming soon - Code will be available' : '📂 View source code on GitHub';
    const githubButton = `<a href="${githubHref}" ${githubTarget} ${githubAriaDisabled} title="${githubTitle}" class="btn-card btn-github-card ${githubDisabled}" aria-label="View on GitHub"><i class="fab fa-github"></i> <span>GitHub</span></a>`;
    
    const projectHref = project.link !== '#' ? this.escapeHtml(project.link) : '#';
    const projectDisabled = project.link === '#' ? 'is-disabled' : '';
    const projectTarget = project.link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
    const projectAriaDisabled = project.link === '#' ? 'aria-disabled="true"' : '';
    const projectTitle = project.link === '#' ? '🚧 Coming soon - Demo will be available' : '🚀 View live demo';
    const projectButton = `<a href="${projectHref}" ${projectTarget} ${projectAriaDisabled} title="${projectTitle}" class="btn-card btn-demo-card ${projectDisabled}" aria-label="View live demo"><i class="fas fa-external-link-alt"></i> <span>Live Demo</span></a>`;
    
    return `
      <div class="project-item" data-category="${project.category}" data-project-id="${project.id}">
        <div class="project-card">
          <div class="project-cover">
            <img src="${imagePath}" alt="${this.escapeHtml(project.title)}" loading="lazy" decoding="async" />
          </div>
          <div class="project-content">
            <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
            <p class="project-summary">${this.escapeHtml(project.summary)}</p>
            ${impactChips ? `<div class="project-impact-chips">${impactChips}</div>` : ''}
            <div class="project-tech-chips">
              ${techChips}
            </div>
            <div class="project-actions">
              ${githubButton}
              ${projectButton}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  setupFilterButtons() {
    if (this.filterButtons.length > 0) {
      const hasActive = Array.from(this.filterButtons).some(btn => btn.classList.contains('active'));
      if (!hasActive && this.filterButtons[0]) {
        this.filterButtons[0].classList.add('active');
      }
    }
    
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.filterButtons.forEach(btn => {
          if (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          }
        });
        
        if (button) {
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
        }
        
        const filterValue = button.getAttribute('data-filter');
        if (!filterValue || !this.projectsGrid) return;
        
        const projectItems = this.projectsGrid.querySelectorAll('.project-item');
        projectItems.forEach(item => {
          if (!item) return;
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }
  
  setupProjectClickHandlers() {
    if (!this.projectsGrid) return;
    
    this.projectsGrid.addEventListener('click', (e) => {
      const clickedButton = e.target.closest('.btn-github-card, .btn-demo-card, .btn-card, .project-actions a');
      if (clickedButton) {
        e.stopPropagation();
        if (clickedButton.classList.contains('is-disabled') || clickedButton.classList.contains('disabled') || clickedButton.getAttribute('href') === '#') {
          e.preventDefault();
        }
        return;
      }
      
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        const projectItem = projectCard.closest('.project-item');
        if (projectItem) {
          const projectIdAttr = projectItem.getAttribute('data-project-id');
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
    const project = this.projects.find(p => p.id === projectId);
    const logger = this.getLogger();
    
    if (!project) {
      logger.warn(`Project with ID ${projectId} not found`);
      return;
    }
    if (!this.projectModal) {
      logger.warn('projectModal element not found');
      return;
    }
    
    if (this.projectModalTitle) {
      this.projectModalTitle.textContent = project.title;
    }
    
    if (this.projectModalContent) {
      const techStackTags = project.stack.map(tech =>
        `<span class="stack-tag">${this.escapeHtml(tech)}</span>`
      ).join('');
      
      const impactChips = project.impact.map(imp =>
        `<span class="modal-impact-chip"><span class="impact-label">${this.escapeHtml(imp.label)}</span> <span class="impact-value">${this.escapeHtml(imp.value)}</span></span>`
      ).join('');
      
      this.projectModalContent.innerHTML = `
        <div class="case-study-block">
          <h3><i class="fa fa-exclamation-circle"></i> Problem</h3>
          <p>${this.escapeHtml(project.problem)}</p>
        </div>
        <div class="case-study-block">
          <h3><i class="fa fa-lightbulb"></i> Solution / Approach</h3>
          <p>${this.escapeHtml(project.solution)}</p>
        </div>
        <div class="case-study-block">
          <h3><i class="fa fa-code"></i> Tech Stack</h3>
          <div class="stack-tags">
            ${techStackTags}
          </div>
        </div>
        <div class="case-study-block">
          <h3><i class="fa fa-chart-line"></i> Results</h3>
          <div class="modal-impact-chips">
            ${impactChips}
          </div>
          <p>${this.escapeHtml(project.results)}</p>
        </div>
      `;
    }
    
    if (typeof openModal === 'function') {
      openModal(this.projectModal);
    } else {
      this.projectModal.style.display = 'flex';
      this.projectModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
}
