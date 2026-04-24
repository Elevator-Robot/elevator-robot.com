# Structured Logging and CloudWatch Insights

This directory contains the structured logging implementation and CloudWatch Insights queries for the Elevator Robot website monitoring system.

## Overview

The structured logging system provides:
- Consistent JSON log format across all Lambda functions
- Trace IDs for request correlation
- Automatic log retention configuration (Lambda: 30 days, API Gateway: 14 days)
- Pre-built CloudWatch Insights queries for common analysis patterns

## Structured Log Format

All logs follow this JSON structure:

```json
{
  "timestamp": "2026-04-19T22:00:00.000Z",
  "level": "INFO",
  "component": "contact-form-handler",
  "message": "Contact form submission successful",
  "traceId": "1713564000000-abc123def456",
  "metadata": {
    "messageId": "01234567-89ab-cdef-0123-456789abcdef",
    "duration": 450,
    "ipAddress": "192.0.2.1"
  }
}
```

### Log Levels

- **INFO**: Normal operational messages (submissions, successful operations)
- **WARN**: Warning conditions (rate limits, validation failures)
- **ERROR**: Error conditions (SES failures, unexpected errors)
- **DEBUG**: Detailed debugging information (retry attempts, state changes)

### Trace IDs

Each request is assigned a unique trace ID that appears in all log entries for that request. This enables:
- Tracking a single request through multiple log entries
- Correlating errors with specific user actions
- Debugging complex multi-step operations

Format: `{timestamp}-{random}` (e.g., `1713564000000-abc123def456`)

## Using the StructuredLogger

### Basic Usage

```typescript
import { StructuredLogger, generateTraceId } from './logger';

const traceId = generateTraceId();
const logger = new StructuredLogger('my-component', traceId);

// Log messages
logger.info('Operation started', { userId: '123' });
logger.warn('Validation warning', { field: 'email' });
logger.error('Operation failed', error, { context: 'additional info' });
logger.debug('Debug information', { state: 'processing' });
```

### Measuring Operations

```typescript
const result = await logger.measure(
  'Send email',
  async () => {
    return await sendEmail(data);
  },
  { recipient: data.email }
);
```

This automatically logs:
- Start of operation
- Completion with duration
- Errors with duration if operation fails

### Child Loggers

Create child loggers for sub-components while maintaining the same trace ID:

```typescript
const parentLogger = new StructuredLogger('parent-component', traceId);
const childLogger = parentLogger.child('child-component');

childLogger.info('Child operation'); // Same traceId, different component
```

## CloudWatch Insights Queries

Pre-built queries are available in `insights-queries.ts`. Use them in the CloudWatch console or via AWS CLI.

### Available Queries

1. **SUBMISSION_RATE**: Contact form submission count over time (5-minute bins)
2. **ERROR_ANALYSIS**: Errors grouped by component and message
3. **API_PERFORMANCE**: Average, max, and p95 duration metrics
4. **RATE_LIMIT_VIOLATIONS**: Rate limit violations by IP address
5. **EMAIL_FAILURES**: Failed email attempts with error details
6. **VALIDATION_ERRORS**: Input validation failures by error type
7. **TRACE_REQUEST**: All log entries for a specific trace ID
8. **SLOW_REQUESTS**: Requests taking longer than 2 seconds
9. **HOURLY_VOLUME**: Submission count by hour
10. **TOP_IPS**: Most active IP addresses
11. **ERROR_RATE**: Error percentage over time
12. **SES_RETRY_ANALYSIS**: Email sending retry patterns
13. **RECENT_ERRORS_DETAILED**: Recent errors with stack traces
14. **RATE_LIMIT_OPERATIONS**: Rate limit check operations

### Using Queries in CloudWatch Console

1. Navigate to CloudWatch → Logs → Insights
2. Select log group: `/aws/lambda/contact-form-handler`
3. Paste query from `insights-queries.ts`
4. Select time range
5. Click "Run query"

