import { useState, useEffect, useCallback } from 'react';

/**
 * useAsync Hook
 * Handles async operations with loading, error, and data states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // Use useCallback so this function can be included as a dependency
  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
};
