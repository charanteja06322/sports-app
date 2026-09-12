/**
 * LoadingSpinner Component
 * Accessible loading indicator with ARIA labels
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label = 'Loading...',
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const variants = {
    primary: 'border-gray-200 dark:border-slate-700 border-t-primary-600 dark:border-t-primary-400',
    secondary: 'border-gray-200 dark:border-slate-700 border-t-secondary-600 dark:border-t-secondary-400',
    white: 'border-gray-600 border-t-white',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={`
          rounded-full animate-spin
          ${sizes[size] || sizes.md}
          ${variants[variant] || variants.primary}
        `}
      />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        {label}
      </p>
    </div>
  );
};

export default LoadingSpinner;