### Using Queries via AWS CLI

```bash
# Example: Get submission rate for last hour
aws logs start-query \
  --log-group-name "/aws/lambda/contact-form-handler" \
  --start-time $(date -u -d '1 hour ago' +%s) \
  --end-time $(date -u +%s) \
  --query-string "fields @timestamp, message, metadata.ipAddress | filter component = \"contact-form-handler\" | filter message = \"Contact form submission successful\" | stats count() as submissions by bin(5m) | sort @timestamp desc" \
  --profile elevator-robot.com
```

Get query ID from output, then retrieve results:

```bash
aws logs get-query-results \
  --query-id <query-id-from-previous-command> \
  --profile elevator-robot.com
```

### Tracing a Specific Request

To trace all log entries for a specific request:

1. Find the trace ID from any log entry (e.g., from an error)
2. Use the TRACE_REQUEST query:

```
fields @timestamp, level, component, message, metadata
| filter traceId = "1713564000000-abc123def456"
| sort @timestamp asc
```

This shows the complete timeline of the request.

## Log Retention

Log retention is automatically configured:

- **Lambda functions**: 30 days
- **API Gateway**: 14 days

Configuration is in `log-retention.ts` and applied in `amplify/backend.ts`.

### Changing Retention

To modify retention periods, update `LOG_RETENTION_CONFIG` in `log-retention.ts`:

```typescript
export const LOG_RETENTION_CONFIG = {
  LAMBDA: logs.RetentionDays.ONE_MONTH, // Change to TWO_MONTHS, etc.
  API_GATEWAY: logs.RetentionDays.TWO_WEEKS,
  APPLICATION: logs.RetentionDays.ONE_MONTH,
} as const;
```

## Common Analysis Patterns

### Finding Errors for a Specific IP

```
fields @timestamp, level, message, metadata
| filter metadata.ipAddress = "192.0.2.1"
| filter level = "ERROR"
| sort @timestamp desc
```

### Analyzing Performance Degradation

```
fields @timestamp, metadata.duration
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats avg(metadata.duration) as avgDuration by bin(1h)
| sort @timestamp desc
```

### Identifying Spam Patterns

```
fields metadata.ipAddress, metadata.email
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats count() as submissions by metadata.ipAddress
| filter submissions > 3
| sort submissions desc
```

### Monitoring SES Retry Success Rate

```
fields @timestamp, message, metadata.attempt
| filter component = "contact-form-handler"
| filter message like /Email sent successfully/
| stats count() as successCount by metadata.attempt
```

## Best Practices

1. **Always use structured logging**: Never use plain `console.log()` - use the StructuredLogger
2. **Include trace IDs**: Generate trace IDs at the start of each request
3. **Add meaningful metadata**: Include context that helps debugging (IPs, IDs, durations)
4. **Use appropriate log levels**: INFO for normal ops, WARN for issues, ERROR for failures
5. **Don't log sensitive data**: Never log passwords, tokens, or PII
6. **Use measure() for timing**: Automatically captures duration and errors
7. **Create child loggers**: Use child loggers for sub-components to maintain trace context

## Troubleshooting

### Logs not appearing in CloudWatch

1. Check Lambda execution role has CloudWatch Logs permissions
2. Verify log group exists: `/aws/lambda/contact-form-handler`
3. Check Lambda function is being invoked (CloudWatch Metrics)

### Queries returning no results

1. Verify time range includes recent activity
2. Check log group name is correct
3. Ensure structured logging is deployed (check recent logs for JSON format)
4. Try simpler query first (e.g., `fields @timestamp, @message`)

### Trace ID not appearing

1. Ensure `generateTraceId()` is called at handler start
2. Verify logger is initialized with trace ID
3. Check all log calls use the same logger instance

## Additional Resources

- [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [AWS Lambda Logging Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/python-logging.html)
- [CloudWatch Logs Retention](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)
