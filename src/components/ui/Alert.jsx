import React from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

/**
 * Alert Component
 * Notification/alert message
 */
export const Alert = React.forwardRef(({
  variant = 'info',
  title,
  children,
  closeable = false,
  onClose,
  className = '',
  icon = null,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const variants = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  };

  const iconMap = {
    info: <FiInfo className="w-5 h-5" />,
    success: <FiCheckCircle className="w-5 h-5" />,
    warning: <FiAlertCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const baseStyles = 'flex items-start gap-3 p-4 rounded-lg border';
  const computedClassName = `
    ${baseStyles}
    ${variants[variant] || variants.info}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={computedClassName} {...props}>
      <div className="flex-shrink-0 pt-0.5">
        {icon || iconMap[variant]}
      </div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
      {closeable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';
