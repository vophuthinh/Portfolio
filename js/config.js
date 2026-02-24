const AppConfig = {
  // Email Configuration
  EMAIL: {
    // Use backend API proxy (recommended for security)
    API_ENDPOINT: '/api/contact',
    
    // Keep empty on client. Configure only via environment variables on server.
    SERVICE_ID: '',
    TEMPLATE_ID: '',
    PUBLIC_KEY: '',
    FALLBACK_EMAIL: 'vophuthinhcm@gmail.com'
  },

  // Development Settings
  DEV: {
    ENABLE_CONSOLE_LOGS: false, // Set to false in production, true for debugging
    ENABLE_ERROR_TRACKING: true
  },

  // Navigation Settings
  NAVIGATION: {
    SECTION_SCROLL_ANIM_MS: 700,        // Match CSS animation duration (0.65s + buffer)
    SECTION_SCROLL_COOLDOWN_MS: 750,    // Lock wheel scroll during transition
    SECTION_SCROLL_EDGE_PX: 5,          // Edge detection threshold in pixels
    WHEEL_DELTA_THRESHOLD: 50,          // Trackpad: must scroll enough to trigger section change (reduced for easier switching)
    BACK_TO_TOP_THRESHOLD: 300          // Show back-to-top button after scrolling this many pixels
  },

  // Scroll Settings
  SCROLL: {
    THROTTLE_MS: 100,                   // Throttle interval for scroll events
    PROGRESS_BAR_ROOT_MARGIN: '0px'     // Intersection Observer root margin for scroll progress
  }
};

// Logging utility that respects DEV settings
const Logger = {
  log: (...args) => {
    if (AppConfig.DEV.ENABLE_CONSOLE_LOGS) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (AppConfig.DEV.ENABLE_CONSOLE_LOGS) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (AppConfig.DEV.ENABLE_ERROR_TRACKING) {
      console.error(...args);
    }
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppConfig, Logger };
}
