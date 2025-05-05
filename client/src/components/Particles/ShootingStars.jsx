import { useEffect, useRef, useState } from 'react';
import { isLowPowerDevice, optimizedRequestAnimationFrame, addPassiveEventListener } from './utils';

const ShootingStars = () => {
  const canvasRef = useRef(null);
  const [isLowPower, setIsLowPower] = useState(false);
  
  useEffect(() => {
    // Check device capability
    const lowPower = isLowPowerDevice();
    setIsLowPower(lowPower);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Handle canvas resize
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    // Shooting star class
    class ShootingStar {
      constructor() {
        this.reset();
      }
      
      reset() {
        // Start from a random position at top edge or right edge
        const startFromTop = Math.random() > 0.5;
        
        if (startFromTop) {
          this.x = Math.random() * canvas.width / dpr;
          this.y = 0;
          this.vx = (2.5 - Math.random() * 5) * 0.6; // Reduced speed by 40%
          this.vy = (2.5 + Math.random() * 5) * 0.6; // Reduced speed by 40%
        } else {
          this.x = canvas.width / dpr;
          this.y = Math.random() * (canvas.height / dpr / 3); // Upper third of screen
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
        
        // Set next appearance time - longer wait times for more dramatic effect
        this.waitTime = isLowPower ? 
          (10000 + Math.random() * 15000) : // 10 to 25 seconds for low power
          (5000 + Math.random() * 15000);   // 5 to 20 seconds for normal devices
        this.startTime = Date.now();
      }
      
      update() {
        // Check if it's time to appear
        if (!this.active && Date.now() - this.startTime < this.waitTime) {
          return;
        }
        
        // Activate when wait time is over
        if (!this.active) {
          this.active = true;
          this.opacity = 0;
          this.fadingIn = true;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
        
        // Limit trail length
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }
        
        // Update opacity
        if (this.fadingIn) {
          this.opacity += this.fadeInSpeed;
          if (this.opacity >= 1) {
            this.opacity = 1;
            this.fadingIn = false;
          }
        } else {
          this.opacity -= this.fadeOutSpeed;
        }
        
        // Reset when it goes off screen or fades out
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
        
        // Draw trail
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
        
        // Draw shooting star head (brightest part)
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
    
    // Create shooting stars - fewer for low-power devices
    const starCount = isLowPower ? 1 : 2; // Reduced from 3 to 2 for better performance
    const shootingStars = Array(starCount).fill().map(() => new ShootingStar());
    
    let animationFrameId;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw shooting stars
      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });
      
      animationFrameId = optimizedRequestAnimationFrame(animate);
    };
    
    // Initialize and start animation
    addPassiveEventListener(window, 'resize', handleResize);
    handleResize();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // For extremely low power devices, don't even render the canvas
  if (isLowPower && window.innerWidth < 768) {
    return null;
  }
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-[-1]"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ShootingStars; 