/**
 * Space Background - Vanilla JS Version
 * 
 * This is a standalone version of the space background effect that can be used
 * without React. It creates a captivating space-themed background with stars,
 * parallax effects, and shooting stars.
 * 
 * @author CORSIT
 * @version 1.0.0
 */

import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";

// Utility functions
const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

const isLowPowerDevice = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  const hasLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;
  return isMobile || hasLowMemory || hasLowCPU;
};

const getOptimalParticleCount = () => {
  if (!isWebGLSupported()) return 50;
  if (isLowPowerDevice()) return 80;
  return 160;
};

/**
 * Creates a space background in the specified container
 * @param {string|HTMLElement} container - Container element or selector
 * @param {Object} options - Custom options to override defaults
 * @returns {Promise<Object>} - Returns the particles container instance
 */
export async function createSpaceBackground(container, options = {}) {
  // Determine optimal settings based on device
  const lowPower = isLowPowerDevice();
  const particleCount = getOptimalParticleCount();
  const fpsLimit = lowPower ? 30 : 60;
  
  // Default configuration
  const defaultOptions = {
    fullScreen: {
      enable: false,
      zIndex: -1,
    },
    background: {
      color: {
        value: "#000000", // Pure black background
      },
    },
    fpsLimit,
    particles: {
      groups: {
        smallStars: {
          number: {
            value: particleCount * 0.7,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 1.5 },
          },
          color: {
            value: ["#ffffff", "#f0f8ff", "#e6e6fa"],
          },
        },
        mediumStars: {
          number: {
            value: particleCount * 0.3,
          },
          opacity: {
            value: { min: 0.2, max: 1 },
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.2,
              sync: false,
            },
          },
          size: {
            value: { min: 2, max: 4 },
          },
          color: {
            value: ["#ffffff", "#f8f8ff", "#fffafa", "#ffffe0"],
          },
        },
      },
      number: {
        value: particleCount,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ["#ffffff", "#f0f8ff", "#e6e6fa", "#b0c4de"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 0.5, max: 3 },
        random: true,
      },
      move: {
        enable: true,
        speed: { min: 0.05, max: 0.25 }, // Reduced speed for more subtle movement
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      // Enhanced twinkle effect
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
          color: {
            value: ["#ffffff", "#ffffd0", "#ffff80"],
          }
        },
        lines: {
          enable: false,
        }
      },
      zIndex: {
        value: { min: -100, max: 100 },
        opacityRate: 0.5,
        sizeRate: 1,
        velocityRate: 1,
      },
    },
    emitters: lowPower ? [] : [
      {
        direction: "top-left",
        rate: {
          delay: 12, // Less frequent
          quantity: 1,
        },
        particles: {
          move: {
            direction: "bottom-right",
            enable: true,
            speed: { min: 5, max: 10 }, // Reduced speed
            straight: true,
            outModes: {
              default: "out",
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0,
              sync: false,
              destroy: "min",
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          life: {
            duration: {
              sync: true,
              value: 2, // Longer duration for slower stars
            },
          },
          shape: {
            type: "line",
          },
          length: {
            value: { min: 10, max: 30 },
          },
        },
        position: {
          x: 100,
          y: 0,
        },
      },
      {
        direction: "top-right",
        rate: {
          delay: 20, // Less frequent
          quantity: 1,
        },
        particles: {
          move: {
            direction: "bottom-left",
            enable: true,
            speed: { min: 5, max: 10 }, // Reduced speed
            straight: true,
            outModes: {
              default: "out",
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0,
              sync: false,
              destroy: "min",
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          life: {
            duration: {
              sync: true,
              value: 2, // Longer duration for slower stars
            },
          },
          shape: {
            type: "line",
          },
          length: {
            value: { min: 10, max: 30 },
          },
        },
        position: {
          x: 0,
          y: 0,
        },
      },
    ],
    detectRetina: true,
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 80,
            },
          },
        },
      },
    ],
  };
  
  // Merge user options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Initialize particles
  await loadSlim(tsParticles);
  
  // Handle container input type
  let containerElement = container;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
    if (!containerElement) {
      throw new Error(`Container element "${container}" not found`);
    }
  }
  
  // Create a fallback if WebGL isn't supported
  if (!isWebGLSupported()) {
    containerElement.style.background = 'black';
    containerElement.style.backgroundImage = 'radial-gradient(white 1px, transparent 0)';
    containerElement.style.backgroundSize = '50px 50px';
    return null;
  }
  
  // Load the particles
  return tsParticles.load('space-particles', mergedOptions);
}

