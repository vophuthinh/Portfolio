/**
 * Main Application Entry Point
 * Imports and initializes all modules
 */

import { Logger } from "./config.js";
import { NavigationController } from "./modules/navigation.js";
import { ProjectsController } from "./modules/projects.js";
import { modalsController } from "./modules/modals.js";
import { ContactFormController } from "./modules/contact-form.js";
import { ContactCardsController } from "./modules/contact-cards.js";
import { ScrollController } from "./modules/scroll.js";
import { AppInitializer, initPreloaderAndAnimations } from "./modules/init.js";
import { ResponsiveImagesController } from "./modules/responsive-images.js";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent fail in production; app still works without SW
    });
  });
}

function cleanupDevServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.DEV) return;

  // In Vite dev mode, active SW can cache /@vite/client and break HMR websocket.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });

  if ("caches" in window) {
    caches.keys().then((cacheKeys) => {
      cacheKeys
        .filter((key) => key.includes("vophuthinh-portfolio"))
        .forEach((key) => {
          caches.delete(key);
        });
    });
  }
}

// Initialize all controllers when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  cleanupDevServiceWorkers();

  // Initialize core modules
  const appInit = new AppInitializer();
  const navigation = new NavigationController();
  const projects = new ProjectsController();
  const modals = modalsController; // Use singleton instance
  const contactForm = new ContactFormController();
  const contactCards = new ContactCardsController();
  const scroll = new ScrollController();
  const responsiveImages = new ResponsiveImagesController();

  // Log successful initialization
  const logger = Logger;

  logger.log("🚀 Portfolio application initialized successfully");
});

// Initialize preloader and animations
initPreloaderAndAnimations();
registerServiceWorker();

// Export for global access if needed
window.PortfolioApp = {
  version: "2.0.0",
  modulesLoaded: true,
};
