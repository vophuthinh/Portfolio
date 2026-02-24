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
    this.initSkillsSphere();
  }

  getLogger() {
    return typeof Utils !== "undefined" && Utils.getLogger
      ? Utils.getLogger()
      : {
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
        };
  }

  setupTypingAnimation() {
    const typingElement = document.querySelector(".typing");
    if (!typingElement) return;

    if (typeof Typed !== "undefined") {
      try {
        new Typed(".typing", {
          strings: [
            "",
            "AI Engineer",
            "ML Engineer",
            "LLM Application Engineer",
            "MLOps Practitioner",
          ],
          typeSpeed: 100,
          backSpeed: 60,
          loop: true,
        });
      } catch (error) {
        const logger = this.getLogger();
        logger.error("Typed.js initialization error:", error);
        typingElement.textContent = "AI Engineer";
      }
    } else {
      const logger = this.getLogger();
      logger.warn("Typed.js library not loaded - using fallback");
      typingElement.textContent = "AI Engineer";
    }
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

  initSkillsSphere() {
    if (typeof SkillsSphere3D === "undefined") {
      setTimeout(() => this.initSkillsSphere(), 500);
      return;
    }

    const skills = [
      "PyTorch",
      "TensorFlow",
      "Python",
      "OpenCV",
      "LLM",
      "RAG",
      "LangChain",
      "HuggingFace",
      "Docker",
      "Kubernetes",
      "MLOps",
      "Git",
      "GitHub",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Elasticsearch",
      "Spark",
      "Pandas",
      "NumPy",
      "FastAPI",
      "Linux",
      "Jenkins",
      "AWS",
      "GCP",
      "SQL",
    ];

    const logger = this.getLogger();

    try {
      new SkillsSphere3D("skills-canvas", skills);
      logger.log("Neural Skills Sphere initialized");
    } catch (e) {
      logger.error("Sphere init error:", e);
    }
  }
}

// Preloader and AOS initialization
export function initPreloaderAndAnimations() {
  window.addEventListener("load", () => {
    // Hide Preloader
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }

    // Ensure active section is visible
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      activeSection.style.opacity = "1";
      activeSection.style.visibility = "visible";
    }

    // Init AOS Animation
    if (typeof LazyLoader !== "undefined") {
      LazyLoader.loadAOS().catch((err) => {
        const logger =
          typeof Utils !== "undefined" && Utils.getLogger
            ? Utils.getLogger()
            : { warn: console.warn.bind(console) };
        logger.warn("AOS lazy load failed:", err);
      });
    } else if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 50,
      });
    }
  });
}
