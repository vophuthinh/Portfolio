/**
 * Contact Cards Module
 * Keeps touch interactions stable on mobile while preserving glow/active states.
 */

export class ContactCardsController {
  constructor() {
    this.cards = Array.from(
      document.querySelectorAll(".contact .contact-info-item"),
    );
    this.isTouchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    if (!this.cards.length || !this.isTouchDevice) return;
    this.initTouchInteractions();
  }

  initTouchInteractions() {
    this.cards.forEach((card) => {
      card.addEventListener(
        "touchstart",
        () => {
          this.setActiveCard(card);
        },
        { passive: true },
      );

      card.addEventListener("pointerdown", (event) => {
        if (event.pointerType && event.pointerType !== "mouse") {
          this.setActiveCard(card);
        }
      });

      card.addEventListener("focusin", () => {
        this.setActiveCard(card);
      });
    });
  }

  setActiveCard(activeCard) {
    this.cards.forEach((card) => {
      card.classList.toggle("is-touch-active", card === activeCard);
    });
  }
}
