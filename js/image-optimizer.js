const ImageOptimizer = {
  supportsWebP: null,

  async detectWebPSupport() {
    if (this.supportsWebP !== null) {
      return this.supportsWebP;
    }

    return new Promise((resolve) => {
      const webp = new Image();
      webp.onload = webp.onerror = () => {
        this.supportsWebP = webp.height === 2;
        resolve(this.supportsWebP);
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  getOptimizedPath(imagePath) {
    if (!imagePath) return imagePath;

    // Don't convert if already WebP or external URL
    if (imagePath.includes('.webp') || imagePath.startsWith('http')) {
      return imagePath;
    }

    if (this.supportsWebP) {
      return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return imagePath;
  },

  lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if (false && this.supportsWebP) {
      images.forEach(img => {
        if (img.dataset.src) {
          img.dataset.src = this.getOptimizedPath(img.dataset.src);
        }
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:') && !src.startsWith('http')) {
          const newSrc = this.getOptimizedPath(src);
          if (newSrc !== src) {
            img.src = newSrc;
          }
        }
      });
    }

    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  },

  async init() {
    await this.detectWebPSupport();
    this.lazyLoadImages();

    const log = typeof Logger !== 'undefined' ? Logger.log : console.log;
    log(`Image Optimizer initialized. WebP support: ${this.supportsWebP}`);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ImageOptimizer.init());
} else {
  ImageOptimizer.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}
