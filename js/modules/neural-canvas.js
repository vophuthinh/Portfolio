export function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;

  let particles = [];
  let animId;
  let W, H;

  const CONFIG = {
    get count() { return isMobile() ? 35 : 70; },
    maxDist: 140,
    speed: 0.4,
    nodeRadius: { min: 1.5, max: 3.5 },
    lineOpacity: 0.18,
    nodeOpacity: 0.7,
    // red accent rgb
    r: 236, g: 24, b: 57,
  };

  function resize() {
    const section = canvas.parentElement;
    W = canvas.width = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: CONFIG.nodeRadius.min + Math.random() * (CONFIG.nodeRadius.max - CONFIG.nodeRadius.min),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Bounce
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      // Connect nearby
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CONFIG.r},${CONFIG.g},${CONFIG.b},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw node
      const pulseR = p.r + Math.sin(p.pulse) * 0.5;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 3);
      grd.addColorStop(0, `rgba(${CONFIG.r},${CONFIG.g},${CONFIG.b},${CONFIG.nodeOpacity})`);
      grd.addColorStop(1, `rgba(${CONFIG.r},${CONFIG.g},${CONFIG.b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Solid core
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.r},${CONFIG.g},${CONFIG.b},${CONFIG.nodeOpacity})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  // Pause when section is not visible (perf)
  const section = canvas.parentElement;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(section);

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      particles = Array.from({ length: CONFIG.count }, createParticle);
    }, 200);
  });

  init();
  draw();
}
