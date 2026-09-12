/**
 * Performance Optimization Utilities
 */

/**
 * Lazy load component
 */
export const lazyLoadComponent = (importStatement) => {
  return React.lazy(() => importStatement);
};

/**
 * Image lazy loading helper
 */
export const createImageSrcSet = (src, sizes = [320, 640, 1280]) => {
  return sizes.map((size) => `${src}?w=${size} ${size}w`).join(', ');
};

/**
 * Measure performance of a function
 */
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * Memoize function results
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Request animation frame wrapper
 */
export const onNextFrame = (callback) => {
  return requestAnimationFrame(callback);
};

/**
 * Intersection Observer for lazy loading
 */
export const observeElement = (element, callback, options = {}) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    ...options,
  });

  observer.observe(element);
  return observer;
};

/**
 * Virtual scroll helper
 */
export const calculateVirtualRange = (
  scrollPosition,
  itemHeight,
  containerHeight,
  totalItems
) => {
  const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight));
  const endIndex = Math.min(
    totalItems,
    Math.ceil((scrollPosition + containerHeight) / itemHeight)
  );
  return { startIndex, endIndex };
};

/**
 * Batch state updates
 */
export const batchUpdates = (updates) => {
  if (typeof unstable_batchedUpdates !== 'undefined') {
    unstable_batchedUpdates(() => {
      updates();
    });
  } else {
    updates();
  }
};

/**
 * Compress image before upload
 */
export const compressImage = async (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };
    };
    reader.onerror = reject;
  });
};
