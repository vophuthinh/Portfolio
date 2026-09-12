/**
 * Three.js Interactive 3D Latent Space & Neural Nexus
 * High-performance WebGL 3D visualization representing AI embeddings & synaptic agent networks.
 * Spans 100% full-screen width, height & depth across all display resolutions.
 */

import * as THREE from 'three';

export class ThreeLatentSpace {
  constructor(canvasId = 'neural-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.isRunning = false;
    this.isPaused = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.particles = [];
    this.lineMesh = null;
    this.pointsMesh = null;
    this.orbitGroup = null;

    this.isMobile = window.innerWidth < 768;
    this.particleCount = this.isMobile ? 65 : 140;
    this.maxConnectDist = this.isMobile ? 42 : 56;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    const width = this.container.offsetWidth || window.innerWidth;
    const height = this.container.offsetHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    this.camera.position.z = 380;

    // Calculate initial visible frustum bounds in world coordinates
    this.updateFrustumBounds();

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Build Full-Screen Neural Constellation & Particles
    this.buildLatentNexus();

    // 4. Add Ambient Orbital Rings
    this.buildOrbitalRings();

    // 5. Event Listeners
    this.bindEvents();

    // 6. Intersection Observer for Performance (pause when out of view)
    this.setupVisibilityObserver();

    // 7. Start Render Loop
    this.isRunning = true;
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  updateFrustumBounds() {
    const vFov = (this.camera.fov * Math.PI) / 180;
    this.visibleH = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    this.visibleW = this.visibleH * this.camera.aspect;
  }

  buildLatentNexus() {
    this.nexusGroup = new THREE.Group();
    this.scene.add(this.nexusGroup);

    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    // Color palette matching brand & modern AI aesthetics
    const isDark = document.body.classList.contains('dark');
    const colorPrimary = new THREE.Color(isDark ? 0xe11d48 : 0xbe123c); // Crimson
    const colorAccent = new THREE.Color(isDark ? 0xf43f5e : 0xe11d48);  // Rose
    const colorHighlight = new THREE.Color(isDark ? 0xfb7185 : 0x9f1239); // Light rose
    const colorCyan = new THREE.Color(0x38bdf8); // Cyan agent synapse
    const colorAmber = new THREE.Color(0xf59e0b); // Gold agent node

    const denseCount = Math.floor(this.particleCount * 0.3);

    for (let i = 0; i < this.particleCount; i++) {
      let x, y, z;

      if (i < denseCount) {
        // Core Neural Nexus: Anchored cluster around center & profile card
        const phi = Math.acos(-1 + (2 * i) / denseCount);
        const theta = Math.sqrt(denseCount * Math.PI) * phi;
        const r = (this.isMobile ? 110 : 160) * (0.6 + 0.45 * Math.random());
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi) * 0.5;
      } else {
        // Full-Screen Expansive Constellation: Spans visible viewport width & height
        x = (Math.random() - 0.5) * this.visibleW * 1.1;
        y = (Math.random() - 0.5) * this.visibleH * 1.1;
        z = (Math.random() - 0.5) * 180;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Select color variant
      const rand = Math.random();
      let c = colorPrimary;
      if (rand > 0.9) c = colorCyan;
      else if (rand > 0.8) c = colorAmber;
      else if (rand > 0.5) c = colorAccent;
      else if (rand > 0.3) c = colorHighlight;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Particle physics & subtle calm pulse
      this.particles.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x, y, z,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        isDense: i < denseCount,
      });
    }

    // Points Geometry & Material
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular glowing particle texture
    const particleTexture = this.createParticleTexture();

