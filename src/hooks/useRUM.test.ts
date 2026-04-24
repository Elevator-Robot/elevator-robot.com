import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRUM } from './useRUM';

// Mock aws-rum-web
vi.mock('aws-rum-web', () => {
  const mockRecordEvent = vi.fn();
  const mockRecordError = vi.fn();
  
  class MockAwsRum {
    recordEvent = mockRecordEvent;
    recordError = mockRecordError;
    
    constructor(
      public applicationId: string,
      public applicationVersion: string,
      public region: string,
      public config: any
    ) {}
  }
  
  return {
    AwsRum: MockAwsRum
  };
});

describe('useRUM', () => {
  const originalEnv = import.meta.env;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console methods
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize RUM with environment variables', () => {
    // Set up environment variables
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENDPOINT = 'https://test-endpoint.amazonaws.com';
    import.meta.env.VITE_RUM_REGION = 'us-east-1';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
    expect(console.info).toHaveBeenCalledWith('AWS RUM initialized successfully');
  });

  it('should skip initialization when RUM is disabled', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENABLED = 'false';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
    expect(console.info).toHaveBeenCalledWith('AWS RUM is disabled via environment variable');
  });

  it('should skip initialization when application ID is missing', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = '';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
    expect(console.info).toHaveBeenCalledWith('AWS RUM configuration incomplete - skipping initialization');
  });

  it('should skip initialization when identity pool ID is missing', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = '';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
    expect(console.info).toHaveBeenCalledWith('AWS RUM configuration incomplete - skipping initialization');
  });

  it('should handle initialization errors gracefully', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    // The hook should not throw even if initialization fails
    expect(() => {
      renderHook(() => useRUM());
    }).not.toThrow();
  });

  it('should provide recordEvent method that works when RUM is initialized', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    // Call recordEvent
    result.current.recordEvent('test_event', { key: 'value' });

    // Verify it doesn't throw
    expect(result.current.recordEvent).toBeDefined();
  });

  it('should provide recordError method that works when RUM is initialized', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    // Call recordError
    const testError = new Error('Test error');
    result.current.recordError(testError);

    // Verify it doesn't throw
    expect(result.current.recordError).toBeDefined();
  });

  it('should silently skip recordEvent when RUM is not initialized', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = '';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = '';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    // Should not throw when RUM is not initialized
    expect(() => {
      result.current.recordEvent('test_event', { key: 'value' });
    }).not.toThrow();
  });

  it('should silently skip recordError when RUM is not initialized', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = '';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = '';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    // Should not throw when RUM is not initialized
    expect(() => {
      const testError = new Error('Test error');
      result.current.recordError(testError);
    }).not.toThrow();
  });

  it('should use default endpoint when not provided', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_ENDPOINT = '';
    import.meta.env.VITE_RUM_REGION = 'us-east-1';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
  });

  it('should use default region when not provided', () => {
    import.meta.env.VITE_RUM_APPLICATION_ID = 'test-app-id';
    import.meta.env.VITE_RUM_IDENTITY_POOL_ID = 'us-east-1:test-pool-id';
    import.meta.env.VITE_RUM_REGION = '';
    import.meta.env.VITE_RUM_ENABLED = 'true';

    const { result } = renderHook(() => useRUM());

    expect(result.current).toHaveProperty('recordEvent');
    expect(result.current).toHaveProperty('recordError');
  });
});
