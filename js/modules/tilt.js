/**
 * 3D Physics Card Tilt & Dynamic Specular Sheen
 * Apple & Linear inspired 3D perspective interaction for cards.
 */

export class TiltController {
  constructor(selector = '.portfolio-item-inner, .hero-profile-frame, .ai-lab-chassis') {
    this.selector = selector;
    this.cards = [];
    this.init();
  }

  init() {
    // Respect reduced motion & touch devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    this.cards = document.querySelectorAll(this.selector);
    if (!this.cards || this.cards.length === 0) return;

    this.cards.forEach((card) => {
      this.attachTilt(card);
    });
  }

  attachTilt(card) {
    let bounds = card.getBoundingClientRect();
    let isHovered = false;

    // Create dynamic specular sheen if not already present
    let sheen = card.querySelector('.tilt-sheen');
    if (!sheen) {
      sheen = document.createElement('div');
      sheen.className = 'tilt-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      card.appendChild(sheen);
    }

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.2s ease-out';
      if (sheen) sheen.style.opacity = '1';
    };

    const onMouseMove = (e) => {
      if (!isHovered) return;

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const percentX = mouseX / bounds.width;
      const percentY = mouseY / bounds.height;

      // Max tilt angle
      const maxAngle = 7;
      const rotateX = (0.5 - percentY) * (maxAngle * 2);
      const rotateY = (percentX - 0.5) * (maxAngle * 2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (sheen) {
        sheen.style.background = `radial-gradient(circle 350px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 70%)`;
      }
    };

    const onMouseLeave = () => {
      isHovered = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (sheen) {
        sheen.style.opacity = '0';
      }
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave);
  }
}

export function initCardTilt() {
  return new TiltController();
}

/**
 * Cursor spotlight: writes --mouse-x / --mouse-y (percent) on the hovered card.
 * Delegated on the document so it works for cards rendered later.
 */
export function initCursorSpotlight(selector = '.certification-box') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  document.addEventListener(
    'mousemove',
    (e) => {
      const card = e.target.closest?.(selector);
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      card.style.setProperty('--mouse-y', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    },
    { passive: true },
  );
}
