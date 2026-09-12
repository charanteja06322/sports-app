import React from 'react';
import { generateId } from '../../utils/accessibility';

/**
 * FormField Component
 * Wrapper for accessible form controls with label and error handling
 */
export const FormField = React.forwardRef(({
  label,
  error,
  hint,
  required = false,
  children,
  className = '',
  ...props
}, ref) => {
  const fieldId = props.id || generateId('field');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {React.cloneElement(children, {
        id: fieldId,
        ref,
        'aria-invalid': !!error,
        'aria-describedby': error || hint ? `${fieldId}-help` : undefined,
      })}

      {(error || hint) && (
        <div
          id={`${fieldId}-help`}
          className={`text-sm ${
            error
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          role={error ? 'alert' : 'note'}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