/**
 * Creates shooting stars effect
 * @param {string|HTMLElement} container - Container element or selector
 * @returns {Object} - Controller for the shooting stars
 */
export function createShootingStars(container) {
  // Handle container input type
  let containerElement = container;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
    if (!containerElement) {
      throw new Error(`Container element "${container}" not found`);
    }
  }
  
  // Check device capability
  const lowPower = isLowPowerDevice();
  if (lowPower && window.innerWidth < 768) {
    return { destroy: () => {} };
  }
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  
  // Append canvas to container
  containerElement.style.position = 'relative';
  containerElement.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Handle canvas resize
  const handleResize = () => {
    canvas.width = containerElement.offsetWidth * dpr;
    canvas.height = containerElement.offsetHeight * dpr;
    canvas.style.width = `${containerElement.offsetWidth}px`;
    canvas.style.height = `${containerElement.offsetHeight}px`;
    ctx.scale(dpr, dpr);
  };
  
  // Shooting star class
  class ShootingStar {
    constructor() {
      this.reset();
    }
    
    reset() {
      const startFromTop = Math.random() > 0.5;
      
      if (startFromTop) {
        this.x = Math.random() * canvas.width / dpr;
        this.y = 0;
        this.vx = (2.5 - Math.random() * 5) * 0.6; // Reduced speed by 40%
        this.vy = (2.5 + Math.random() * 5) * 0.6; // Reduced speed by 40%
      } else {
        this.x = canvas.width / dpr;
        this.y = Math.random() * (canvas.height / dpr / 3);
        this.vx = -(2.5 + Math.random() * 5) * 0.6; // Reduced speed by 40%
        this.vy = (2.5 + Math.random() * 5) * 0.6; // Reduced speed by 40%
      }
      
      this.length = 50 + Math.random() * 70;
      this.opacity = 0;
      this.fadingIn = true;
      this.fadeInSpeed = 0.02 + Math.random() * 0.02; // Slower fade in
      this.fadeOutSpeed = 0.008 + Math.random() * 0.012; // Slower fade out
      this.width = 1 + Math.random() * 2;
      this.active = true;
      this.trail = [];
      this.trailLength = Math.floor(15 + Math.random() * 25); // Longer trail for slower stars
      
      this.waitTime = lowPower ? 
        (10000 + Math.random() * 15000) : 
        (5000 + Math.random() * 15000); // 5 to 20 seconds for normal devices
      this.startTime = Date.now();
    }
    
    update() {
      if (!this.active && Date.now() - this.startTime < this.waitTime) {
        return;
      }
      
      if (!this.active) {
        this.active = true;
        this.opacity = 0;
        this.fadingIn = true;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
      
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
      
      if (this.fadingIn) {
        this.opacity += this.fadeInSpeed;
        if (this.opacity >= 1) {
          this.opacity = 1;
          this.fadingIn = false;
        }
      } else {
        this.opacity -= this.fadeOutSpeed;
      }
      
      if (
        this.x < 0 || 
        this.x > canvas.width / dpr || 
        this.y > canvas.height / dpr || 
        this.opacity <= 0
      ) {
        this.active = false;
        this.reset();
      }
    }
    
    draw() {
      if (!this.active || this.trail.length < 2) return;
      
      for (let i = 0; i < this.trail.length - 1; i++) {
        const point = this.trail[i];
        const nextPoint = this.trail[i + 1];
        const opacity = point.opacity * (i / this.trail.length);
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = this.width * (i / this.trail.length);
        ctx.stroke();
      }
      
      if (this.trail.length > 0) {
        const head = this.trail[this.trail.length - 1];
        ctx.beginPath();
        ctx.arc(head.x, head.y, this.width, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        // Add a subtle glow effect for the star head
        const glow = this.width * 3;
        const gradient = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, glow
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(head.x, head.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
  }
  
  // Create shooting stars
  const starCount = lowPower ? 1 : 2; // Reduced from 3 to 2 for better performance
  const shootingStars = Array(starCount).fill().map(() => new ShootingStar());
  
  let animationFrameId;
  
  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    shootingStars.forEach(star => {
      star.update();
      star.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  };
  
  // Initialize and start animation
  window.addEventListener('resize', handleResize);
  handleResize();
  animate();
  
  // Return controller
  return {
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      containerElement.removeChild(canvas);
    }
  };
}

/**
 * Creates a nebula effect in the background
 * @param {string|HTMLElement} container - Container element or selector
 * @returns {Object} - Controller for the nebula effect
 */
export function createNebulaEffect(container) {
  // Handle container input type
  let containerElement = container;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
    if (!containerElement) {
      throw new Error(`Container element "${container}" not found`);
    }
  }
  
  // Check device capability
  const lowPower = isLowPowerDevice();
  if (lowPower && window.innerWidth < 768) {
    return { destroy: () => {} };
  }
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-2';
  canvas.style.backgroundColor = '#000000';
  
  // Append canvas to container
  containerElement.style.position = 'relative';
  containerElement.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Handle canvas resize
  const handleResize = () => {
    canvas.width = containerElement.offsetWidth * dpr;
    canvas.height = containerElement.offsetHeight * dpr;
    canvas.style.width = `${containerElement.offsetWidth}px`;
    canvas.style.height = `${containerElement.offsetHeight}px`;
    ctx.scale(dpr, dpr);
    
    drawNebulae();
  };
  
  // Draw nebulae
  const drawNebulae = () => {
    // Use pure black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw distant galaxies and nebulae - fewer for low power devices
    const numberOfNebulae = lowPower ? 1 : (3 + Math.floor(Math.random() * 2));
    
    for (let i = 0; i < numberOfNebulae; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 50 + Math.random() * 100;
      
      // Choose colors appropriate for space
      const colors = [
        [32, 0, 64, 0.08],   // Purple (reduced opacity)
        [0, 32, 64, 0.08],   // Deep blue (reduced opacity)
        [64, 0, 32, 0.08],   // Burgundy (reduced opacity)
        [0, 64, 64, 0.08],   // Teal (reduced opacity)
        [32, 32, 64, 0.08],  // Blue-purple (reduced opacity)
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create radial gradient for nebula
      const gradient = ctx.createRadialGradient(
        x / dpr, 
        y / dpr, 
        0, 
        x / dpr, 
        y / dpr, 
        radius
      );
      
      gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] * 2})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x / dpr, y / dpr, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Animation variables
  let animationFrameId;
  let lastDrawTime = 0;
  // Lower FPS for low power devices, higher for powerful devices
  const fps = lowPower ? 0.2 : 1; // 0.2 FPS = once every 5 seconds, 1 FPS = once per second
  
  // Animation loop
  const animate = (currentTime) => {
    animationFrameId = requestAnimationFrame(animate);
    
    // Only redraw at the specified FPS
    if (currentTime - lastDrawTime > 1000 / fps) {
      drawNebulae();
      lastDrawTime = currentTime;
    }
  };
  
  // Initialize and start animation
  window.addEventListener('resize', handleResize);
  handleResize();
  animate(0);
  
  // Return controller
  return {
    destroy: () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      containerElement.removeChild(canvas);
    }
  };
}

/**
 * Complete Space Background
 * Creates a complete space background with particles, nebulae, and shooting stars
 * @param {string|HTMLElement} container - Container element or selector
 * @param {Object} options - Custom options to override defaults
 * @returns {Object} - Controller for the space background
 */
export async function createCompleteSpaceBackground(container, options = {}) {
  const nebulae = createNebulaEffect(container);
  const particles = await createSpaceBackground(container, options);
  const shootingStars = createShootingStars(container);
  
  return {
    particles,
    shootingStars,
    nebulae,
    destroy: () => {
      if (particles) particles.destroy();
      shootingStars.destroy();
      nebulae.destroy();
    }
  };
}

// Usage example:
// createCompleteSpaceBackground('#background-container'); 