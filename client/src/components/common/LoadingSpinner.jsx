import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', variant = 'primary' }) => {
  // Size configurations
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  // Color variants
  const colorClasses = {
    primary: 'border-[#ed5a2d]',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Spinning circle loader */}
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-600`}>
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-transparent ${colorClasses[variant]} border-t-2`}></div>
        </div>
        {/* Pulse effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full ${colorClasses[variant].replace('border-', 'bg-')} opacity-20 animate-ping`}></div>
      </div>
      
      {/* Loading text with typing effect */}
      {text && (
        <span className={`${textSizes[size]} text-gray-300 animate-pulse font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Button loading component with different states
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  loadingText = 'Processing...', 
  className = '', 
  size = 'md',
  variant = 'primary',
  ...props 
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center font-semibold text-center transition-all duration-300 
    transform active:scale-95 cursor-pointer rounded-lg shadow-md overflow-hidden
    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: 'bg-[#ed5a2d] hover:bg-[#d54a1d] text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Background wave animation when loading */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      )}
      
      {/* Content */}
      <span className={`relative z-10 transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" text={loadingText} variant="white" />
        </div>
      )}
    </button>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ 
  show = false, 
  text = 'Processing your request...', 
  backdrop = true 
}) => {
  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-black/60 backdrop-blur-sm' : ''}`}>
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700 max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="xl" text={text} />
          
          {/* Progress dots animation */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#ed5a2d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
