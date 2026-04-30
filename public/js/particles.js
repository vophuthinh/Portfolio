/**
 * Neural Network Particles Effect
 * Creates a network of connected nodes to simulate a neural network
 */

document.addEventListener("DOMContentLoaded", function () {
  // Avoid expensive canvas animation on low-power or reduced-motion contexts
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isSmallScreen = window.innerWidth < 992;
  if (prefersReducedMotion || isSmallScreen) return;

  const canvas = document.getElementById("neural-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  // Configuration
  const properties = {
    bgColor: "rgba(0, 0, 0, 0)", // Transparent, let CSS handle background
    particleColor: "rgba(236, 24, 57, 0.5)", // Skin color theme
    particleRadius: 3,
    particleCount: 60,
    lineLength: 150,
    lineWidth: 1,
    particleSpeed: 0.5,
  };

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = (Math.random() - 0.5) * properties.particleSpeed;
      this.velocityY = (Math.random() - 0.5) * properties.particleSpeed;
      this.life = Math.random() * 0.5 + 0.5; // Opacity variation
    }

    position() {
      // Bounce off edges
      if (
        (this.x + this.velocityX > width && this.velocityX > 0) ||
        (this.x + this.velocityX < 0 && this.velocityX < 0)
      ) {
        this.velocityX *= -1;
      }
      if (
        (this.y + this.velocityY > height && this.velocityY > 0) ||
        (this.y + this.velocityY < 0 && this.velocityY < 0)
      ) {
        this.velocityY *= -1;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = properties.particleColor;
      ctx.fill();
      ctx.closePath();
    }
  }

  function init() {
    resize();
    createParticles();
    loop();

    // Listen for skin color changes to update particle color
    // 1. Observer for Dark Mode (class on body)
    const observer = new MutationObserver(function (mutations) {
      updateColors();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 2. Listener for skin color stylesheet changes
    const skinLink = document.querySelector('link[href*="skins/color"]');
    if (skinLink) {
      new MutationObserver(() => {
        setTimeout(() => updateColors(), 50);
      }).observe(skinLink, { attributes: true, attributeFilter: ["href"] });
    }

    // Initial color check
    updateColors();
  }

  function updateColors() {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--skin-color")
      .trim();

    if (color) {
      properties.particleColor = color
        .replace(")", ", 0.5)")
        .replace("rgb", "rgba");
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    // Use fixed count or constrained density to avoid too many particles
    const densityFactor = 15000;
    const calculatedQuantity = (width * height) / densityFactor;
    const quantity = Math.min(Math.max(calculatedQuantity, 30), 100); // Clamp between 30 and 100

    for (let i = 0; i < quantity; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    let x1, y1, x2, y2, length, opacity;
    for (let i = 0; i < particles.length; i++) {
      // Optimization: Start j from i + 1 to avoid double checking and self-checking
      for (let j = i + 1; j < particles.length; j++) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        if (length < properties.lineLength) {
          opacity = 1 - length / properties.lineLength;
          ctx.beginPath();
          ctx.strokeStyle = properties.particleColor.replace(
            "0.5)",
            `${opacity * 0.5})`,
          );
          ctx.lineWidth = properties.lineWidth;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  function reDrawParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].position();
      particles[i].reDraw();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    reDrawParticles();
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  init();
});
