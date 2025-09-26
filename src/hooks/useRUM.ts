import { useEffect } from 'react';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';

export const useRUM = () => {
  useEffect(() => {
    try {
      const config: AwsRumConfig = {
        sessionSampleRate: 1,
        identityPoolId: '', // Will be populated after deployment
        endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
        telemetries: ["performance", "errors", "http"],
        allowCookies: true,
        enableXRay: true
      };

      const APPLICATION_ID = 'elevator-robot-monitor';
      const APPLICATION_VERSION = '1.0.0';
      const APPLICATION_REGION = 'us-east-1';

      new AwsRum(
        APPLICATION_ID,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config
      );
    } catch (error) {
      console.warn('RUM initialization failed:', error);
    }
  }, []);
};
