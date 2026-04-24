/**
 * Structured logging utility for Lambda functions
 * Provides consistent log format with timestamp, level, component, message, and metadata
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  metadata?: Record<string, any>;
  traceId?: string;
  duration?: number;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export class StructuredLogger {
  private component: string;
  private traceId?: string;

  constructor(component: string, traceId?: string) {
    this.component = component;
    this.traceId = traceId;
  }

  /**
   * Sets the trace ID for request correlation
   */
  setTraceId(traceId: string): void {
    this.traceId = traceId;
  }

  /**
   * Logs an INFO level message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log('INFO', message, metadata);
  }

  /**
   * Logs a WARN level message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log('WARN', message, metadata);
  }

  /**
   * Logs an ERROR level message
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    const errorMetadata = error
      ? {
          error: {
            message: error.message,
            stack: error.stack,
            code: (error as any).code,
          },
        }
      : {};

    this.log('ERROR', message, { ...metadata, ...errorMetadata });
  }

  /**
   * Logs a DEBUG level message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log('DEBUG', message, metadata);
  }

  /**
   * Core logging method that outputs structured JSON
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      ...(this.traceId && { traceId: this.traceId }),
      ...(metadata && { metadata }),
    };

    // Output as JSON for CloudWatch Logs Insights parsing
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Creates a child logger with the same trace ID but different component
   */
  child(component: string): StructuredLogger {
    return new StructuredLogger(component, this.traceId);
  }

  /**
   * Measures execution time and logs with duration
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    this.info(`${operation} started`, metadata);

    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.info(`${operation} completed`, { ...metadata, duration });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(
        `${operation} failed`,
        error instanceof Error ? error : new Error(String(error)),
        { ...metadata, duration }
      );
      throw error;
    }
  }
}

/**
 * Generates a unique trace ID for request correlation
 */
export function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
