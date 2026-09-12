import React from 'react';

/**
 * Card Component
 * Flexible container for grouping related content
 */
export const Card = React.forwardRef(({
  children,
  className = '',
  hover = false,
  ...props
}, ref) => {
  const baseStyles = 'bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-card transition-all duration-200';
  
  const hoverStyles = hover ? 'hover:shadow-card-hover hover:border-primary-300 dark:hover:border-primary-500' : '';
  
  const computedClassName = `${baseStyles} ${hoverStyles} ${className}`.trim();

  return (
    <div ref={ref} className={computedClassName} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader Component
 */
export const CardHeader = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-gray-200 dark:border-slate-700 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

/**
 * CardBody Component
 */
export const CardBody = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

/**
 * CardFooter Component
 */
export const CardFooter = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-700 rounded-b-lg ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
