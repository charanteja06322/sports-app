/**
 * Accessibility Utilities
 */

/**
 * Check if element is visible to screen readers
 */
export const isAccessible = (element) => {
  return (
    element.offsetParent !== null &&
    window.getComputedStyle(element).visibility !== 'hidden' &&
    window.getComputedStyle(element).display !== 'none'
  );
};

/**
 * Generate unique ID for accessibility
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Focus management
 */
export const focusElement = (element) => {
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

/**
 * Manage focus trap (for modals)
 */
export const createFocusTrap = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeydown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeydown);

  return () => {
    element.removeEventListener('keydown', handleKeydown);
  };
};

/**
 * Announce message to screen readers
 */
export const announce = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Create accessible button element
 */
export const createAccessibleButton = (text, onClick, options = {}) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.onClick = onClick;
  button.setAttribute('aria-label', options.ariaLabel || text);
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');

  if (options.disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }

  return button;
};

/**
 * Create accessible link
 */
export const createAccessibleLink = (text, href, options = {}) => {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  link.setAttribute('aria-label', options.ariaLabel || text);

  if (options.external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${text} (opens in new window)`);
  }

  return link;
};

/**
 * Skip to main content link
 */
export const createSkipLink = () => {
  const link = document.createElement('a');
  link.href = '#main-content';
  link.textContent = 'Skip to main content';
  link.className = 'sr-only focus:not-sr-only';
  return link;
};

/**
 * Check color contrast ratio
 */
export const getContrastRatio = (foreground, background) => {
  const getLuminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standards
 */
export const meetsWCAG = (contrast, level = 'AA') => {
  const standards = {
    'AA': { normalText: 4.5, largeText: 3 },
    'AAA': { normalText: 7, largeText: 4.5 },
  };

  return contrast >= standards[level].normalText;
};

/**
 * Generate ARIA live region
 */
export const createLiveRegion = (id, priority = 'polite') => {
  const region = document.createElement('div');
  region.id = id;
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
};

/**
 * Update live region content
 */
export const updateLiveRegion = (regionId, message) => {
  const region = document.getElementById(regionId);
  if (region) {
    region.textContent = message;
  }
};

/**
 * Handle keyboard shortcuts
 */
export const createKeyboardShortcut = (key, modifiers = [], callback) => {
  const handleKeydown = (e) => {
    if (e.key === key) {
      const hasCtrl = modifiers.includes('ctrl') && e.ctrlKey;
      const hasShift = modifiers.includes('shift') && e.shiftKey;
      const hasAlt = modifiers.includes('alt') && e.altKey;

      if ((modifiers.includes('ctrl') && hasCtrl) ||
          (modifiers.includes('shift') && hasShift) ||
          (modifiers.includes('alt') && hasAlt) ||
          modifiers.length === 0) {
        e.preventDefault();
        callback();
      }
    }
  };

  document.addEventListener('keydown', handleKeydown);

  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };
};
