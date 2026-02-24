/**
 * Main Application Entry Point
 * Imports and initializes all modules
 */

import { NavigationController } from './modules/navigation.js';
import { ProjectsController } from './modules/projects.js';
import { ModalsController, modalsController } from './modules/modals.js';
import { ContactFormController } from './modules/contact-form.js';
import { InterestsController } from './modules/interests.js';
import { ScrollController } from './modules/scroll.js';
import { AppInitializer, initPreloaderAndAnimations } from './modules/init.js';
import { ResponsiveImagesController } from './modules/responsive-images.js';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Silent fail in production; app still works without SW
    });
  });
}

// Initialize all controllers when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  
  // Initialize core modules
  const appInit = new AppInitializer();
  const navigation = new NavigationController();
  const projects = new ProjectsController();
  const modals = modalsController; // Use singleton instance
  const contactForm = new ContactFormController();
  const interests = new InterestsController(modals);
  const scroll = new ScrollController();
  const responsiveImages = new ResponsiveImagesController();
  
  // Log successful initialization
  const logger = (typeof Utils !== 'undefined' && Utils.getLogger) 
    ? Utils.getLogger() 
    : { log: console.log.bind(console) };
  
  logger.log('🚀 Portfolio application initialized successfully');
});

// Initialize preloader and animations
initPreloaderAndAnimations();
registerServiceWorker();

// Export for global access if needed
window.PortfolioApp = {
  version: '2.0.0',
  modulesLoaded: true
};
