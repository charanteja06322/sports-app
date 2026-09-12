/**
 * Common Helper Functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Capitalize string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string to specified length
 */
export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
};

/**
 * Get password strength score
 */
export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  const score = Object.values(validation).filter(Boolean).length;
  return {
    score,
    strength:
      score <= 1
        ? 'weak'
        : score <= 3
          ? 'fair'
          : score <= 4
            ? 'good'
            : 'strong',
  };
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects
 */
export const mergeObjects = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (typeof source[key] === 'object') {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeObjects(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeObjects(target, ...sources);
};

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

/**
 * Parse query string to object
 */
export const queryStringToObject = (queryString) => {
  const obj = {};
  const params = new URLSearchParams(queryString);
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};

/**
 * Get distinct values from array
 */
export const getDistinct = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

/**
 * Group array by key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, obj) => {
    const group = obj[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(obj);
    return acc;
  }, {});
};

/**
 * Sort array of objects
 */
export const sortByKey = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

/**
 * Delay execution (for testing/demos)
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
