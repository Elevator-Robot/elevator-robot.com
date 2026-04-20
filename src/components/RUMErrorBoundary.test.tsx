import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RUMErrorBoundary } from './RUMErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('RUMErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when no error occurs', () => {
    render(
      <RUMErrorBoundary>
        <div>Test content</div>
      </RUMErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render default fallback UI when error occurs', () => {
    render(
      <RUMErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RUMErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText("We've been notified and are working on a fix.")).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('should render custom fallback UI when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <RUMErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </RUMErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  it('should call recordError when error occurs', () => {
    const recordError = vi.fn();

    render(
      <RUMErrorBoundary recordError={recordError}>
        <ThrowError shouldThrow={true} />
      </RUMErrorBoundary>
    );

    expect(recordError).toHaveBeenCalledWith(expect.any(Error));
    expect(recordError).toHaveBeenCalledTimes(1);
  });

  it('should handle recordError failures gracefully', () => {
    const recordError = vi.fn(() => {
      throw new Error('RUM recording failed');
    });

    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <RUMErrorBoundary recordError={recordError}>
        <ThrowError shouldThrow={true} />
      </RUMErrorBoundary>
    );

    expect(consoleWarn).toHaveBeenCalledWith('Failed to record error to RUM:', expect.any(Error));
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('should not call recordError when no error occurs', () => {
    const recordError = vi.fn();

    render(
      <RUMErrorBoundary recordError={recordError}>
        <ThrowError shouldThrow={false} />
      </RUMErrorBoundary>
    );

    expect(recordError).not.toHaveBeenCalled();
  });

  it('should work without recordError prop', () => {
    render(
      <RUMErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RUMErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });
});
