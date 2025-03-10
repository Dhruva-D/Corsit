import React, { useEffect, useRef } from 'react';

const SplineComponent = ({ windowWidth }) => {
  const splineContainerRef = useRef(null);
  
  useEffect(() => {
    // Create and configure the spline-viewer element
    const createSplineViewer = () => {
      // Remove any existing spline-viewer to prevent duplicates
      if (splineContainerRef.current) {
        const existingViewer = splineContainerRef.current.querySelector('spline-viewer');
        if (existingViewer) {
          existingViewer.remove();
        }
        
        // Create new spline-viewer with responsive settings
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.url = "https://prod.spline.design/8Q-TXZHyF66OklDE/scene.splinecode";
        
        // Apply responsive styling based on screen width
        if (windowWidth <= 768) {
          // Mobile
          splineViewer.style.width = '200%';
          splineViewer.style.height = '140%';
          splineViewer.style.marginTop = '-150px';
          splineViewer.style.marginLeft = '-500px';
        } else if (windowWidth <= 1024) {
          // Tablet
          splineViewer.style.width = '180%';
          splineViewer.style.height = '150%';
          splineViewer.style.marginTop = '-200px';
          splineViewer.style.marginLeft = '-600px';
        } else {
          // Desktop
          splineViewer.style.width = '170%';
          splineViewer.style.height = '160%';
          splineViewer.style.marginTop = '-250px';
          splineViewer.style.marginLeft = '-790px';
        }
        
        // Common styles
        splineViewer.style.display = 'block';
        splineViewer.style.position = 'relative';
        splineViewer.style.zIndex = '1';
        
        // Add to container
        splineContainerRef.current.appendChild(splineViewer);
      }
    };
    
    createSplineViewer();
    
    // Clean up function
    return () => {
      if (splineContainerRef.current) {
        const existingViewer = splineContainerRef.current.querySelector('spline-viewer');
        if (existingViewer) {
          existingViewer.remove();
        }
      }
    };
  }, [windowWidth]); // Re-run when window width changes
  
  return (
    <div ref={splineContainerRef} className="spline-container w-full h-full"></div>
  );
};

export default SplineComponent; 