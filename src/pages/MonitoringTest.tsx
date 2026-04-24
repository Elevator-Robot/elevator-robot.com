import { useState } from 'react';
import { useRUM } from '../hooks/useRUM';

/**
 * Monitoring Test Page
 * 
 * This page provides interactive tests for the monitoring system:
 * - RUM event tracking
 * - Error logging
 * - Custom metrics
 * - Form submission tracking
 * 
 * Access at: /monitoring-test (development only)
 */
export default function MonitoringTest() {
  const { recordEvent, recordError } = useRUM();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Test 1: Record custom event
  const testCustomEvent = () => {
    try {
      recordEvent('test_custom_event', {
        testType: 'manual',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
      addResult('✓ Custom event recorded successfully');
    } catch (error) {
      addResult(`✗ Custom event failed: ${error}`);
    }
  };

  // Test 2: Record navigation event
  const testNavigationEvent = () => {
    try {
      recordEvent('test_navigation', {
        from: 'monitoring-test',
        to: 'test-destination',
        timestamp: Date.now(),
      });
      addResult('✓ Navigation event recorded successfully');
    } catch (error) {
      addResult(`✗ Navigation event failed: ${error}`);
    }
  };

  // Test 3: Record form submission event
  const testFormSubmissionEvent = () => {
    try {
      recordEvent('test_form_submission', {
        formType: 'test',
        success: true,
        timestamp: Date.now(),
      });
      addResult('✓ Form submission event recorded successfully');
    } catch (error) {
      addResult(`✗ Form submission event failed: ${error}`);
    }
  };

  // Test 4: Record single error
  const testSingleError = () => {
    try {
      const testError = new Error('Test error for monitoring validation');
      testError.name = 'TestError';
      recordError(testError);
      setErrorCount(prev => prev + 1);
      addResult('✓ Single error recorded successfully');
    } catch (error) {
      addResult(`✗ Error recording failed: ${error}`);
    }
  };

  // Test 5: Record multiple errors (to trigger alarm)
  const testMultipleErrors = () => {
    try {
      const errorTypes = [
        'ValidationError',
        'NetworkError',
        'TimeoutError',
        'AuthenticationError',
        'DataError',
      ];

      for (let i = 0; i < 15; i++) {
        const errorType = errorTypes[i % errorTypes.length];
        const testError = new Error(`Test ${errorType} #${i + 1}`);
        testError.name = errorType;
        recordError(testError);
        setErrorCount(prev => prev + 1);
      }

      addResult('✓ Multiple errors recorded (15 errors) - should trigger alarm if threshold is met');
    } catch (error) {
      addResult(`✗ Multiple error recording failed: ${error}`);
    }
  };

  // Test 6: Simulate page view
  const testPageView = () => {
    try {
      recordEvent('pageView', {
        page: '/monitoring-test',
        title: 'Monitoring Test Page',
        timestamp: Date.now(),
      });
      addResult('✓ Page view event recorded successfully');
    } catch (error) {
      addResult(`✗ Page view event failed: ${error}`);
    }
  };

  // Test 7: Simulate user engagement
  const testUserEngagement = () => {
    try {
      recordEvent('user_engagement', {
        action: 'button_click',
        component: 'monitoring_test',
        timestamp: Date.now(),
      });
      addResult('✓ User engagement event recorded successfully');
    } catch (error) {
      addResult(`✗ User engagement event failed: ${error}`);
    }
  };

  // Test 8: Check RUM configuration
  const testRUMConfiguration = () => {
    const rumAppId = import.meta.env.VITE_RUM_APPLICATION_ID;
    const rumPoolId = import.meta.env.VITE_RUM_IDENTITY_POOL_ID;
    const rumEndpoint = import.meta.env.VITE_RUM_ENDPOINT;
    const rumRegion = import.meta.env.VITE_RUM_REGION;
    const rumEnabled = import.meta.env.VITE_RUM_ENABLED;

    if (rumAppId && rumPoolId) {
      addResult('✓ RUM is configured');
      addResult(`  Application ID: ${rumAppId.substring(0, 20)}...`);
      addResult(`  Identity Pool: ${rumPoolId.substring(0, 30)}...`);
      addResult(`  Endpoint: ${rumEndpoint || 'default'}`);
      addResult(`  Region: ${rumRegion || 'us-east-1'}`);
      addResult(`  Enabled: ${rumEnabled !== 'false' ? 'yes' : 'no'}`);
    } else {
      addResult('✗ RUM is not configured');
      addResult('  Missing: VITE_RUM_APPLICATION_ID or VITE_RUM_IDENTITY_POOL_ID');
      addResult('  See: .env.rum.template for setup instructions');
    }
  };

  // Clear results
  const clearResults = () => {
    setTestResults([]);
    setErrorCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Monitoring System Test Page
          </h1>
          <p className="text-gray-600 mb-8">
            Test AWS RUM integration, CloudWatch metrics, and alarm triggers
          </p>

          {/* Warning Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Development Only:</strong> This page is for testing monitoring systems.
                  Do not use in production. Some tests may trigger CloudWatch alarms.
                </p>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testRUMConfiguration}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Check RUM Configuration
              </button>

              <button
                onClick={testCustomEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test Custom Event
              </button>

              <button
                onClick={testNavigationEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test Navigation Event
              </button>

              <button
                onClick={testFormSubmissionEvent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test Form Submission
              </button>

              <button
                onClick={testPageView}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test Page View
              </button>

              <button
                onClick={testUserEngagement}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Test User Engagement
              </button>

              <button
                onClick={testSingleError}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Test Single Error
              </button>

              <button
                onClick={testMultipleErrors}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Test Multiple Errors (Trigger Alarm)
              </button>
            </div>

            <button
              onClick={clearResults}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Results
            </button>
          </div>

          {/* Error Counter */}
          <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Total Errors Recorded:</span>
              <span className="text-2xl font-bold text-red-600">{errorCount}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Alarm threshold: 10 errors per minute (50 errors over 5 minutes)
            </p>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            
            {testResults.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No test results yet. Click a test button above to begin.
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="font-mono text-sm space-y-1">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`${
                        result.includes('✓')
                          ? 'text-green-400'
                          : result.includes('✗')
                          ? 'text-red-400'
                          : 'text-gray-300'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Testing Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>First, check RUM configuration to verify setup</li>
              <li>Test individual events to verify RUM is capturing data</li>
              <li>Check browser DevTools Console for RUM initialization messages</li>
              <li>Use "Test Multiple Errors" to trigger the JavaScript error alarm</li>
              <li>Wait 10-15 minutes for CloudWatch to process metrics and trigger alarms</li>
              <li>Check AWS Console → CloudWatch → Alarms for alarm state changes</li>
              <li>Verify SNS email notifications are received</li>
            </ol>
          </div>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=elevator-robot-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  CloudWatch Dashboard
                </a>
              </li>
              <li>
                <a
                  href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#alarmsV2:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  CloudWatch Alarms
                </a>
              </li>
              <li>
                <a
                  href="https://console.aws.amazon.com/cloudwatch/rum/home?region=us-east-1#/application/elevator-robot-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  AWS RUM Console
                </a>
              </li>
              <li>
                <a
                  href="https://console.aws.amazon.com/sns/v3/home?region=us-east-1#/topics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  SNS Topics
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