    const pointsMaterial = new THREE.PointsMaterial({
      size: this.isMobile ? 4.5 : 6,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    this.pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    this.nexusGroup.add(this.pointsMesh);

    // Dynamic Connections Line Material - subtle & elegant
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0xe11d48 : 0x9f1239,
      transparent: true,
      opacity: isDark ? 0.12 : 0.07,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    // Create lines geometry with high-capacity connection buffer
    const maxLineSegments = this.particleCount * 8;
    const linePositions = new Float32Array(maxLineSegments * 6);
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this.lineGeometry.setDrawRange(0, 0);

    this.lineMesh = new THREE.LineSegments(this.lineGeometry, lineMaterial);
    this.nexusGroup.add(this.lineMesh);
  }

  buildOrbitalRings() {
    this.orbitGroup = new THREE.Group();
    this.scene.add(this.orbitGroup);

    const ringRadius = this.isMobile ? 170 : 230;
    const isDark = document.body.classList.contains('dark');

    // Create single subtle inclined orbital ring for clean elegance
    const ringGeom = new THREE.RingGeometry(ringRadius, ringRadius + 1.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: isDark ? 0.08 : 0.05,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2 + 0.35;
    this.orbitGroup.add(ring);
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 200, 225, 0.9)');
    grad.addColorStop(0.55, 'rgba(225, 29, 72, 0.45)');
    grad.addColorStop(1, 'rgba(225, 29, 72, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  bindEvents() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    // Watch for theme toggle
    const themeObserver = new MutationObserver(() => this.onThemeChange());
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  onMouseMove(e) {
    // Normalized device coordinates (-1 to 1)
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.offsetWidth || window.innerWidth;
    const height = this.container.offsetHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.updateFrustumBounds();
    this.renderer.setSize(width, height);
  }

  onThemeChange() {
    const isDark = document.body.classList.contains('dark');
    if (this.pointsMesh && this.pointsMesh.material) {
      this.pointsMesh.material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
    if (this.lineMesh && this.lineMesh.material) {
      this.lineMesh.material.color.setHex(isDark ? 0xe11d48 : 0x9f1239);
      this.lineMesh.material.opacity = isDark ? 0.12 : 0.07;
      this.lineMesh.material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isPaused = !entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    observer.observe(this.container);
  }

  animate() {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      // Smooth mouse lerp
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.03;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.03;

      // Gentle, serene 3D rotation & subtle parallax
      this.nexusGroup.rotation.y += 0.0006;
      this.nexusGroup.rotation.x = this.mouse.y * 0.10;
      this.nexusGroup.rotation.y += this.mouse.x * 0.002;

      if (this.orbitGroup) {
        this.orbitGroup.rotation.z += 0.0004;
        this.orbitGroup.rotation.x = this.mouse.y * 0.08;
      }

      // Update particle positions & synaptic connections
      const positions = this.pointsMesh.geometry.attributes.position.array;
      const linePositions = this.lineGeometry.attributes.position.array;
      let lineVertexIdx = 0;

      for (let i = 0; i < this.particleCount; i++) {
        const p = this.particles[i];
        p.phase += p.pulseSpeed;

        // Gentle floating breath
        const breath = Math.sin(p.phase) * (p.isDense ? 2.5 : 3.8);
        p.x = p.baseX + Math.sin(p.phase * 0.8) * breath + p.vx;
        p.y = p.baseY + Math.cos(p.phase * 0.7) * breath + p.vy;
        p.z = p.baseZ + Math.sin(p.phase * 1.1) * (p.isDense ? 2 : 3);

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;

        // Connect nearby nodes across full screen
        for (let j = i + 1; j < this.particleCount; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = p.z - p2.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < this.maxConnectDist * this.maxConnectDist) {
            linePositions[lineVertexIdx++] = p.x;
            linePositions[lineVertexIdx++] = p.y;
            linePositions[lineVertexIdx++] = p.z;
            linePositions[lineVertexIdx++] = p2.x;
            linePositions[lineVertexIdx++] = p2.y;
            linePositions[lineVertexIdx++] = p2.z;
          }
        }
      }

      this.pointsMesh.geometry.attributes.position.needsUpdate = true;
      this.lineGeometry.setDrawRange(0, lineVertexIdx / 3);
      this.lineGeometry.attributes.position.needsUpdate = true;

      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.animate);
  }

  destroy() {
    this.isRunning = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export function initThreeLatentSpace() {
  return new ThreeLatentSpace('neural-canvas');
}
