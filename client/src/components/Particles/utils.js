/**
 * Checks if the browser supports WebGL rendering
 * @returns {boolean} - Whether WebGL is supported
 */
export const isWebGLSupported = () => {
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

/**
 * Checks if the device is likely to be low-powered
 * @returns {boolean} - Whether the device is likely a low-power device
 */
export const isLowPowerDevice = () => {
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Check for low memory (if available)
  const hasLowMemory = 
    navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
    
  // Check for low number of logical processors
  const hasLowCPU = 
    navigator.hardwareConcurrency !== undefined && 
    navigator.hardwareConcurrency < 4;
    
  // Consider it low power if it's mobile OR has low memory OR has few CPU cores
  return isMobile || hasLowMemory || hasLowCPU;
};

/**
 * Gets appropriate particle count based on device capabilities
 * @returns {number} - Recommended particle count
 */
export const getOptimalParticleCount = () => {
  if (!isWebGLSupported()) {
    return 50; // Lowest setting for non-WebGL devices
  }
  
  if (isLowPowerDevice()) {
    return 80; // Low setting for mobile/low-power devices
  }
  
  // For desktop/high-power devices
  return 160;
};

/**
 * Adds passive event listeners where supported
 * @param {Element} element - DOM element to attach listener to
 * @param {string} eventName - Event name (e.g., 'scroll')
 * @param {Function} handler - Event handler function
 */
export const addPassiveEventListener = (element, eventName, handler) => {
  let options = false;
  
  try {
    options = {
      get passive() {
        return true;
      }
    };
    window.addEventListener('test', null, options);
  } catch (err) {
    /* Ignore */
  }
  
  element.addEventListener(eventName, handler, options);
};

/**
 * Optimizes animation frames for performance
 * @param {Function} callback - Animation callback function
 * @returns {number} - Animation frame ID
 */
export const optimizedRequestAnimationFrame = (callback) => {
  // For low-power devices, we might want to limit frame rate
  if (isLowPowerDevice()) {
    let lastCallTime = 0;
    const targetFPS = 30; // Lower FPS for low-power devices
    const interval = 1000 / targetFPS;
    
    return requestAnimationFrame((timestamp) => {
      if (timestamp - lastCallTime >= interval) {
        lastCallTime = timestamp;
        callback(timestamp);
      } else {
        optimizedRequestAnimationFrame(callback);
      }
    });
  }
  
  // For high-power devices, use standard requestAnimationFrame
  return requestAnimationFrame(callback);
}; 