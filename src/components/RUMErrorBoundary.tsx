import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  recordError?: (error: Error) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that integrates with AWS RUM for error tracking.
 * 
 * Usage:
 * ```tsx
 * const { recordError } = useRUM();
 * 
 * <RUMErrorBoundary recordError={recordError}>
 *   <App />
 * </RUMErrorBoundary>
 * ```
 */
export class RUMErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('React Error Boundary caught an error:', error, errorInfo);

    // Record error to AWS RUM if recordError function is provided
    if (this.props.recordError) {
      try {
        this.props.recordError(error);
      } catch (rumError) {
        console.warn('Failed to record error to RUM:', rumError);
      }
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            We've been notified and are working on a fix.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              borderRadius: '50px',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
