import React from 'react';

/**
 * Input Component
 * Reusable input field with various types and states
 */
export const Input = React.forwardRef(({
  type = 'text',
  size = 'md',
  error = false,
  disabled = false,
  placeholder = '',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-600';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const borderColor = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-slate-600';

  const computedClassName = `
    ${baseStyles}
    ${sizes[size] || sizes.md}
    ${borderColor}
    ${className}
  `.trim();

  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      className={computedClassName}
      {...props}
    />
  );
});

Input.displayName = 'Input';

/**
 * Textarea Component
 * Multi-line input field
 */
export const Textarea = React.forwardRef(({
  size = 'md',
  error = false,
  disabled = false,
  placeholder = '',
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-600';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const borderColor = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-slate-600';

  const computedClassName = `
    ${baseStyles}
    ${sizes[size] || sizes.md}
    ${borderColor}
    ${className}
  `.trim();

  return (
    <textarea
      ref={ref}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      className={computedClassName}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

/**
 * Select Component
 * Dropdown select field
 */
export const Select = React.forwardRef(({
  size = 'md',
  error = false,
  disabled = false,
  options = [],
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-600 appearance-none pr-10 bg-no-repeat bg-right';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const borderColor = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-slate-600';

  const computedClassName = `
    ${baseStyles}
    ${sizes[size] || sizes.md}
    ${borderColor}
    ${className}
  `.trim();

  return (
    <select ref={ref} disabled={disabled} className={computedClassName} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';
