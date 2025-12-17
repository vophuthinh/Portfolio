
const PerformanceMonitor = {
  metrics: {},
  enabled: true,

  // Get Core Web Vitals
  getCoreWebVitals() {
    if (!window.performance) return null;

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      // First Contentful Paint
      FCP: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      
      // Largest Contentful Paint (requires PerformanceObserver)
      LCP: this.metrics.LCP || 0,
      
      // First Input Delay
      FID: this.metrics.FID || 0,
      
      // Cumulative Layout Shift
      CLS: this.metrics.CLS || 0,
      
      // Time to Interactive
      TTI: navigation ? navigation.domInteractive - navigation.fetchStart : 0,
      
      // Total Page Load Time
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      
      // DOM Content Loaded
      DOMContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0
    };
  },

  // Observe LCP (Largest Contentful Paint)
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  },

  // Observe FID (First Input Delay)
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-input') {
            this.metrics.FID = entry.processingStart - entry.startTime;
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  },

  // Observe CLS (Cumulative Layout Shift)
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsScore = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            this.metrics.CLS = clsScore;
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  },

  // Log performance report
  logReport() {
    if (!this.enabled) return;

    const vitals = this.getCoreWebVitals();
    const log = typeof Logger !== 'undefined' ? Logger.log : console.log;

    log('📊 Performance Report:');
    log(`   FCP: ${vitals.FCP.toFixed(0)}ms`);
    log(`   LCP: ${vitals.LCP.toFixed(0)}ms ${vitals.LCP < 2500 ? '✅' : vitals.LCP < 4000 ? '⚠️' : '❌'}`);
    log(`   FID: ${vitals.FID.toFixed(0)}ms ${vitals.FID < 100 ? '✅' : vitals.FID < 300 ? '⚠️' : '❌'}`);
    log(`   CLS: ${vitals.CLS.toFixed(3)} ${vitals.CLS < 0.1 ? '✅' : vitals.CLS < 0.25 ? '⚠️' : '❌'}`);
    log(`   TTI: ${vitals.TTI.toFixed(0)}ms`);
    log(`   Load Time: ${vitals.loadTime.toFixed(0)}ms`);
    log(`   DOMContentLoaded: ${vitals.DOMContentLoaded.toFixed(0)}ms`);
  },

  // Initialize performance monitoring
  init() {
    if (!this.enabled || typeof AppConfig !== 'undefined' && !AppConfig.DEV.ENABLE_CONSOLE_LOGS) {
      this.enabled = false;
      return;
    }

    this.observeLCP();
    this.observeFID();
    this.observeCLS();

    // Log report after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.logReport(), 0);
    });

    const log = typeof Logger !== 'undefined' ? Logger.log : console.log;
    log('📊 Performance Monitor initialized');
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PerformanceMonitor.init());
} else {
  PerformanceMonitor.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}
