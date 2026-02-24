/**
 * 3D Tilt Effect for Cards
 * Adds a premium 3D parallax tilt interaction to elements.
 */

class VanillaTilt {
    constructor(element) {
        this.element = element;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = this.element.offsetLeft;
        this.top = this.element.offsetTop;
        this.transitionTimeout = null;

        // Settings
        this.max = 15; // Max tilt angle
        this.speed = 400; // Transition speed
        this.glare = true; // Add light glare?

        // Init properties
        this.element.style.willChange = "transform";
        this.element.style.transformStyle = "preserve-3d";

        if (this.glare) {
            this.addGlare();
        }

        // Bind events
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    addGlare() {
        this.glareElement = document.createElement("div");
        this.glareElement.classList.add("js-tilt-glare");
        this.glareElement.style.position = "absolute";
        this.glareElement.style.top = "0";
        this.glareElement.style.left = "0";
        this.glareElement.style.width = "100%";
        this.glareElement.style.height = "100%";
        this.glareElement.style.overflow = "hidden";
        this.glareElement.style.pointerEvents = "none";
        this.glareElement.style.borderRadius = "inherit"; // Match card radius

        this.glareInner = document.createElement("div");
        this.glareInner.style.position = "absolute";
        this.glareInner.style.top = "50%";
        this.glareInner.style.left = "50%";
        this.glareInner.style.pointerEvents = "none";
        this.glareInner.style.backgroundImage = "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 100%)";
        this.glareInner.style.width = `${this.element.offsetWidth * 2}px`;
        this.glareInner.style.height = `${this.element.offsetWidth * 2}px`;
        this.glareInner.style.transform = "rotate(180deg) translate(-50%, -50%)";
        this.glareInner.style.transformOrigin = "0% 0%";
        this.glareInner.style.opacity = "0";

        this.glareElement.appendChild(this.glareInner);
        this.element.appendChild(this.glareElement);
    }

    onMouseEnter() {
        this.updateRect();
        this.element.style.transition = `none`;
    }

    onMouseMove(event) {
        // Calculate tilt
        const x = (event.clientX - this.left) / this.width;
        const y = (event.clientY - this.top) / this.height;

        const tiltX = (this.max / 2 - x * this.max).toFixed(2);
        const tiltY = (y * this.max - this.max / 2).toFixed(2);

        // Calculate Glare
        const angle = Math.atan2(event.clientX - (this.left + this.width / 2), -(event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
        const opacity = ((event.clientY - this.top) / this.height) * 0.12; // Max 0.12 thay vì 0.4

        this.element.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;

        if (this.glare) {
            this.glareInner.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
            this.glareInner.style.opacity = opacity;
        }
    }

    onMouseLeave() {
        this.element.style.transition = `transform ${this.speed}ms cubic-bezier(.03,.98,.52,.99)`;
        this.element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

        if (this.glare) {
            this.glareInner.style.opacity = 0;
        }
    }

    updateRect() {
        const rect = this.element.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.left = rect.left;
        this.top = rect.top;
    }
}

// Auto-init on targets
window.addEventListener('load', () => {
    // Target: Service Items, Project Cards, Contact Info (Interest Box REMOVED to prevent washout)
    const targets = document.querySelectorAll('.service-item-inner, .project-card, .contact-info-item');
    targets.forEach(el => new VanillaTilt(el));
});
