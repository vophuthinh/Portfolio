/**
 * Magnetic Buttons Effect
 * Makes buttons "stick" to the cursor with a smooth physics feel.
 */

class MagneticButtons {
    constructor() {
        // Define targets: Buttons, Nav Links, Social Icons, Toggles, Project Cards
        this.triggers = document.querySelectorAll('.btn, .btn-card, .nav li a, .social-icon a, .style-switcher-toggler, .back-to-top');
        this.init();
    }

    init() {
        this.triggers.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s linear';
            });
            el.addEventListener('mousemove', (e) => {
                if (!el.dataset.ticking) {
                    window.requestAnimationFrame(() => {
                        this.magnetize(e, el);
                        el.removeAttribute('data-ticking');
                    });
                    el.dataset.ticking = 'true';
                }
            });
            el.addEventListener('mouseleave', (e) => this.reset(e, el));
        });
    }

    magnetize(e, el) {
        const bound = el.getBoundingClientRect();

        // Calculate distance from center
        const x = e.clientX - bound.left - bound.width / 2;
        const y = e.clientY - bound.top - bound.height / 2;

        // Strength factor (lower = stiffer, higher = more movement)
        // We use different strengths for different elements if needed
        const strength = 0.4;

        // Apply movement
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }

    reset(e, el) {
        // Snap back with elastic effect
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.transform = 'translate(0px, 0px)';
    }
}

// Initialize on load
window.addEventListener('load', () => {
    new MagneticButtons();
});
