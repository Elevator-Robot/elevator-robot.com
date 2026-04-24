/**
 * Test script for structured logging
 * Run with: npx tsx amplify/monitoring/test-logging.ts
 */

import { StructuredLogger, generateTraceId } from '../functions/send-email/logger';

async function testStructuredLogging() {
  console.log('=== Testing Structured Logging ===\n');

  // Test 1: Basic logging
  console.log('Test 1: Basic logging with all levels');
  const traceId = generateTraceId();
  const logger = new StructuredLogger('test-component', traceId);

  logger.info('This is an info message', { userId: '123', action: 'test' });
  logger.warn('This is a warning message', { threshold: 100, current: 150 });
  logger.debug('This is a debug message', { state: 'processing', step: 1 });

  console.log('\n');

  // Test 2: Error logging
  console.log('Test 2: Error logging with stack trace');
  try {
    throw new Error('Test error for logging');
  } catch (error) {
    logger.error('An error occurred', error as Error, { context: 'test scenario' });
  }

  console.log('\n');

  // Test 3: Child logger
  console.log('Test 3: Child logger with same trace ID');
  const childLogger = logger.child('child-component');
  childLogger.info('Child logger message', { childData: 'test' });

  console.log('\n');

  // Test 4: Measure operation
  console.log('Test 4: Measuring operation duration');
  await logger.measure(
    'Test operation',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 'success';
    },
    { operationType: 'async' }
  );

  console.log('\n');

  // Test 5: Measure operation with error
  console.log('Test 5: Measuring operation with error');
  try {
    await logger.measure(
      'Failing operation',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        throw new Error('Operation failed');
      },
      { operationType: 'async-error' }
    );
  } catch (error) {
    console.log('(Error caught as expected)');
  }

  console.log('\n');

  // Test 6: Multiple trace IDs
  console.log('Test 6: Multiple requests with different trace IDs');
  const request1Logger = new StructuredLogger('request-handler', generateTraceId());
  const request2Logger = new StructuredLogger('request-handler', generateTraceId());

  request1Logger.info('Request 1 started', { requestId: 'req-1' });
  request2Logger.info('Request 2 started', { requestId: 'req-2' });
  request1Logger.info('Request 1 completed', { requestId: 'req-1', status: 'success' });
  request2Logger.info('Request 2 completed', { requestId: 'req-2', status: 'success' });

  console.log('\n=== All tests completed ===\n');

  // Show example CloudWatch Insights query
  console.log('Example CloudWatch Insights query to find these logs:');
  console.log(`
fields @timestamp, level, component, message, metadata
| filter traceId = "${traceId}"
| sort @timestamp asc
  `.trim());
}

// Run tests
testStructuredLogging().catch(console.error);
