import { AppConfig } from "../config.js";
import { Utils } from "../utils.js";

/**
 * Scroll Module
 * Handles back-to-top button behavior with native window scrolling
 */

export class ScrollController {
  constructor() {
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
      const currentScroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (this.backToTopBtn) {
        if (currentScroll > this.config.BACK_TO_TOP_THRESHOLD) {
          this.backToTopBtn.classList.add("show");
        } else {
          this.backToTopBtn.classList.remove("show");
        }
      }
    };

    const throttledScrollHandler = Utils.throttle(
      handleScroll,
      this.config.THROTTLE_MS,
    );

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    handleScroll();
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
