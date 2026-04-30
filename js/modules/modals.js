import { Utils } from "../utils.js";

/**
 * Modals Module
 * Unified modal controller for all modals in the application
 */

export class ModalsController {
  constructor() {
    this.projectModal = document.getElementById("projectModal");
    this.imageViewerModal = document.getElementById("imageViewerModal");
    this.certificateModal = document.getElementById("certificateModal");

    this.currentImageList = [];
    this.currentImageIndex = 0;

    this.init();
  }

  init() {
    this.setupModalCloseHandlers();
    this.setupKeyboardHandlers();
    this.setupFocusTrap();
    this.setupCertificateModal();
  }

  getLogger() {
    return Utils.getLogger();
  }

  openModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "flex";
    modalEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "none";
    modalEl.classList.remove("open");
    document.body.style.overflow = "";
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

      // Image viewer navigation
      if (target.hasAttribute("data-image-nav")) {
        e.preventDefault();
        e.stopPropagation();
        const direction = target.getAttribute("data-image-nav");
        this.changeImageViewerImage(direction);
        return;
      }

      // Click overlay to close modals
      if (target.classList.contains("modal")) {
        this.closeModal(target);
        return;
      }

      // Close image viewer on background click
      if (target.classList.contains("image-viewer-content")) {
        this.closeImageViewer();
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
          return;
        }
      }

      // Arrow keys for image viewer navigation
      if (
        this.imageViewerModal &&
        this.imageViewerModal.style.display === "flex"
      ) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.changeImageViewerImage(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          this.changeImageViewerImage(1);
        }
      }
    });
  }

  setupFocusTrap() {
    const trapFocus = (modal) => {
      if (!modal) return;

      modal.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;

        // Re-query focusable elements each time (modal content may change dynamically)
        const focusableElements = modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
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
    };

    if (this.projectModal) trapFocus(this.projectModal);
    if (this.imageViewerModal) trapFocus(this.imageViewerModal);
  }

  // Image Viewer Methods
  openImageViewer(images, index) {
    const logger = this.getLogger();

    if (!images || images.length === 0) {
      logger.warn("No images provided to image viewer");
      return;
    }
    if (!this.imageViewerModal) {
      logger.warn("imageViewerModal element not found");
      return;
    }

    this.currentImageList = images;
    this.currentImageIndex = index >= 0 && index < images.length ? index : 0;

    this.updateImageViewerDisplay();
    this.openModal(this.imageViewerModal);
  }

  closeImageViewer() {
    this.closeModal(this.imageViewerModal);
  }

  changeImageViewerImage(direction) {
    if (this.currentImageList.length === 0) return;

    this.currentImageIndex += parseInt(direction);
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.currentImageList.length - 1;
    } else if (this.currentImageIndex >= this.currentImageList.length) {
      this.currentImageIndex = 0;
    }

    this.updateImageViewerDisplay();
  }

  updateImageViewerDisplay() {
    const viewerImage = document.getElementById("viewerImage");
    const viewerBackdrop = document.getElementById("viewerBackdrop");
    const viewerCaption = document.getElementById("viewerCaption");

    const item = this.currentImageList[this.currentImageIndex];
    const src = typeof item === "string" ? item : item.src;
    const caption = typeof item === "string" ? "" : item.caption;

    if (viewerImage) {
      viewerImage.src = src;
      if (viewerBackdrop) {
        viewerBackdrop.src = src;
      }
      viewerImage.alt = caption || `Image ${this.currentImageIndex + 1}`;

      viewerImage.classList.remove("zoomed");

      viewerImage.onclick = function (e) {
        e.stopPropagation();
        this.classList.toggle("zoomed");
      };
    }

    if (viewerCaption) {
      if (caption) {
        viewerCaption.textContent = caption;
        viewerCaption.style.display = "block";
      } else {
        viewerCaption.style.display = "none";
      }
    }
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
      certModal.innerHTML =
        '<span class="close" data-modal-close="certificateModal" aria-label="Close certificate viewer">&times;</span><img src="" alt="Zoomed Certificate">';
      document.body.appendChild(certModal);
      this.certificateModal = certModal;
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
        this.openModal(certModal);
      });
    });
  }
}

// Export singleton instance
export const modalsController = new ModalsController();

// Export functions for backward compatibility
export function openModal(modalEl) {
  modalsController.openModal(modalEl);
}

export function closeModal(modalEl) {
  modalsController.closeModal(modalEl);
}
