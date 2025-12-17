document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const typingElement = document.querySelector('.typing');
  if (typingElement) {
    if (typeof Typed !== 'undefined') {
      try {
        new Typed('.typing', {
          strings: ['', 'AI Engineer', 'ML Engineer', 'LLM Application Engineer', 'MLOps Practitioner'],
          typeSpeed: 100,
          backSpeed: 60,
          loop: true,
        });
      } catch (error) {
        console.error('Typed.js initialization error:', error);
        // Fallback: show static text
        typingElement.textContent = 'AI Engineer';
      }
    } else {
      console.warn('Typed.js library not loaded - using fallback');
      // Fallback: show static text
      typingElement.textContent = 'AI Engineer';
    }
  }

  const nav = document.querySelector('.nav');
  const allSection = document.querySelectorAll('section');
  const totalSection = allSection.length;

  // Only initialize navigation if nav exists
  if (nav) {
    const navList = nav.querySelectorAll('li');
    const totalNavList = navList.length;

    function removeBackSection() {
      for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove('back-section');
      }
    }

    function addBackSection(num) {
      if (allSection[num]) {
        allSection[num].classList.add('back-section');
      }
    }

    function showSection(element) {
      for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove('active');
      }
      const target = element.getAttribute('href')?.split('#')[1];
      if (target) {
        const targetSection = document.querySelector('#' + target);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      }
    }

    function updateNav(element) {
      const target = element.getAttribute('href')?.split('#')[1];
      if (!target) return;

      for (let i = 0; i < totalNavList; i++) {
        const navLink = navList[i].querySelector('a');
        if (navLink) {
          navLink.classList.remove('active');
          const navTarget = navLink.getAttribute('href')?.split('#')[1];
          if (navTarget === target) {
            navLink.classList.add('active');
          }
        }
      }
    }

    // Nav click handlers
    for (let i = 0; i < totalNavList; i++) {
      const a = navList[i].querySelector('a');
      if (!a) continue;

      a.addEventListener('click', function (e) {
        e.preventDefault();
        removeBackSection();

        for (let j = 0; j < totalNavList; j++) {
          const navLink = navList[j].querySelector('a');
          if (navLink && navLink.classList.contains('active')) {
            addBackSection(j);
          }
          if (navLink) {
            navLink.classList.remove('active');
          }
        }
        this.classList.add('active');
        showSection(this);
        updateNav(this);

        if (window.innerWidth < 1200) {
          asideSectionTogglerBtn();
        }
      });
    }

    // Hire Me button
    const hireMeBtn = document.querySelector('.hire-me');
    if (hireMeBtn) {
      hireMeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const sectionIndex = this.getAttribute('data-section-index');
        showSection(this);
        updateNav(this);
        removeBackSection();
        if (sectionIndex) {
          addBackSection(parseInt(sectionIndex));
        }
      });
    }
  }

  // CTA Buttons removed - no longer needed

  // Nav toggler (works even without nav)
  const navTogglerBtn = document.querySelector('.nav-toggler');
  const aside = document.querySelector('.aside');

  function asideSectionTogglerBtn() {
    if (aside) aside.classList.toggle('open');
    if (navTogglerBtn) navTogglerBtn.classList.toggle('open');
    for (let i = 0; i < totalSection; i++) {
      allSection[i].classList.toggle('open');
    }
  }

  if (navTogglerBtn) {
    navTogglerBtn.addEventListener('click', asideSectionTogglerBtn);
  }

  // ============================================
  // PROJECTS SECTION
  // ============================================
  // Projects data loaded from external file (projects-data.js)
  // Access via global: projectsData, projectConfig
  const projects = typeof projectsData !== 'undefined' ? projectsData : [];
  const config = typeof projectConfig !== 'undefined' ? projectConfig : {
    MAX_TECH_CHIPS_DISPLAY: 4,
    MAX_IMPACT_CHIPS_DISPLAY: 3
  };

  // Fallback if data not loaded
  if (projects.length === 0) {
    const logError = typeof Logger !== 'undefined' ? Logger.error : console.error;
    logError('Projects data not loaded! Make sure projects-data.js is included before script.js');
  }

  // ============================================
  // RENDER PROJECTS FROM DATA
  // ============================================
  function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
      // Better error handling - show user feedback instead of silent failure
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

    // Show loading state
    projectsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid var(--bg-black-50); border-top-color: var(--skin-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="color: var(--text-black-700); margin-top: 20px; font-size: 16px;">Loading projects...</p>
      </div>
    `;

    // Render projects after a brief delay (allows loading animation to show)
    setTimeout(() => {
      // Ensure grid is visible (remove any inline display:none)
      projectsGrid.style.display = '';

    // Use configuration from external file
    const MAX_TECH_CHIPS_DISPLAY = config.MAX_TECH_CHIPS_DISPLAY;
    const MAX_IMPACT_CHIPS_DISPLAY = config.MAX_IMPACT_CHIPS_DISPLAY;

    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    projectsGrid.innerHTML = projects.map(project => {
      // Get image path - fallback to default if not set
      const imagePath = project.image || `./assets/images/portfolio/portfolio-${project.id}.jpg`;

      // Tech chips for card (defensive: fallback to empty array if stack is missing)
      const techChips = (project.stack || []).slice(0, MAX_TECH_CHIPS_DISPLAY).map(tech =>
        `<span class="tech-chip">${escapeHtml(tech)}</span>`
      ).join('');

      // Impact chips for AI Engineer vibe (defensive: fallback to empty array if impact is missing)
      const impactChips = (project.impact || []).slice(0, MAX_IMPACT_CHIPS_DISPLAY).map(imp =>
        `<span class="impact-chip"><span class="impact-label">${escapeHtml(imp.label)}</span> <span class="impact-value">${escapeHtml(imp.value)}</span></span>`
      ).join('');

      // GitHub button - Beautiful redesign
      const githubHref = project.github !== '#' ? escapeHtml(project.github) : '#';
      const githubDisabled = project.github === '#' ? 'is-disabled' : '';
      const githubTarget = project.github !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
      const githubAriaDisabled = project.github === '#' ? 'aria-disabled="true"' : '';
      const githubTitle = project.github === '#' ? '🚧 Coming soon - Code will be available' : '📂 View source code on GitHub';
      const githubButton = `<a href="${githubHref}" ${githubTarget} ${githubAriaDisabled} title="${githubTitle}" class="btn-card btn-github-card ${githubDisabled}" aria-label="View on GitHub"><i class="fab fa-github"></i> <span>GitHub</span></a>`;

      // Project/Demo button - Beautiful redesign
      const projectHref = project.link !== '#' ? escapeHtml(project.link) : '#';
      const projectDisabled = project.link === '#' ? 'is-disabled' : '';
      const projectTarget = project.link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
      const projectAriaDisabled = project.link === '#' ? 'aria-disabled="true"' : '';
      const projectTitle = project.link === '#' ? '🚧 Coming soon - Demo will be available' : '🚀 View live demo';
      const projectButton = `<a href="${projectHref}" ${projectTarget} ${projectAriaDisabled} title="${projectTitle}" class="btn-card btn-demo-card ${projectDisabled}" aria-label="View live demo"><i class="fas fa-external-link-alt"></i> <span>Live Demo</span></a>`;

      const generatedHTML = `
        <div class="project-item" data-category="${project.category}" data-project-id="${project.id}">
          <div class="project-card">
            <div class="project-cover">
              <img src="${imagePath}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async" onerror="this.style.opacity='0.3'; this.closest('.project-cover').classList.add('img-error');" />
            </div>
            <div class="project-content">
              <h3 class="project-title">${escapeHtml(project.title)}</h3>
              <p class="project-summary">${escapeHtml(project.summary)}</p>
              ${impactChips ? `<div class="project-impact-chips">${impactChips}</div>` : ''}
              <div class="project-tech-chips">
                ${techChips}
              </div>
              <div class="project-actions" style="display: flex !important; gap: 16px !important; margin-top: 20px !important; padding-top: 20px !important; border-top: 2px solid rgba(236, 24, 57, 0.15) !important; visibility: visible !important; opacity: 1 !important;">
                ${githubButton}
                ${projectButton}
              </div>
            </div>
          </div>
        </div>
      `;

      return generatedHTML;
    }).join('');
    }, 300); // 300ms delay for loading animation
  }

  // Render projects on load
  renderProjects();

  // ============================================
  // PROJECT FILTER FUNCTIONALITY
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projectsGrid');

  // Ensure default active button exists
  if (filterButtons.length > 0) {
    const hasActive = Array.from(filterButtons).some(btn => btn.classList.contains('active'));
    if (!hasActive && filterButtons[0]) {
      filterButtons[0].classList.add('active');
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Remove active class and update aria-pressed from all buttons
      filterButtons.forEach(btn => {
        if (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      });
      // Add active class and update aria-pressed to clicked button
      if (this) {
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
      }

      const filterValue = this.getAttribute('data-filter');
      if (!filterValue || !projectsGrid) return;

      const projectItems = projectsGrid.querySelectorAll('.project-item');
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

  // ============================================
  // UNIFIED MODAL CONTROLLER
  // ============================================
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'flex';
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'none';
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Project modal functionality
  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalContent = document.getElementById('projectModalContent');

  // Helper function to get tech description
  function getTechDescription(tech) {
    const descriptions = {
      'LangChain': 'For building LLM applications and chains',
      'FAISS': 'For efficient vector similarity search',
      'OpenAI API': 'For GPT-4 text generation',
      'Python': 'Core programming language',
      'FastAPI': 'For building REST APIs',
      'Docker': 'For containerization',
      'PyTorch': 'Deep learning framework',
      'YOLOv8': 'Object detection model',
      'TensorRT': 'GPU acceleration',
      'OpenCV': 'Computer vision library',
      'MLflow': 'ML experiment tracking',
      'Airflow': 'Workflow orchestration',
      'Kubernetes': 'Container orchestration',
      'TensorFlow': 'Deep learning framework',
      'Apache Spark': 'Big data processing',
      'XGBoost': 'Gradient boosting',
      'scikit-learn': 'Machine learning library',
      'Pandas': 'Data manipulation',
      'SQL': 'Database queries'
    };
    return descriptions[tech] || 'Technology used in the project';
  }

  function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.warn(`Project with ID ${projectId} not found`);
      return;
    }
    if (!projectModal) {
      console.warn('projectModal element not found');
      return;
    }

    if (projectModalTitle) {
      projectModalTitle.textContent = project.title;
    }

    if (projectModalContent) {
      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      // Get project image
      const projectImage = project.image || `./assets/images/portfolio/portfolio-${project.id}.jpg`;

      // Create tech stack tags
      const techStackTags = project.stack.map(tech =>
        `<span class="stack-tag">${escapeHtml(tech)}</span>`
      ).join('');

      // Create impact chips for modal
      const impactChips = project.impact.map(imp =>
        `<span class="modal-impact-chip"><span class="impact-label">${escapeHtml(imp.label)}</span> <span class="impact-value">${escapeHtml(imp.value)}</span></span>`
      ).join('');

      // Render modal content (no buttons in modal)
      projectModalContent.innerHTML = `
        <div class="case-study-block">
          <h3><i class="fa fa-exclamation-circle"></i> Problem</h3>
          <p>${escapeHtml(project.problem)}</p>
        </div>
        <div class="case-study-block">
          <h3><i class="fa fa-lightbulb"></i> Solution / Approach</h3>
          <p>${escapeHtml(project.solution)}</p>
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
          <p>${escapeHtml(project.results)}</p>
        </div>
      `;
    }

    openModal(projectModal);
  }

  function closeProjectModal() {
    closeModal(projectModal);
  }

  // Project item click handlers - Event delegation
  if (projectsGrid) {
    projectsGrid.addEventListener('click', function (e) {
      // Prevent modal opening when clicking GitHub/Demo/Project buttons
      const clickedButton = e.target.closest('.btn-github-card, .btn-demo-card, .btn-card, .project-actions a');
      if (clickedButton) {
        // Stop propagation to prevent modal opening
        e.stopPropagation();
        // Prevent navigation for disabled buttons
        if (clickedButton.classList.contains('is-disabled') || clickedButton.classList.contains('disabled') || clickedButton.getAttribute('href') === '#') {
          e.preventDefault();
        }
        return;
      }

      // Handle project card clicks - open modal
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        const projectItem = projectCard.closest('.project-item');
        if (projectItem) {
          const projectIdAttr = projectItem.getAttribute('data-project-id');
          if (projectIdAttr) {
            const projectId = parseInt(projectIdAttr, 10);
            if (!isNaN(projectId)) {
              openProjectModal(projectId);
            }
          }
        }
      }
    });
  }

  // ============================================
  // MODAL SYSTEM (Unified)
  // ============================================
  const interestModal = document.getElementById('interestModal');
  const imageViewerModal = document.getElementById('imageViewerModal');

  // Verify modals exist
  if (!interestModal) console.warn('interestModal not found');
  if (!imageViewerModal) console.warn('imageViewerModal not found');

  // Focus trap function
  function trapFocus(modal) {
    if (!modal) return;
    const focusableElements = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Initialize focus trap for modals
  if (projectModal) trapFocus(projectModal);
  if (interestModal) trapFocus(interestModal);
  if (imageViewerModal) trapFocus(imageViewerModal);

  // Unified keyboard handler (ESC + Arrow keys)
  document.addEventListener('keydown', function (e) {
    // ESC key to close modals (close the topmost open modal)
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal.open, .modal[style*="flex"]');
      if (openModals.length > 0) {
        // Close the last opened modal (most likely the topmost one)
        const lastModal = openModals[openModals.length - 1];
        closeModal(lastModal);
        return;
      }
    }

    // Arrow keys for image viewer navigation
    if (imageViewerModal && imageViewerModal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeImageViewerImage(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeImageViewerImage(1);
      }
    }
  });

  // ============================================
  // INTERESTS MODAL
  // ============================================
  // Cấu trúc thư mục: assets/images/interests/{interest-key}/
  // Ví dụ: assets/images/interests/ai-research/image1.jpg
  //        assets/images/interests/ai-research/image2.jpg
  const interestData = {
    'ai-research': {
      title: "AI Research",
      // Thêm ảnh vào đây theo định dạng: "./assets/images/interests/ai-research/tên-file.jpg"
      images: [
        // "./assets/images/interests/ai-research/image1.jpg",
        // "./assets/images/interests/ai-research/image2.jpg",
      ]
    },
    'data-visualization': {
      title: "Data Visualization",
      // Thêm ảnh vào đây theo định dạng: "./assets/images/interests/data-visualization/tên-file.jpg"
      images: [
        // "./assets/images/interests/data-visualization/image1.jpg",
        // "./assets/images/interests/data-visualization/image2.jpg",
      ]
    },
    'building-tools': {
      title: "Building Tools",
      // Thêm ảnh vào đây theo định dạng: "./assets/images/interests/building-tools/tên-file.jpg"
      images: [
        // "./assets/images/interests/building-tools/image1.jpg",
        // "./assets/images/interests/building-tools/image2.jpg",
      ]
    },
    'tech-community': {
      title: "Tech Community",
      // Thêm ảnh vào đây theo định dạng: "./assets/images/interests/tech-community/tên-file.jpg"
      images: [
        // "./assets/images/interests/tech-community/image1.jpg",
        // "./assets/images/interests/tech-community/image2.jpg",
      ]
    },
    // Giữ lại các interest cũ để tương thích ngược (nếu có)
    traveling: {
      title: "My Travels",
      images: [
        "./assets/images/interests/traveling.jpg"
      ]
    }
  };

  function openInterestModal(interestKey) {
    const data = interestData[interestKey];
    if (!data) {
      console.warn(`Interest data for key "${interestKey}" not found`);
      return;
    }
    if (!interestModal) {
      console.warn('interestModal element not found');
      return;
    }

    const interestModalTitle = document.getElementById('interestModalTitle');
    const interestModalImages = document.getElementById('interestModalImages');

    if (interestModalTitle) {
      interestModalTitle.textContent = data.title;
    }

    if (interestModalImages) {
      if (!data.images || data.images.length === 0) {
        interestModalImages.innerHTML = '<div class="empty-gallery"><i class="fa fa-folder-open"></i><span>Thư mục trống</span></div>';
      } else {
        interestModalImages.innerHTML = '';
        data.images.forEach((imgPath, index) => {
          const img = document.createElement('img');
          img.src = imgPath;
          img.alt = data.title;
          img.loading = 'lazy';
          img.onerror = function () {
            this.style.display = 'none';
          };
          img.addEventListener('click', function () {
            openImageViewer(data.images, index);
          });
          interestModalImages.appendChild(img);
        });
      }
    }

    openModal(interestModal);
  }

  function closeInterestModal() {
    closeModal(interestModal);
  }

  // Unified click handler for modals and interests
  // Single event listener to avoid conflicts
  document.addEventListener('click', function (e) {
    const target = e.target;

    // Priority 1: Modal close buttons
    if (target.hasAttribute('data-modal-close')) {
      e.preventDefault();
      e.stopPropagation();
      const modalId = target.getAttribute('data-modal-close');
      if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          closeModal(modal);
        }
      } else {
        // If no modal ID, close the closest modal
        const closestModal = target.closest('.modal');
        if (closestModal) {
          closeModal(closestModal);
        }
      }
      return;
    }

    // Priority 2: Image viewer navigation
    if (target.hasAttribute('data-image-nav')) {
      e.preventDefault();
      e.stopPropagation();
      const direction = target.getAttribute('data-image-nav');
      changeImageViewerImage(direction);
      return;
    }

    // Priority 3: Interest box clicks (only if not inside a modal)
    const interestBox = e.target.closest('[data-interest]');
    if (interestBox && !e.target.closest('.modal')) {
      const interestKey = interestBox.getAttribute('data-interest');
      if (interestKey) {
        e.preventDefault();
        e.stopPropagation();
        openInterestModal(interestKey);
        return;
      }
    }

    // Priority 4: Click overlay to close modals (only if clicking directly on modal background)
    if (target.classList.contains('modal')) {
      closeModal(target);
      return;
    }
  });

  // ============================================
  // IMAGE VIEWER
  // ============================================
  let currentImageList = [];
  let currentImageIndex = 0;

  function openImageViewer(images, index) {
    if (!images || images.length === 0) {
      console.warn('No images provided to image viewer');
      return;
    }
    if (!imageViewerModal) {
      console.warn('imageViewerModal element not found');
      return;
    }

    currentImageList = images;
    currentImageIndex = (index >= 0 && index < images.length) ? index : 0;

    const viewerImage = document.getElementById('viewerImage');
    if (viewerImage) {
      viewerImage.src = currentImageList[currentImageIndex];
      viewerImage.alt = `Image ${currentImageIndex + 1} of ${images.length}`;
    }

    openModal(imageViewerModal);
  }

  function closeImageViewer() {
    closeModal(imageViewerModal);
  }

  function changeImageViewerImage(direction) {
    if (currentImageList.length === 0) return;

    currentImageIndex += parseInt(direction);
    if (currentImageIndex < 0) {
      currentImageIndex = currentImageList.length - 1;
    } else if (currentImageIndex >= currentImageList.length) {
      currentImageIndex = 0;
    }

    const viewerImage = document.getElementById('viewerImage');
    if (viewerImage) {
      viewerImage.src = currentImageList[currentImageIndex];
    }
  }

  // Image viewer navigation - handled in unified click handler above
  // Keyboard navigation - handled in unified keydown handler above

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.querySelector('.contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function handleContactSubmit(e) {
    e.preventDefault();

    const fromName = document.getElementById('from_name');
    const emailId = document.getElementById('email_id');
    const message = document.getElementById('message');

    if (!fromName || !emailId || !message) {
      console.warn('Contact form elements not found');
      return;
    }

    const email = emailId.value.trim();
    if (!validateEmail(email)) {
      emailId.style.borderColor = 'red';
      emailId.focus();
      return;
    }

    emailId.style.borderColor = '';

    // Check if EmailJS is available and configured
    if (typeof emailjs === 'undefined') {
      const fallbackMessage = 'Contact form is not configured. Please email directly at vophuthinhcm@gmail.com';
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: 'Contact Unavailable',
          text: fallbackMessage,
          confirmButtonText: 'OK'
        });
      } else {
        alert(fallbackMessage);
      }
      // Fallback: open mailto link
      window.location.href = `mailto:vophuthinhcm@gmail.com?subject=Contact from Portfolio&body=${encodeURIComponent(message.value)}`;
      return;
    }

    // EmailJS configuration - use AppConfig if available
    const EMAILJS_SERVICE_ID = (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.SERVICE_ID) ? AppConfig.EMAIL.SERVICE_ID : 'service_48b0gyq';
    const EMAILJS_TEMPLATE_ID = (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.TEMPLATE_ID) ? AppConfig.EMAIL.TEMPLATE_ID : 'template_4d2wwti';

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      const configMessage = 'EmailJS is not fully configured. Please contact directly at vophuthinhcm@gmail.com';
      alert(configMessage);
      window.location.href = `mailto:vophuthinhcm@gmail.com?subject=Contact from Portfolio&body=${encodeURIComponent(message.value)}`;
      return;
    }

    const params = {
      from_name: fromName.value.trim(),
      email_id: email,
      message: message.value.trim(),
    };

    // Disable submit button during sending
    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = 'Sending...';
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(function (res) {
        // Only clear form on success
        fromName.value = '';
        emailId.value = '';
        message.value = '';
        emailId.style.borderColor = '';

        if (typeof Swal !== 'undefined') {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Email Sent Successfully',
            text: 'Thank you for your message. I will get back to you soon!',
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          alert('Email sent successfully! Thank you for your message.');
        }
      })
      .catch(function (error) {
        console.error('EmailJS error:', error);

        // Don't clear form on error
        const errorMessage = 'Failed to send email. Please try again or contact directly at vophuthinhcm@gmail.com';
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Send Failed',
            text: errorMessage,
            confirmButtonText: 'OK'
          });
        } else {
          alert(errorMessage);
        }
      })
      .finally(function () {
        // Re-enable submit button
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.textContent = 'Send Message';
        }
      });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  if (contactSubmitBtn) {
    contactSubmitBtn.addEventListener('click', handleContactSubmit);
  }

  // ============================================
  // CERTIFICATE MODAL
  // ============================================
  const certificateImages = document.querySelectorAll('.certificate-img');
  if (certificateImages.length > 0) {
    const certModal = document.createElement('div');
    certModal.classList.add('certificate-modal', 'modal');
    certModal.setAttribute('role', 'dialog');
    certModal.setAttribute('aria-modal', 'true');
    certModal.setAttribute('aria-label', 'Certificate viewer');
    certModal.innerHTML = '<span class="close-modal" data-modal-close aria-label="Close certificate viewer">&times;</span><img src="" alt="Zoomed Certificate">';
    document.body.appendChild(certModal);

    const modalImg = certModal.querySelector('img');
    const closeModalBtn = certModal.querySelector('.close-modal');

    certificateImages.forEach((img) => {
      img.addEventListener('click', function () {
        if (modalImg) {
          modalImg.src = this.src;
          modalImg.alt = this.alt || 'Zoomed Certificate';
        }
        openModal(certModal);
      });
    });

    // Close handler is already handled by unified modal system via data-modal-close
    // But we also handle overlay click
    certModal.addEventListener('click', (event) => {
      if (event.target === certModal) {
        closeModal(certModal);
      }
    });
  }

  // ============================================
  // EXPERIENCE DURATION UPDATE
  // ============================================
  function calculateMonths(startDateStr) {
    const startDate = new Date(startDateStr);
    const currentDate = new Date();
    const yearsDifference = currentDate.getFullYear() - startDate.getFullYear();
    const monthsDifference = currentDate.getMonth() - startDate.getMonth();
    return yearsDifference * 12 + monthsDifference + 1;
  }

  function updateExperienceDuration() {
    const timelineDates = document.querySelectorAll('.timeline-date');
    timelineDates.forEach((element) => {
      const textContent = element.textContent;
      if (textContent.includes('Now')) {
        const startDateMatch = textContent.match(/([A-Za-z]{3}) (\d{4})/);
        if (startDateMatch) {
          const [_, monthStr, yearStr] = startDateMatch;
          const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
          };
          const startDate = new Date(parseInt(yearStr), monthMap[monthStr]);
          const months = calculateMonths(startDate);
          element.innerHTML = textContent.replace(/\(\d+mos\)/, `(${months}mos)`);
        }
      }
    });
  }

  updateExperienceDuration();

  // ============================================
  // AOS INITIALIZATION
  // ============================================
  // Wait for AOS to load (with defer, it should be ready)
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    } else {
      // Retry after a short delay if AOS not loaded yet
      setTimeout(initAOS, 100);
    }
  }
  initAOS();

  // ============================================
  // ============================================
  // EMAILJS INITIALIZATION
  // ============================================
  function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
      try {
      const publicKey = (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.PUBLIC_KEY) ? AppConfig.EMAIL.PUBLIC_KEY : 'oF2S6I0ORnNleh8lm';
      emailjs.init({
        publicKey: publicKey,
      });
      } catch (error) {
        console.warn('EmailJS init error:', error);
      }
    } else {
      // Retry after a short delay if not loaded yet
      setTimeout(initEmailJS, 100);
    }
  }
  initEmailJS();

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  setTimeout(() => {
    document.querySelectorAll('.section .container > *').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }, 100);
});
