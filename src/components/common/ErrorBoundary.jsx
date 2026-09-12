import React from 'react';
import { Alert } from '../ui/Alert';

/**
 * ErrorBoundary Component
 * Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert
              variant="error"
              title="Oops! Something went wrong"
              closeable
              onClose={this.resetError}
            >
              <p className="mb-4">
                We're sorry, but something unexpected happened. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-3 bg-gray-100 dark:bg-slate-800 rounded text-xs font-mono whitespace-pre-wrap break-words">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Error Details
                  </summary>
                  <div>
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      {this.state.error?.toString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {this.state.errorInfo?.componentStack}
                    </p>
                  </div>
                </details>
              )}
              <button
                onClick={this.resetError}
                className="mt-4 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
