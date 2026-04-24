import { useEffect, useRef, useCallback } from 'react';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';

interface UseRUMReturn {
  recordEvent: (eventType: string, data?: Record<string, any>) => void;
  recordError: (error: Error) => void;
}

export const useRUM = (): UseRUMReturn => {
  const rumClientRef = useRef<AwsRum | null>(null);
  const initializationAttemptedRef = useRef(false);

  useEffect(() => {
    // Only attempt initialization once
    if (initializationAttemptedRef.current) {
      return;
    }
    initializationAttemptedRef.current = true;

    try {
      // Get configuration from environment variables
      const applicationId = import.meta.env.VITE_RUM_APPLICATION_ID;
      const identityPoolId = import.meta.env.VITE_RUM_IDENTITY_POOL_ID;
      const endpoint = import.meta.env.VITE_RUM_ENDPOINT || 'https://dataplane.rum.us-east-1.amazonaws.com';
      const region = import.meta.env.VITE_RUM_REGION || 'us-east-1';
      const enabled = import.meta.env.VITE_RUM_ENABLED !== 'false';

      // Skip initialization if RUM is disabled or required config is missing
      if (!enabled) {
        console.info('AWS RUM is disabled via environment variable');
        return;
      }

      if (!applicationId || !identityPoolId) {
        console.info('AWS RUM configuration incomplete - skipping initialization');
        return;
      }

      const config: AwsRumConfig = {
        sessionSampleRate: 1,
        identityPoolId,
        endpoint,
        telemetries: ['performance', 'errors', 'http'],
        allowCookies: true,
        enableXRay: true
      };

      const APPLICATION_VERSION = '1.0.0';

      rumClientRef.current = new AwsRum(
        applicationId,
        APPLICATION_VERSION,
        region,
        config
      );

      console.info('AWS RUM initialized successfully');
    } catch (error) {
      console.warn('AWS RUM initialization failed:', error);
      // Gracefully handle initialization failure - app continues to work
      rumClientRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      // AWS RUM doesn't provide explicit cleanup method
      // The client will be garbage collected
      rumClientRef.current = null;
    };
  }, []);

  const recordEvent = useCallback((eventType: string, data?: Record<string, any>) => {
    if (!rumClientRef.current) {
      // Silently skip if RUM is not initialized
      return;
    }

    try {
      rumClientRef.current.recordEvent(eventType, data || {});
    } catch (error) {
      console.warn('Failed to record RUM event:', error);
    }
  }, []);

  const recordError = useCallback((error: Error) => {
    if (!rumClientRef.current) {
      // Silently skip if RUM is not initialized
      return;
    }

    try {
      rumClientRef.current.recordError(error);
    } catch (recordError) {
      console.warn('Failed to record RUM error:', recordError);
    }
  }, []);

  return {
    recordEvent,
    recordError
  };
};
