/**
 * Responsive Images Module
 * Handles responsive image loading with srcset and WebP support
 */

export class ResponsiveImagesController {
  constructor() {
    this.supportsWebP = false;
    this.supportsAVIF = false;
    this.init();
  }
  
  async init() {
    await this.detectImageFormats();
    this.setupLazyLoading();
    this.optimizeExistingImages();
  }
  
  /**
   * Detect browser support for modern image formats
   */
  async detectImageFormats() {
    // Check WebP support
    this.supportsWebP = await this.checkImageFormat(
      'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
    );
    
    // Check AVIF support
    this.supportsAVIF = await this.checkImageFormat(
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
    );
    
    const logger = this.getLogger();
    logger.log(`Image format support: WebP=${this.supportsWebP}, AVIF=${this.supportsAVIF}`);
  }
  
  /**
   * Check if browser supports a specific image format
   */
  checkImageFormat(dataURI) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = dataURI;
    });
  }
  
  /**
   * Setup lazy loading with Intersection Observer
   */
  setupLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  /**
   * Load a single image
   */
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (!src) return;
    
    // Load srcset if available
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.src = src;
    img.classList.add('loaded');
    
    img.onload = () => {
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    };
  }
  
  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
  
  /**
   * Optimize existing images by adding responsive attributes
   */
  optimizeExistingImages() {
    // This will be called after images are processed
    // You can add additional optimization logic here
  }
  
  /**
   * Generate responsive image HTML
   * @param {Object} options - Image options
   * @returns {string} HTML string
   */
  static generateResponsiveImage(options) {
    const {
      src,
      alt = '',
      sizes = '100vw',
      widths = [320, 640, 960, 1280],
      loading = 'lazy',
      className = ''
    } = options;
    
    const basePath = src.substring(0, src.lastIndexOf('.'));
    const ext = src.substring(src.lastIndexOf('.'));
    
    // Generate srcset for different sizes
    const srcsetWebP = widths.map(w => `${basePath}-${w}.webp ${w}w`).join(', ');
    const srcsetAVIF = widths.map(w => `${basePath}-${w}.avif ${w}w`).join(', ');
    const srcsetFallback = widths.map(w => `${basePath}-${w}${ext} ${w}w`).join(', ');
    
    return `
      <picture>
        <source type="image/avif" srcset="${srcsetAVIF}" sizes="${sizes}">
        <source type="image/webp" srcset="${srcsetWebP}" sizes="${sizes}">
        <img src="${src}"
             srcset="${srcsetFallback}"
             sizes="${sizes}"
             alt="${alt}"
             loading="${loading}"
             decoding="async"
             class="${className}">
      </picture>
    `;
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
}
