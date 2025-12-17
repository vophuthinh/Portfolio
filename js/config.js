
const AppConfig = {
  // Email Configuration (EmailJS)
  EMAIL: {
    SERVICE_ID: 'service_48b0gyq',
    TEMPLATE_ID: 'template_4d2wwti',
    PUBLIC_KEY: 'oF2S6I0ORnNleh8lm',
    FALLBACK_EMAIL: 'vophuthinhcm@gmail.com'
  },

  // Development Settings
  DEV: {
    ENABLE_CONSOLE_LOGS: true, // Set to false in production
    ENABLE_ERROR_TRACKING: true
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
