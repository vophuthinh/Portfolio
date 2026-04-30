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
    const handleScroll = () => {
      // Scroll Progress Bar
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      if (this.progressBar) {
        this.progressBar.style.width = scrollHeight > 0 ? `${progress}%` : "0%";
      }

      // Back to Top Button
      if (this.backToTopBtn) {
        if (window.scrollY > this.config.BACK_TO_TOP_THRESHOLD) {
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
  }

  setupBackToTopButton() {
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }
}
