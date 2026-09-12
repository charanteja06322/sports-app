import { useState, useEffect } from 'react';

/**
 * useWindowSize Hook
 * Tracks window size for responsive behavior
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * useIsMobile Hook
 * Determines if the viewport is mobile-sized
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};
