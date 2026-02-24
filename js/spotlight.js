/**
 * Spotlight Effect for Cards
 * Tracks mouse position to create a flashlight/spotlight reveal on card borders/backgrounds.
 */

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".interest-box");

    let ticking = false;

    document.addEventListener("mousemove", (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    card.style.setProperty("--mouse-x", `${x}px`);
                    card.style.setProperty("--mouse-y", `${y}px`);
                });
                ticking = false;
            });
            ticking = true;
        }
    });
});
