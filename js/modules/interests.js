/**
 * Interests Module
 * Handles interest gallery modal display
 */

export class InterestsController {
  constructor(modalsController) {
    this.modalsController = modalsController;
    this.interests = typeof interestData !== 'undefined' ? interestData : {};
    this.interestModal = document.getElementById('interestModal');
    this.interestModalTitle = document.getElementById('interestModalTitle');
    this.interestModalImages = document.getElementById('interestModalImages');
    
    this.init();
  }
  
  init() {
    this.setupInterestClickHandlers();
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
  
  setupInterestClickHandlers() {
    document.addEventListener('click', (e) => {
      const interestBox = e.target.closest('[data-interest]');
      if (interestBox && !e.target.closest('.modal')) {
        const interestKey = interestBox.getAttribute('data-interest');
        if (interestKey) {
          e.preventDefault();
          e.stopPropagation();
          this.openInterestModal(interestKey);
        }
      }
    });
  }
  
  openInterestModal(interestKey) {
    const data = this.interests[interestKey];
    const logger = this.getLogger();
    
    if (!data) {
      logger.warn(`Interest data for key "${interestKey}" not found`);
      return;
    }
    if (!this.interestModal) {
      logger.warn('interestModal element not found');
      return;
    }
    
    if (this.interestModalTitle) {
      this.interestModalTitle.textContent = data.title;
    }
    
    if (this.interestModalImages) {
      if (!data.images || data.images.length === 0) {
        this.interestModalImages.innerHTML = '<div class="empty-gallery"><i class="fa fa-folder-open"></i><span>Thư mục trống</span></div>';
      } else {
        this.interestModalImages.innerHTML = '';
        data.images.forEach((item, index) => {
          const src = typeof item === 'string' ? item : item.src;
          const caption = typeof item === 'string' ? '' : item.caption;
          
          const container = document.createElement('div');
          container.className = 'gallery-item';
          
          const img = document.createElement('img');
          img.src = src;
          img.alt = caption || data.title;
          img.loading = 'lazy';
          img.onerror = function () {
            this.style.display = 'none';
          };
          
          img.addEventListener('click', () => {
            if (this.modalsController) {
              this.modalsController.openImageViewer(data.images, index);
            }
          });
          
          container.appendChild(img);
          
          if (caption) {
            const capEl = document.createElement('div');
            capEl.className = 'gallery-item-caption';
            capEl.textContent = caption;
            container.appendChild(capEl);
          }
          
          this.interestModalImages.appendChild(container);
        });
      }
    }
    
    if (this.modalsController) {
      this.modalsController.openModal(this.interestModal);
    }
  }
}
