import { useEffect, useState } from 'react';
import { useUIStore } from '../store/uiStore';

/**
 * useDarkMode Hook
 * Manages dark mode state with persistence and system preference detection
 */
export const useDarkMode = () => {
  const { theme, setTheme, toggleTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);

    // Check for saved preference or system preference
    if (!theme) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [setTheme, theme]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    mounted,
  };
};
