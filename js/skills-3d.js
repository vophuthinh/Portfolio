/**
 * 3D Skills Sphere with Neural Network Connections
 * Features: Mouse interaction (rotate), Neural connections (lines), Auto-rotation
 */

class SkillsSphere3D {
    constructor(canvasId, skills) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.skills = skills;

        this.nodes = [];
        this.radius = 200; // Radius of the sphere
        this.focalLength = 400; // Camera distance
        this.baseColor = '#ec1839';

        // State
        this.rotationSpeed = 0.002; // Auto rotation speed
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // Hover state
        this.hoverX = 0;
        this.hoverY = 0;
        this.activeNode = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Settings color
        this.updateColor();

        // 1. Observer for Dark Mode (class on body)
        const observer = new MutationObserver(() => this.updateColor());
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // 2. Listener for Color Switcher (clicking color spans)
        // Since style-switcher toggles stylesheets, we can listen for clicks on the switcher container
        // passing a small delay to allow CSS to apply.
        const switcher = document.querySelector('.style-switcher');
        if (switcher) {
            switcher.addEventListener('click', () => {
                setTimeout(() => this.updateColor(), 50);
            });
        }

        // 3. Backup: Interval check removed for cleaner event-driven approach

        // Generate points on sphere (Fibonacci Sphere algorithm)
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < this.skills.length; i++) {
            const y = 1 - (i / (this.skills.length - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            this.nodes.push({
                x: x * this.radius,
                y: y * this.radius,
                z: z * this.radius,
                text: this.skills[i]
            });
        }

        // Mouse Events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());

        // Touch Events for Mobile
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => e.preventDefault() });
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        window.addEventListener('touchend', () => this.onMouseUp());

        // Animation Loop
        this.animate();
    }

    updateColor() {
        const temp = document.createElement('div');
        temp.style.color = 'var(--skin-color)';
        document.body.appendChild(temp);
        // Wait a tick for styles to compute if needed, but synchronous is usually fine here
        const color = getComputedStyle(temp).color;
        this.baseColor = color || '#ec1839';
        document.body.removeChild(temp);
    }

    checkColorChange() {
        const temp = document.createElement('div');
        temp.style.color = 'var(--skin-color)';
        document.body.appendChild(temp);
        const color = getComputedStyle(temp).color;
        document.body.removeChild(temp);

        if (color && color !== this.baseColor) {
            this.baseColor = color;
        }
    }

    resize() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = Math.min(container.clientWidth, 600);
            this.cx = this.canvas.width / 2;
            this.cy = this.canvas.height / 2;
        }
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        if (e.preventDefault) e.preventDefault();
    }

    onMouseMove(e) {
        // Track hover position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        this.hoverX = e.clientX - rect.left;
        this.hoverY = e.clientY - rect.top;

        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        // Rotate logic
        const rotationY = deltaX * 0.005;
        const rotationX = -deltaY * 0.005;

        this.nodes.forEach(node => {
            this.rotate(node, rotationX, rotationY);
        });
    }

    onMouseUp() {
        this.isDragging = false;
    }

    rotate(node, angleX, angleY) {
        // Rotate around X axis
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y1 = node.y * cosX - node.z * sinX;
        const z1 = node.z * cosX + node.y * sinX;

        // Rotate around Y axis
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x2 = node.x * cosY - z1 * sinY;
        const z2 = z1 * cosY + node.x * sinY;

        node.x = x2;
        node.y = y1;
        node.z = z2;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Auto rotation
        if (!this.isDragging && !this.activeNode) { // Pause rotation when hovering active node? Optional
            // Let's keep auto-rotation but maybe slower? No, keeps it simple.
            this.nodes.forEach(node => {
                this.rotate(node, 0, this.rotationSpeed);
            });
        }

        // Depth sort
        this.nodes.sort((a, b) => b.z - a.z);

        // Project
        const projectedNodes = this.nodes.map(node => {
            const scale = this.focalLength / (this.focalLength + node.z);
            return {
                x: node.x * scale + this.cx,
                y: node.y * scale + this.cy,
                scale: scale,
                text: node.text,
                original: node
            };
        });

        // Hit Testing to find Active Node
        this.activeNode = null;
        if (!this.isDragging) {
            for (let i = projectedNodes.length - 1; i >= 0; i--) {
                const node = projectedNodes[i];
                const dist = Math.sqrt((this.hoverX - node.x) ** 2 + (this.hoverY - node.y) ** 2);
                if (dist < 25 * node.scale && node.scale > 0.6) { // Hitbox detection
                    this.activeNode = node;
                    break;
                }
            }
        }

        // Determine Highlight Color based on Theme
        const isDark = document.body.classList.contains('dark');
        const highlightColor = isDark ? '#ffffff' : '#000000'; // White for Dark, Black for Light

        // Draw Lines
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < projectedNodes.length; i++) {
            const nodeA = projectedNodes[i];

            for (let j = i + 1; j < projectedNodes.length; j++) {
                const nodeB = projectedNodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    let opacity = 1 - (dist / 120);
                    let color = this.baseColor;
                    let width = 0.5;

                    // Highlight connections if connected to Active Node
                    if (this.activeNode && (nodeA === this.activeNode || nodeB === this.activeNode)) {
                        opacity = 1;
                        color = highlightColor;
                        width = 1.0;
                    }

                    this.ctx.globalAlpha = opacity * 0.6 * Math.min(nodeA.scale, nodeB.scale);
                    this.ctx.strokeStyle = color;
                    this.ctx.lineWidth = width;
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodeA.x, nodeA.y);
                    this.ctx.lineTo(nodeB.x, nodeB.y);
                    this.ctx.stroke();
                }
            }

            // Draw Node
            const isActive = (nodeA === this.activeNode);

            this.ctx.globalAlpha = isActive ? 1 : nodeA.scale;
            this.ctx.fillStyle = isActive ? highlightColor : this.baseColor;

            // Dot
            const dotSize = isActive ? 5 * nodeA.scale : 3 * nodeA.scale;
            this.ctx.beginPath();
            this.ctx.arc(nodeA.x, nodeA.y, dotSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Text
            const fontScale = isActive ? 1.5 : 1.0;
            this.ctx.font = `600 ${14 * nodeA.scale * fontScale}px Poppins`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(nodeA.text, nodeA.x, nodeA.y - (isActive ? 15 : 12) * nodeA.scale);
        }

        requestAnimationFrame(() => this.animate());
    }
}
