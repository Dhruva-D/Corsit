import { useEffect, useRef, useState } from 'react';
import SpaceBackground from './SpaceBackground';
import ShootingStars from './ShootingStars';
import { isLowPowerDevice, optimizedRequestAnimationFrame, addPassiveEventListener } from './utils';

const EnhancedSpaceBackground = () => {
  const canvasRef = useRef(null);
  const [isLowPower, setIsLowPower] = useState(false);
  
  useEffect(() => {
    // Check device capability first
    const lowPower = isLowPowerDevice();
    setIsLowPower(lowPower);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Handle canvas resize with improved performance
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      // Redraw on resize
      drawNebulae();
    };
    
    // Create space nebulae effect
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
    
    // Initialize and handle resize with passive event listeners for better performance
    addPassiveEventListener(window, 'resize', handleResize);
    handleResize();
    
    // Animation loop for subtle movement - optimized for device capability
    let animationFrameId;
    let lastDrawTime = 0;
    // Lower FPS for low power devices, higher for powerful devices
    const fps = lowPower ? 0.2 : 1; // 0.2 FPS = once every 5 seconds, 1 FPS = once per second
    
    const animate = (currentTime) => {
      animationFrameId = optimizedRequestAnimationFrame(animate);
      
      // Only redraw at the specified FPS
      if (currentTime - lastDrawTime > 1000 / fps) {
        drawNebulae();
        lastDrawTime = currentTime;
      }
    };
    
    animate(0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // For extremely low-power devices or mobile devices in portrait orientation
  // don't render the advanced nebulae effects
  if (isLowPower && window.innerWidth < 768) {
    return (
      <>
        <SpaceBackground />
        <ShootingStars />
      </>
    );
  }
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-[-2]"
        style={{ pointerEvents: 'none', backgroundColor: '#000000' }}
      />
      <SpaceBackground />
      <ShootingStars />
    </>
  );
};

export default EnhancedSpaceBackground; 