/* 
 * Test file to verify loading animations are working correctly.
 * Run this in the browser console on any page to see the animations.
 */

// Test LoadingSpinner component
function testLoadingAnimations() {
  console.log('🧪 Testing loading animations...');
  
  // Test shimmer animation
  const shimmerTest = document.createElement('div');
  shimmerTest.className = 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent w-32 h-8 bg-gray-700';
  shimmerTest.style.position = 'fixed';
  shimmerTest.style.top = '20px';
  shimmerTest.style.left = '20px';
  shimmerTest.style.zIndex = '9999';
  document.body.appendChild(shimmerTest);
  
  // Test pulse animation
  const pulseTest = document.createElement('div');
  pulseTest.className = 'animate-loading-pulse w-32 h-8 bg-[#ed5a2d] rounded-lg';
  pulseTest.style.position = 'fixed';
  pulseTest.style.top = '40px';
  pulseTest.style.left = '20px';
  pulseTest.style.zIndex = '9999';
  document.body.appendChild(pulseTest);
  
  // Test bouncing dots
  const dotsContainer = document.createElement('div');
  dotsContainer.style.position = 'fixed';
  dotsContainer.style.top = '70px';
  dotsContainer.style.left = '20px';
  dotsContainer.style.zIndex = '9999';
  dotsContainer.style.display = 'flex';
  dotsContainer.style.gap = '8px';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce';
    dot.style.animationDelay = `${i * 150}ms`;
    dotsContainer.appendChild(dot);
  }
  document.body.appendChild(dotsContainer);
  
  console.log('✅ Animation tests added to page. Check top-left corner.');
  
  // Clean up after 5 seconds
  setTimeout(() => {
    shimmerTest.remove();
    pulseTest.remove();
    dotsContainer.remove();
    console.log('🧹 Test animations cleaned up.');
  }, 5000);
}

// Test form focus animations
function testFormAnimations() {
  console.log('🎯 Testing form animations...');
  
  const testInput = document.createElement('input');
  testInput.className = 'input-focus-animation w-64 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600';
  testInput.placeholder = 'Test input - try focusing!';
  testInput.style.position = 'fixed';
  testInput.style.top = '100px';
  testInput.style.left = '20px';
  testInput.style.zIndex = '9999';
  
  document.body.appendChild(testInput);
  
  setTimeout(() => {
    testInput.remove();
    console.log('🧹 Form animation test cleaned up.');
  }, 5000);
}

// Test button hover animations
function testButtonAnimations() {
  console.log('🖱️ Testing button animations...');
  
  const testButton = document.createElement('button');
  testButton.className = 'button-hover-effect bg-[#ed5a2d] text-white px-6 py-3 rounded-lg font-medium';
  testButton.textContent = 'Hover me!';
  testButton.style.position = 'fixed';
  testButton.style.top = '140px';
  testButton.style.left = '20px';
  testButton.style.zIndex = '9999';
  
  document.body.appendChild(testButton);
  
  setTimeout(() => {
    testButton.remove();
    console.log('🧹 Button animation test cleaned up.');
  }, 5000);
}

// Run all tests
console.log('🚀 Starting loading animation tests...');
testLoadingAnimations();
testFormAnimations();
testButtonAnimations();

export {
  testLoadingAnimations,
  testFormAnimations,
  testButtonAnimations
};
