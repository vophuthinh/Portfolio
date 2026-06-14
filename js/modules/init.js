import { Utils } from "../utils.js";

/**
 * Initialization Module
 * Handles app initialization, typing animation, preloader, and misc features
 */

export class AppInitializer {
  constructor() {
    this.init();
  }

  init() {
    this.setupTypingAnimation();
    this.updateExperienceDuration();
    this.setupThemeToggle();
    this.setupStatCounters();
  }

  getLogger() {
    return Utils.getLogger();
  }

  setupTypingAnimation() {
    const typingElement = document.querySelector(".typing");
    if (!typingElement) return;
    typingElement.textContent = "AI Engineer";

    const initTyped = () => {
      if (typeof Typed === "undefined") return;
      try {
        new Typed(".typing", {
          strings: [
            "",
            "AI Engineer",
            "Software Solutions Engineer",
            "LLM Application Developer",
            "AI Agent Builder",
          ],
          typeSpeed: 100,
          backSpeed: 60,
          loop: true,
        });
      } catch (error) {
        const logger = this.getLogger();
        logger.error("Typed.js initialization error:", error);
      }
    };

    const loadTypedScript = () =>
      new Promise((resolve) => {
        if (typeof Typed !== "undefined") {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.1.0/typed.umd.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });

    const runWhenIdle = window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (cb) => setTimeout(cb, 300);

    runWhenIdle(async () => {
      await loadTypedScript();
      initTyped();
    });
  }

  updateExperienceDuration() {
    const calculateMonths = (startDateStr) => {
      const startDate = new Date(startDateStr);
      const currentDate = new Date();
      const yearsDifference =
        currentDate.getFullYear() - startDate.getFullYear();
      const monthsDifference = currentDate.getMonth() - startDate.getMonth();
      return yearsDifference * 12 + monthsDifference + 1;
    };

    const formatDuration = (totalMonths) => {
      if (totalMonths >= 12) {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        if (months === 0) return `${years}yr`;
        return `${years}yr ${months}mos`;
      }
      return `${totalMonths}mos`;
    };

    const timelineDates = document.querySelectorAll(".timeline-date");
    timelineDates.forEach((element) => {
      const textContent = element.textContent;
      if (textContent.includes("Now")) {
        const startDateMatch = textContent.match(/([A-Za-z]{3}) (\d{4})/);
        if (startDateMatch) {
          const [_, monthStr, yearStr] = startDateMatch;
          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          const startDate = new Date(parseInt(yearStr), monthMap[monthStr]);
          const months = calculateMonths(startDate);
          element.innerHTML = textContent.replace(
            /\([^)]*mos\)/,
            `(${formatDuration(months)})`,
          );
        }
      }
    });
  }

  setupThemeToggle() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    // Restore saved theme
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  setupHeroSpotlight() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    homeSection.addEventListener('mousemove', (e) => {
      const rect = homeSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      homeSection.style.setProperty('--spotlight-x', x);
      homeSection.style.setProperty('--spotlight-y', y);
    });
  }

  setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const animateCounter = (el, target, suffix, duration = 1200, delay = 0) => {
      setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutExpo(progress);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const suffix = raw.replace(/[\d]/g, '');
        const num = parseInt(raw.replace(/\D/g, ''), 10);
        if (!isNaN(num)) {
          animateCounter(el, num, suffix);
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((el, i) => {
      el.dataset.target = el.textContent;
      observer.observe(el);
    });

    // Also trigger on sectionChange
    document.addEventListener('sectionChange', () => {
      statNumbers.forEach((el) => {
        if (!el.dataset.animated) {
          const raw = el.dataset.target || el.textContent.trim();
          const suffix = raw.replace(/[\d]/g, '');
          const num = parseInt(raw.replace(/\D/g, ''), 10);
          if (!isNaN(num)) {
            el.dataset.animated = 'true';
            animateCounter(el, num, suffix);
          }
        }
      });
    });
  }
}

// Preloader and AOS initialization
export function initPreloaderAndAnimations() {
  const hidePreloader = () => {
    const preloader = document.querySelector(".preloader");
    if (!preloader || preloader.classList.contains("fade-out")) return;
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 300);
  };

  document.addEventListener("DOMContentLoaded", () => {
    hidePreloader();
    setTimeout(hidePreloader, 1200);

    // Ensure active section is visible
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      // Force reflow to ensure CSS transition applies correctly
      activeSection.classList.add("active");
    }

    // Init AOS Animation if library is available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 50,
      });
    }
  });
}
