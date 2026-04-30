import { AppConfig } from "../config.js";

/**
 * Navigation Module
 * Handles navigation logic, section switching, and scroll-based navigation
 */

export class NavigationController {
  constructor() {
    this.nav = document.querySelector(".nav");
    this.allSection = document.querySelectorAll("main .section");
    this.totalSection = this.allSection.length;
    this.navList = this.nav ? this.nav.querySelectorAll("li") : [];
    this.totalNavList = this.navList.length;
    this.aside = document.querySelector(".aside");
    this.navTogglerBtn = document.querySelector(".nav-toggler");

    // Navigation config
    this.config = AppConfig.NAVIGATION || {
      SECTION_SCROLL_ANIM_MS: 700,
      SECTION_SCROLL_COOLDOWN_MS: 750,
      SECTION_SCROLL_EDGE_PX: 5,
      WHEEL_DELTA_THRESHOLD: 50,
    };

    // Wheel navigation state
    this.wheelAccum = 0;
    this.wheelAccumDir = 0;
    this.isSectionTransitioning = false;
    this.lastSectionScrollTs = 0;
    this.edgeReachedTs = 0; // Timestamp when user first hit edge

    this.init();
  }

  init() {
    if (!this.nav) return;

    this.setupNavClickHandlers();
    this.setupHireMeButton();
    this.setupNavToggler();
    this.setupWheelNavigation();
  }

  removeBackSection() {
    for (let i = 0; i < this.totalSection; i++) {
      this.allSection[i].classList.remove("back-section");
    }
  }

  addBackSection(num) {
    if (this.allSection[num]) {
      this.allSection[num].classList.add("back-section");
    }
  }

  showSection(element) {
    const target = element.getAttribute("href")?.split("#")[1];
    if (target) {
      for (let i = 0; i < this.totalSection; i++) {
        this.allSection[i].classList.remove("active");
      }
      const targetSection = document.querySelector("#" + target);
      if (targetSection) {
        targetSection.classList.add("active");

        // Some sections use AOS on the section root. Because sections are
        // fixed and toggled via classes, force animation state after nav switch.
        if (targetSection.hasAttribute("data-aos")) {
          targetSection.classList.add("aos-animate");
        }

        if (
          typeof AOS !== "undefined" &&
          typeof AOS.refreshHard === "function"
        ) {
          AOS.refreshHard();
        }
      }
    }
  }

  updateNav(element) {
    const target = element.getAttribute("href")?.split("#")[1];
    if (!target) return;

    for (let i = 0; i < this.totalNavList; i++) {
      const navLink = this.navList[i].querySelector("a");
      if (navLink) {
        navLink.classList.remove("active");
        const navTarget = navLink.getAttribute("href")?.split("#")[1];
        if (navTarget === target) {
          navLink.classList.add("active");
        }
      }
    }
  }

