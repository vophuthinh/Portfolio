/**
 * Navigation Module
 * Handles continuous scroll, IntersectionObserver scroll-spy, and mobile navigation
 */

export class NavigationController {
  constructor() {
    this.nav = document.querySelector(".nav, .header-nav");
    this.allSection = document.querySelectorAll("main .section, main section");
    this.totalSection = this.allSection.length;
    this.navList = this.nav ? this.nav.querySelectorAll("li") : [];
    this.totalNavList = this.navList.length;
    this.aside = document.querySelector(".aside, .site-header, .header-nav");
    this.navTogglerBtn = document.querySelector(".nav-toggler");
    this.header = document.querySelector(".site-header");

    this.currentSectionId = "home";
    this.isClickScrolling = false;
    this.clickScrollTimeout = null;

    this.init();
  }

  init() {
    if (!this.nav && !this.allSection.length) return;

    this.setupNavClickHandlers();
    this.setupHireMeButton();
    this.setupNavToggler();
    this.setupScrollSpy();
    this.setupHeaderScrollEffect();
  }

  setupHeaderScrollEffect() {
    if (!this.header) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        this.header.classList.add("scrolled");
      } else {
        this.header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  setupNavClickHandlers() {
    const navLinks = document.querySelectorAll(".nav a, .header-nav a, a[href^='#']");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          e.preventDefault();

          this.isClickScrolling = true;
          this.updateNav(link);

          // Scroll to target with header offset
          const headerOffset = 70;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          if (history.replaceState) {
            history.replaceState(null, "", `#${targetId}`);
          }

          // Close mobile menu if open
          this.closeMobileNav();

          // Reset click scrolling lock
          clearTimeout(this.clickScrollTimeout);
          this.clickScrollTimeout = setTimeout(() => {
            this.isClickScrolling = false;
          }, 800);

          // Fire sectionChange event
          document.dispatchEvent(
            new CustomEvent("sectionChange", { detail: { section: targetId } }),
          );
        }
      });
    });
  }

  setupHireMeButton() {
    const hireMeBtn = document.querySelector(".hire-me");
    if (hireMeBtn) {
      hireMeBtn.addEventListener("click", (e) => {
        const targetSection = document.querySelector("#contact");
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  setupNavToggler() {
    if (this.navTogglerBtn) {
      this.navTogglerBtn.addEventListener("click", () => this.toggleAside());
    }

    // Close when clicking outside mobile nav
    document.addEventListener("click", (e) => {
      const isNavOpen = document.body.classList.contains("nav-open") || (this.nav && this.nav.classList.contains("open"));
      if (!isNavOpen) return;

      const clickedInsideHeader = e.target.closest(".site-header, .aside");
      if (!clickedInsideHeader) {
        this.closeMobileNav();
      }
    });
  }

  toggleAside() {
    document.body.classList.toggle("nav-open");
    if (this.aside) this.aside.classList.toggle("open");
    if (this.navTogglerBtn) this.navTogglerBtn.classList.toggle("open");
  }

  closeMobileNav() {
    document.body.classList.remove("nav-open");
    if (this.aside) this.aside.classList.remove("open");
    if (this.navTogglerBtn) this.navTogglerBtn.classList.remove("open");
  }

  setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (this.isClickScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && sectionId !== this.currentSectionId) {
            this.currentSectionId = sectionId;
            this.setActiveNavLink(sectionId);

            document.dispatchEvent(
              new CustomEvent("sectionChange", { detail: { section: sectionId } }),
            );
          }
        }
      });
    }, observerOptions);

    this.allSection.forEach((section) => {
      observer.observe(section);
    });
  }

  setActiveNavLink(sectionId) {
    const allNavLinks = document.querySelectorAll(".nav a, .header-nav a");

    allNavLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (linkHref === `#${sectionId}` || (sectionId === "project" && linkHref === "#projects")) {
        link.classList.add("active");
      }
    });
  }

  updateNav(element) {
    const target = element.getAttribute("href")?.split("#")[1];
    if (target) {
      this.setActiveNavLink(target);
    }
  }

  // Compatibility methods for existing codebase
  showSection(element) {
    const target = element.getAttribute("href")?.split("#")[1];
    if (target) {
      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  removeBackSection() {}
  addBackSection() {}
}
