export function initScrollReveal() {
  // This portfolio is a fixed-position SPA — sections activate via class toggle,
  // not traditional page scroll. Reveal approach:
  // • When a section becomes active, stagger-reveal all elements inside it.
  // • Within a section, observe scroll to reveal below-fold elements progressively.

  const ITEMS = [
    { selector: '.section-title', delay: 0 },
    { selector: '.about-text', delay: 80 },
    { selector: '.about-stats .stat-item', delay: 60 },
    { selector: '.about-github', delay: 140 },
    { selector: '.personal-info', delay: 40 },
    { selector: '.skills-text', delay: 80 },
    { selector: '.project-item', delay: 100 },
    { selector: '.certification-box', delay: 80 },
    { selector: '.contact-info-item', delay: 70 },
    { selector: '.contact-form', delay: 160 },
    { selector: '.timeline-item', delay: 80 },
  ];

  function addRevealClass(el) {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left')) {
      el.classList.add('reveal');
    }
  }

  // Apply reveal class to all matching elements once
  ITEMS.forEach(({ selector }) => {
    document.querySelectorAll(selector).forEach(addRevealClass);
  });

  function revealSection(sectionEl) {
    if (!sectionEl) return;
    let globalDelay = 0;
    ITEMS.forEach(({ selector, delay }) => {
      const els = sectionEl.querySelectorAll(selector);
      els.forEach((el, i) => {
        const d = globalDelay + delay * i;
        setTimeout(() => {
          el.classList.add('visible');
        }, Math.min(d, 600));
      });
      if (els.length) globalDelay += delay * Math.min(els.length, 3);
    });
  }

  // Reveal active section on load
  const activeSection = document.querySelector('.section.active');
  if (activeSection) {
    // Brief delay so CSS is parsed
    setTimeout(() => revealSection(activeSection), 150);
  }

  // Reveal on SPA navigation
  document.addEventListener('sectionChange', (e) => {
    const sectionId = e.detail?.section;
    const sectionEl = sectionId ? document.getElementById(sectionId) : document.querySelector('.section.active');
    setTimeout(() => revealSection(sectionEl), 80);
  });
}
