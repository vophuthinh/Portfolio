import { AppConfig } from "../config.js";
import { Utils } from "../utils.js";

/**
 * Scroll Module
 * Handles scroll progress bar and back-to-top button
 */

export class ScrollController {
  constructor() {
    this.progressBar = document.querySelector(".scroll-progress-bar");
    this.backToTopBtn = document.querySelector(".back-to-top");

    this.config = {
      THROTTLE_MS: AppConfig.SCROLL?.THROTTLE_MS || 100,
      BACK_TO_TOP_THRESHOLD: AppConfig.NAVIGATION?.BACK_TO_TOP_THRESHOLD || 300,
    };

    this.init();
  }

  init() {
    this.setupScrollHandler();
    this.setupBackToTopButton();
  }

  setupScrollHandler() {
    const getActiveSection = () =>
      document.querySelector("main .section.active");

    const handleScroll = () => {
      const activeSection = getActiveSection();
      const scrollContainer = activeSection || document.documentElement;

      // Scroll Progress Bar
      const scrollTop = activeSection
        ? scrollContainer.scrollTop
        : document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.scrollY ||
          0;
      const scrollHeight = activeSection
        ? scrollContainer.scrollHeight - scrollContainer.clientHeight
        : document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }

      // Back to Top Button
      if (this.backToTopBtn) {
        const currentScroll = activeSection
          ? scrollContainer.scrollTop
          : window.scrollY || scrollTop;
        if (currentScroll > this.config.BACK_TO_TOP_THRESHOLD) {
          this.backToTopBtn.classList.add("show");
        } else {
          this.backToTopBtn.classList.remove("show");
        }
      }
    };

    // Throttle scroll events
    const throttledScrollHandler = Utils.throttle(
      handleScroll,
      this.config.THROTTLE_MS,
    );

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    const sections = document.querySelectorAll("main .section");
    sections.forEach((section) => {
      section.addEventListener("scroll", throttledScrollHandler, {
        passive: true,
      });
    });

    handleScroll();
  }

  setupBackToTopButton() {
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const activeSection = document.querySelector("main .section.active");
        if (activeSection) {
          activeSection.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }
}
