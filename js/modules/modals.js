/**
 * Modals Module
 * Unified modal controller for all modals in the application
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class ModalsController {
  constructor() {
    this.projectModal = document.getElementById("projectModal");
    this.certificateModal = document.getElementById("certificateModal");

    this.scrollLockY = 0;
    this.scrollLockCount = 0;
    this.modalTriggers = new Map();

    this.init();
  }

  init() {
    this.setupModalCloseHandlers();
    this.setupKeyboardHandlers();
    this.setupFocusTrap();
    this.setupCertificateModal();
  }

  openModal(modalEl, triggerEl = null) {
    if (!modalEl) return;

    const isAlreadyOpen =
      modalEl.classList.contains("open") || modalEl.style.display === "flex";
    if (isAlreadyOpen) return;

    this.modalTriggers.set(modalEl, triggerEl || document.activeElement);

    modalEl.style.display = "flex";
    modalEl.classList.add("open");
    this.lockBodyScroll();
    this.focusFirstElement(modalEl);
  }

  closeModal(modalEl) {
    if (!modalEl) return;

    const wasOpen =
      modalEl.classList.contains("open") || modalEl.style.display === "flex";
    if (!wasOpen) return;

    modalEl.style.display = "none";
    modalEl.classList.remove("open");
    this.unlockBodyScroll();

    const trigger = this.modalTriggers.get(modalEl);
    this.modalTriggers.delete(modalEl);
    if (
      trigger &&
      typeof trigger.focus === "function" &&
      document.contains(trigger)
    ) {
      trigger.focus();
    }
  }

  // Move focus into the modal on open (WCAG 2.4.3): first focusable child,
  // falling back to the modal container itself (requires tabindex="-1").
  focusFirstElement(modalEl) {
    const focusableElements = modalEl.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalEl.focus();
    }
  }

  lockBodyScroll() {
    this.scrollLockCount += 1;
    if (this.scrollLockCount > 1) return;

    this.scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("modal-open");
    document.body.style.top = `-${this.scrollLockY}px`;
  }

  unlockBodyScroll() {
    this.scrollLockCount = Math.max(0, this.scrollLockCount - 1);

    if (this.scrollLockCount > 0) return;

    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, this.scrollLockY);
  }

  setupModalCloseHandlers() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      // Close button clicks
      if (target.hasAttribute("data-modal-close")) {
        e.preventDefault();
        e.stopPropagation();
        const modalId = target.getAttribute("data-modal-close");
        if (modalId) {
          const modal = document.getElementById(modalId);
          if (modal) {
            this.closeModal(modal);
          }
        } else {
          const closestModal = target.closest(".modal");
          if (closestModal) {
            this.closeModal(closestModal);
          }
        }
        return;
      }

      // Click overlay to close modals
      if (target.classList.contains("modal")) {
        this.closeModal(target);
      }
    });
  }

  setupKeyboardHandlers() {
    document.addEventListener("keydown", (e) => {
      // ESC key to close modals
      if (e.key === "Escape") {
        const openModals = document.querySelectorAll(
          '.modal.open, .modal[style*="flex"]',
        );
        if (openModals.length > 0) {
          const lastModal = openModals[openModals.length - 1];
          this.closeModal(lastModal);
        }
      }
    });
  }

  setupFocusTrap() {
    if (this.projectModal) this.trapFocus(this.projectModal);
  }

  trapFocus(modal) {
    if (!modal) return;

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      // Re-query focusable elements each time (modal content may change dynamically)
      const focusableElements = modal.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Certificate Modal Setup
  setupCertificateModal() {
    const certLinks = document.querySelectorAll(".cert-link");
    if (certLinks.length === 0) return;

    let certModal = this.certificateModal;
    if (!certModal) {
      certModal = document.createElement("div");
      certModal.id = "certificateModal";
      certModal.classList.add("certificate-modal", "modal");
      certModal.setAttribute("role", "dialog");
      certModal.setAttribute("aria-modal", "true");
      certModal.setAttribute("aria-label", "Certificate viewer");
      certModal.setAttribute("tabindex", "-1");
      certModal.innerHTML =
        '<button type="button" class="close-modal" data-modal-close="certificateModal" aria-label="Close certificate viewer">&times;</button><img src="" alt="Zoomed Certificate">';
      document.body.appendChild(certModal);
      this.certificateModal = certModal;
      this.trapFocus(certModal);
    }

    const modalImg = certModal.querySelector("img");

    certLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const img = link.querySelector(".cert-preview img");
        if (modalImg && img) {
          modalImg.src = img.src;
          modalImg.alt = img.alt || "Zoomed Certificate";
        }
        this.openModal(certModal, link);
      });
    });
  }
}

// Export singleton instance
export const modalsController = new ModalsController();

// Export functions for backward compatibility
export function openModal(modalEl, triggerEl = null) {
  modalsController.openModal(modalEl, triggerEl);
}

export function closeModal(modalEl) {
  modalsController.closeModal(modalEl);
}
