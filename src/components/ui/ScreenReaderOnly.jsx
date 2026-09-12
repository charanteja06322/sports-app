import React from 'react';

/**
 * ScreenReaderOnly Component
 * Content visible only to screen readers
 */
export const ScreenReaderOnly = ({ children, className = '' }) => {
  return (
    <div
      className={`sr-only ${className}`}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {children}
    </div>
  );
};

/**
 * SkipToContent Component
 * Allows keyboard users to skip navigation
 */
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="absolute top-0 left-0 z-50 p-3 bg-primary-600 text-white font-semibold -translate-y-full focus:translate-y-0 transition-transform"
    >
      Skip to main content
    </a>
  );
};

export default ScreenReaderOnly;
