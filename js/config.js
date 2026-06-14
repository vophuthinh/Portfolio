const AppConfig = {
  // Email Configuration
  EMAIL: {
    // Use backend API proxy (credentials secured server-side)
    API_ENDPOINT: "/api/contact",
    FALLBACK_EMAIL: "vophuthinhcm@gmail.com",
  },

  // Development Settings
  DEV: {
    ENABLE_CONSOLE_LOGS: false, // Set to false in production, true for debugging
    ENABLE_ERROR_TRACKING: true,
  },

  // Navigation Settings
  NAVIGATION: {
    SECTION_SCROLL_ANIM_MS: 700, // Match CSS animation duration (0.65s + buffer)
    SECTION_SCROLL_COOLDOWN_MS: 750, // Lock wheel scroll during transition
    SECTION_SCROLL_EDGE_PX: 5, // Edge detection threshold in pixels
    WHEEL_DELTA_THRESHOLD: 200, // Trackpad: must scroll enough to trigger section change
    EDGE_DWELL_MS: 400, // Must stay at edge this long before section switch
    BACK_TO_TOP_THRESHOLD: 300, // Show back-to-top button after scrolling this many pixels
  },

  // Scroll Settings
  SCROLL: {
    THROTTLE_MS: 100, // Throttle interval for scroll events
    PROGRESS_BAR_ROOT_MARGIN: "0px", // Intersection Observer root margin for scroll progress
  },
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
  },
};

// Assign to window for non-module scripts
if (typeof window !== "undefined") {
  window.AppConfig = AppConfig;
  window.Logger = Logger;
}

export { AppConfig, Logger };