  setupNavClickHandlers() {
    for (let i = 0; i < this.totalNavList; i++) {
      const a = this.navList[i].querySelector("a");
      if (!a) continue;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeBackSection();

        for (let j = 0; j < this.totalNavList; j++) {
          const navLink = this.navList[j].querySelector("a");
          if (navLink && navLink.classList.contains("active")) {
            this.addBackSection(j);
          }
          if (navLink) {
            navLink.classList.remove("active");
          }
        }
        a.classList.add("active");
        this.showSection(a);
        this.updateNav(a);

        if (window.innerWidth < 1200) {
          this.toggleAside();
        }
      });
    }
  }

  setupHireMeButton() {
    const hireMeBtn = document.querySelector(".hire-me");
    if (hireMeBtn) {
      hireMeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionIndex = hireMeBtn.getAttribute("data-section-index");
        this.showSection(hireMeBtn);
        this.updateNav(hireMeBtn);
        this.removeBackSection();
        if (sectionIndex) {
          this.addBackSection(parseInt(sectionIndex));
        }
      });
    }
  }

  setupNavToggler() {
    if (this.navTogglerBtn) {
      this.navTogglerBtn.addEventListener("click", () => this.toggleAside());
    }
  }

  toggleAside() {
    if (this.aside) this.aside.classList.toggle("open");
    if (this.navTogglerBtn) this.navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < this.totalSection; i++) {
      this.allSection[i].classList.toggle("open");
    }
  }

  getActiveNavIndex() {
    for (let i = 0; i < this.totalNavList; i++) {
      const link = this.navList[i].querySelector("a");
      if (link && link.classList.contains("active")) return i;
    }

    const activeSection = document.querySelector("section.active");
    if (activeSection && activeSection.id) {
      for (let i = 0; i < this.totalNavList; i++) {
        const link = this.navList[i].querySelector("a");
        const target = link?.getAttribute("href")?.split("#")[1];
        if (target === activeSection.id) return i;
      }
    }
    return 0;
  }

  isAnyModalOpen() {
    return !!document.querySelector('.modal.open, .modal[style*="flex"]');
  }

  getScrollableParent(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const style = window.getComputedStyle(cur);
      const overflowY = style.overflowY;
      const canScroll =
        (overflowY === "auto" || overflowY === "scroll") &&
        cur.scrollHeight > cur.clientHeight + 1;
      if (canScroll) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  navigateToNavIndex(nextIndex) {
    if (nextIndex < 0 || nextIndex >= this.totalNavList) return;
    const targetLink = this.navList[nextIndex].querySelector("a");
    if (!targetLink) return;

    const currentIndex = this.getActiveNavIndex();

    this.wheelAccum = 0;
    this.wheelAccumDir = 0;
    this.removeBackSection();

    if (currentIndex >= 0 && currentIndex !== nextIndex) {
      this.addBackSection(currentIndex);
    }

    this.showSection(targetLink);
    this.updateNav(targetLink);

    const targetId = targetLink.getAttribute("href")?.split("#")[1];
    if (targetId && history.replaceState) {
      history.replaceState(null, "", `#${targetId}`);
    }

    const activeSection = document.querySelector("section.active");
    if (activeSection && activeSection.scrollTop > 0) {
      activeSection.scrollTop = 0;
    }

    this.isSectionTransitioning = true;
    setTimeout(() => {
      this.isSectionTransitioning = false;
      this.removeBackSection();
    }, this.config.SECTION_SCROLL_ANIM_MS);
  }

  setupWheelNavigation() {
    const handleWheel = (e) => {
      if (this.isAnyModalOpen()) return;
      if (this.isSectionTransitioning) return;

      if (
        e.target &&
        e.target.closest('input, textarea, select, [contenteditable="true"]')
      )
        return;
      if (e.ctrlKey) return;

      const dy = e.deltaY;
      if (!dy) return;

      const direction = dy > 0 ? 1 : -1;
      const activeSection = document.querySelector("section.active");
      if (!activeSection) return;

      const nestedScroll = this.getScrollableParent(e.target);
      if (nestedScroll && nestedScroll !== activeSection) {
        this.wheelAccum = 0;
        this.wheelAccumDir = 0;
        return;
      }

      const scrollContainer = activeSection;
      const canScroll =
        scrollContainer.scrollHeight >
        scrollContainer.clientHeight + this.config.SECTION_SCROLL_EDGE_PX;

      if (canScroll) {
        const maxScrollTop =
          scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const atTop =
          scrollContainer.scrollTop <= this.config.SECTION_SCROLL_EDGE_PX;
        const atBottom =
          scrollContainer.scrollTop >=
          maxScrollTop - this.config.SECTION_SCROLL_EDGE_PX;

        if ((direction === 1 && !atBottom) || (direction === -1 && !atTop)) {
          this.wheelAccum = 0;
          this.wheelAccumDir = 0;
          this.edgeReachedTs = 0;
          return;
        }
      }

      // Dwell time: user must stay at edge for a minimum duration
      const edgeDwell = this.config.EDGE_DWELL_MS || 400;
      const now2 = Date.now();
      if (this.edgeReachedTs === 0) {
        this.edgeReachedTs = now2;
      }
      if (now2 - this.edgeReachedTs < edgeDwell) {
        e.preventDefault();
        return;
      }

      if (this.wheelAccumDir !== direction) {
        this.wheelAccum = 0;
        this.wheelAccumDir = direction;
      }
      this.wheelAccum += Math.abs(dy);

      if (this.wheelAccum < this.config.WHEEL_DELTA_THRESHOLD) return;

      this.wheelAccum = 0;
      this.wheelAccumDir = 0;
      this.edgeReachedTs = 0;

      const currentIndex = this.getActiveNavIndex();
      const nextIndex = direction === 1 ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= this.totalNavList) return;

      const now = Date.now();
      if (
        now - this.lastSectionScrollTs <
        this.config.SECTION_SCROLL_COOLDOWN_MS
      )
        return;
      this.lastSectionScrollTs = now;

      e.preventDefault();
      this.navigateToNavIndex(nextIndex);
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
  }
}
