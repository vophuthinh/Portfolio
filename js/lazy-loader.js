/**
 * Lazy Loader for Non-Critical Libraries
 * Loads libraries only when needed
 */

const LazyLoader = {
  loaded: new Set(),
  loading: new Set(),

  /**
   * Load a script dynamically
   * @param {string} src - Script source URL
   * @param {string} id - Unique identifier for the script
   * @returns {Promise}
   */
  loadScript(src, id) {
    if (this.loaded.has(id)) {
      return Promise.resolve();
    }

    if (this.loading.has(id)) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.loaded.has(id)) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 50);
      });
    }

    this.loading.add(id);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => {
        this.loaded.add(id);
        this.loading.delete(id);
        resolve();
      };
      script.onerror = () => {
        this.loading.delete(id);
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });
  },

  /**
   * Load AOS library
   */
  async loadAOS() {
    if (typeof AOS !== 'undefined') {
      return Promise.resolve();
    }
    await this.loadScript('https://unpkg.com/aos@2.3.1/dist/aos.js', 'aos');
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
  },

  /**
   * Load particles.js
   */
  async loadParticles() {
    if (this.loaded.has('particles')) {
      return Promise.resolve();
    }
    await this.loadScript('./js/particles.js', 'particles');
  },

  /**
   * Load spotlight.js
   */
  async loadSpotlight() {
    if (this.loaded.has('spotlight')) {
      return Promise.resolve();
    }
    await this.loadScript('./js/spotlight.js', 'spotlight');
  },

  /**
   * Load tilt.js
   */
  async loadTilt() {
    if (this.loaded.has('tilt')) {
      return Promise.resolve();
    }
    await this.loadScript('./js/tilt.js', 'tilt');
  },

  /**
   * Load magnetic.js
   */
  async loadMagnetic() {
    if (this.loaded.has('magnetic')) {
      return Promise.resolve();
    }
    await this.loadScript('./js/magnetic.js', 'magnetic');
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}

