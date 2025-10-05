// Utility function for smooth scroll to top
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior
  });
};

// Hook for handling route changes with scroll to top
export const useScrollToTop = () => {
  const handleNavigation = (callback) => {
    return (event) => {
      if (callback) callback(event);
      scrollToTop();
    };
  };

  return { handleNavigation, scrollToTop };
};