/**
 * CloudWatch Logs Insights queries for common analysis patterns
 * These queries can be used in the CloudWatch console or via AWS CLI
 */

export const INSIGHTS_QUERIES = {
  /**
   * Contact Form Submission Rate
   * Shows submission count over time in 5-minute bins
   */
  SUBMISSION_RATE: `
fields @timestamp, message, metadata.ipAddress
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats count() as submissions by bin(5m)
| sort @timestamp desc
  `.trim(),

  /**
   * Error Analysis by Component
   * Groups errors by component and counts occurrences
   */
  ERROR_ANALYSIS: `
fields @timestamp, level, component, message, metadata
| filter level = "ERROR"
| stats count() as errorCount by component, message
| sort errorCount desc
  `.trim(),

  /**
   * API Performance Metrics
   * Shows average, max, and p95 duration for successful submissions
   */
  API_PERFORMANCE: `
fields @timestamp, metadata.duration, traceId
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats avg(metadata.duration) as avgDuration, 
        max(metadata.duration) as maxDuration, 
        pct(metadata.duration, 95) as p95Duration 
  by bin(5m)
| sort @timestamp desc
  `.trim(),

  /**
   * Rate Limit Events
   * Shows rate limit violations by IP address
   */
  RATE_LIMIT_VIOLATIONS: `
fields @timestamp, message, metadata.ipAddress, metadata.submissions
| filter component = "contact-form-handler"
| filter message = "Rate limit exceeded"
| stats count() as violations by metadata.ipAddress
| sort violations desc
  `.trim(),

  /**
   * Email Sending Failures
   * Shows failed email attempts with error details
   */
  EMAIL_FAILURES: `
fields @timestamp, message, metadata.error, metadata.attempt, traceId
| filter component = "contact-form-handler"
| filter message like /Email sending attempt.*failed/
| display @timestamp, metadata.attempt, metadata.error, traceId
| sort @timestamp desc
  `.trim(),

  /**
   * Validation Errors
   * Shows input validation failures and error types
   */
  VALIDATION_ERRORS: `
fields @timestamp, message, metadata.errors, metadata.ipAddress
| filter component = "contact-form-handler"
| filter message = "Input validation failed"
| stats count() as errorCount by metadata.errors
| sort errorCount desc
  `.trim(),

  /**
   * Request Trace by Trace ID
   * Shows all log entries for a specific request
   */
  TRACE_REQUEST: (traceId: string) => `
fields @timestamp, level, component, message, metadata
| filter traceId = "${traceId}"
| sort @timestamp asc
  `.trim(),

  /**
   * Slow Requests
   * Shows requests that took longer than 2 seconds
   */
  SLOW_REQUESTS: `
fields @timestamp, metadata.duration, metadata.ipAddress, traceId
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| filter metadata.duration > 2000
| sort metadata.duration desc
  `.trim(),

  /**
   * Hourly Submission Volume
   * Shows submission count by hour
   */
  HOURLY_VOLUME: `
fields @timestamp
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats count() as submissions by bin(1h)
| sort @timestamp desc
  `.trim(),

  /**
   * Top IP Addresses by Submission Count
   * Shows most active IP addresses
   */
  TOP_IPS: `
fields metadata.ipAddress
| filter component = "contact-form-handler"
| filter message = "Contact form submission successful"
| stats count() as submissions by metadata.ipAddress
| sort submissions desc
| limit 20
  `.trim(),

  /**
   * Error Rate Over Time
   * Shows error percentage over time
   */
  ERROR_RATE: `
fields @timestamp, level
| filter component = "contact-form-handler"
| stats count() as total, 
        sum(level = "ERROR") as errors 
  by bin(5m)
| fields @timestamp, (errors / total * 100) as errorRate
| sort @timestamp desc
  `.trim(),

  /**
   * SES Retry Analysis
   * Shows email sending retry patterns
   */
  SES_RETRY_ANALYSIS: `
fields @timestamp, message, metadata.attempt, metadata.maxAttempts, traceId
| filter component = "contact-form-handler"
| filter message like /Sending email via SES/
| stats count() as attempts by metadata.attempt
| sort metadata.attempt asc
  `.trim(),

  /**
   * Recent Errors with Stack Traces
   * Shows recent errors with full details
   */
  RECENT_ERRORS_DETAILED: `
fields @timestamp, message, metadata.error.message, metadata.error.stack, traceId
| filter level = "ERROR"
| sort @timestamp desc
| limit 50
  `.trim(),

  /**
   * DynamoDB Rate Limit Operations
   * Shows rate limit check operations
   */
  RATE_LIMIT_OPERATIONS: `
fields @timestamp, message, metadata.ipAddress, metadata.submissions
| filter component = "contact-form-handler"
| filter message like /Rate limit/
| stats count() as operations by message
| sort operations desc
  `.trim(),
};

/**
 * Helper function to format queries for AWS CLI
 */
export function formatQueryForCLI(query: string): string {
  return query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Example usage in AWS CLI:
 * 
 * aws logs start-query \
 *   --log-group-name "/aws/lambda/send-email" \
 *   --start-time $(date -u -d '1 hour ago' +%s) \
 *   --end-time $(date -u +%s) \
 *   --query-string "$(node -e 'console.log(require("./insights-queries").INSIGHTS_QUERIES.SUBMISSION_RATE)')" \
 *   --profile elevator-robot.com
 */

/**
 * Query templates for common time ranges
 */
export const TIME_RANGES = {
  LAST_HOUR: {
    startTime: () => Date.now() - 60 * 60 * 1000,
    endTime: () => Date.now(),
  },
  LAST_24_HOURS: {
    startTime: () => Date.now() - 24 * 60 * 60 * 1000,
    endTime: () => Date.now(),
  },
  LAST_7_DAYS: {
    startTime: () => Date.now() - 7 * 24 * 60 * 60 * 1000,
    endTime: () => Date.now(),
  },
  LAST_30_DAYS: {
    startTime: () => Date.now() - 30 * 24 * 60 * 60 * 1000,
    endTime: () => Date.now(),
  },
};
