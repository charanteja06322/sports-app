import React from 'react';

/**
 * Skeleton Component
 * Loading placeholder
 */
export const Skeleton = React.forwardRef(({
  width = '100%',
  height = '1rem',
  className = '',
  circle = false,
  ...props
}, ref) => {
  const baseStyles = 'bg-gray-200 dark:bg-slate-700 animate-pulse';
  const borderRadius = circle ? 'rounded-full' : 'rounded';
  
  const computedClassName = `
    ${baseStyles}
    ${borderRadius}
    ${className}
  `.trim();

  return (
    <div
      ref={ref}
      className={computedClassName}
      style={{ width, height }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * SkeletonCard Component
 * Skeleton loader for card component
 */
export const SkeletonCard = React.forwardRef(({
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`p-6 rounded-lg ${className}`.trim()} {...props}>
      <Skeleton height="1.5rem" width="60%" className="mb-4" />
      <Skeleton height="1rem" width="100%" className="mb-3" />
      <Skeleton height="1rem" width="80%" className="mb-4" />
      <div className="flex gap-2 mt-4">
        <Skeleton height="2.5rem" width="48%" />
        <Skeleton height="2.5rem" width="48%" />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

/**
 * SkeletonText Component
 * Skeleton loader for text lines
 */
export const SkeletonText = React.forwardRef(({
  lines = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '80%' : '100%'}
          className={i < lines - 1 ? 'mb-2' : ''}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';
