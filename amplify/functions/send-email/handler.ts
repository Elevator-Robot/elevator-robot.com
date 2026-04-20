import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { Handler } from 'aws-lambda';
import { StructuredLogger, generateTraceId } from './logger';

const sesClient = new SESClient({ region: 'us-east-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE || 'contact-form-rate-limits';
const MAX_SUBMISSIONS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitRecord {
  ipAddress: string;
  submissions: number;
  windowStart: number;
  windowEnd: number;
}

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

interface SendMessageResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

/**
 * Sanitizes input by removing HTML tags and trimming whitespace
 */
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates input data according to requirements
 */
function validateInput(data: ContactFormInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (data.name && data.name.length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Validate email
  if (!data.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Validate message
  if (!data.message || data.message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (data.message && data.message.length > 1000) {
    errors.push('Message must not exceed 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks rate limiting for the given IP address
 * Returns true if rate limit is exceeded
 */
async function checkRateLimit(ipAddress: string, logger: StructuredLogger): Promise<boolean> {
  const now = Date.now();

  try {
    // Get existing rate limit record
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: RATE_LIMIT_TABLE,
        Key: { ipAddress },
      })
    );

    if (result.Item) {
      const record = result.Item as RateLimitRecord;

      // Check if we're still within the rate limit window
      if (now < record.windowEnd) {
        if (record.submissions >= MAX_SUBMISSIONS_PER_HOUR) {
          logger.warn('Rate limit exceeded', {
            ipAddress,
            submissions: record.submissions,
            maxAllowed: MAX_SUBMISSIONS_PER_HOUR,
          });
          return true; // Rate limit exceeded
        }

        // Increment submission count
        await dynamoClient.send(
          new PutCommand({
            TableName: RATE_LIMIT_TABLE,
            Item: {
              ipAddress,
              submissions: record.submissions + 1,
              windowStart: record.windowStart,
              windowEnd: record.windowEnd,
            },
          })
        );

        logger.debug('Rate limit updated', {
          ipAddress,
          submissions: record.submissions + 1,
        });
      } else {
        // Window expired, start new window
        await dynamoClient.send(
          new PutCommand({
            TableName: RATE_LIMIT_TABLE,
            Item: {
              ipAddress,
              submissions: 1,
              windowStart: now,
              windowEnd: now + RATE_LIMIT_WINDOW_MS,
            },
          })
        );

        logger.debug('Rate limit window reset', { ipAddress });
      }
    } else {
      // First submission from this IP
      await dynamoClient.send(
        new PutCommand({
          TableName: RATE_LIMIT_TABLE,
          Item: {
            ipAddress,
            submissions: 1,
            windowStart: now,
            windowEnd: now + RATE_LIMIT_WINDOW_MS,
          },
        })
      );

      logger.debug('First submission from IP', { ipAddress });
    }

    return false; // Rate limit not exceeded
  } catch (error) {
    logger.error('Error checking rate limit', error instanceof Error ? error : new Error(String(error)), {
      ipAddress,
    });
    // On error, allow the submission (fail open)
    return false;
  }
}

/**
 * Formats email template with plain text and HTML versions
 */
function formatEmailTemplate(data: ContactFormInput): { text: string; html: string } {
  const timestamp = new Date().toISOString();

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Submitted at: ${timestamp}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #526ad6 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #667eea; }
    .value { margin-top: 5px; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        Submitted at: ${timestamp}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { text, html };
}

/**
 * Sends email via SES with retry logic
 */
async function sendEmailWithRetry(
  data: ContactFormInput,
  logger: StructuredLogger,
  maxAttempts: number = 3
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { text, html } = formatEmailTemplate(data);

  const params = {
    Source: 'hello@elevatorrobot.com',
    Destination: {
      ToAddresses: ['hello@elevatorrobot.com'],
    },
    ReplyToAddresses: [data.email],
    Message: {
      Subject: {
        Data: `New Contact Form Submission - ${data.name}`,
      },
      Body: {
        Text: {
          Data: text,
        },
        Html: {
          Data: html,
        },
      },
    },
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logger.info('Sending email via SES', {
        attempt,
        maxAttempts,
        recipient: data.email,
      });

      const result = await sesClient.send(new SendEmailCommand(params));

      logger.info('Email sent successfully', {
        messageId: result.MessageId,
        attempt,
      });

      return { success: true, messageId: result.MessageId };
    } catch (error) {
      logger.error(
        `Email sending attempt ${attempt} failed`,
        error instanceof Error ? error : new Error(String(error)),
        { attempt, maxAttempts }
      );

      if (attempt === maxAttempts) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      // Exponential backoff: 1s, 2s, 4s
      const backoffMs = Math.pow(2, attempt - 1) * 1000;
      logger.debug('Retrying email send', { backoffMs, nextAttempt: attempt + 1 });
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  return { success: false, error: 'Max retry attempts reached' };
}

/**
 * Main Lambda handler
 */
export const handler: Handler = async (event): Promise<SendMessageResponse> => {
  const traceId = generateTraceId();
  const logger = new StructuredLogger('contact-form-handler', traceId);
  const startTime = Date.now();

  try {
    // Extract input data
    const { name, email, message } = event.arguments;

    // Extract IP address from request context
    const ipAddress =
      event.request?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      event.requestContext?.identity?.sourceIp ||
      'unknown';

    logger.info('Contact form submission received', {
      ipAddress,
      hasName: !!name,
      hasEmail: !!email,
      hasMessage: !!message,
    });

    // Sanitize inputs
    const sanitizedData: ContactFormInput = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    };

    // Validate input
    const validation = validateInput(sanitizedData);
    if (!validation.valid) {
      logger.warn('Input validation failed', {
        errors: validation.errors,
        ipAddress,
      });
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join(', ')}`,
      };
    }

    // Check rate limiting
    const rateLimitExceeded = await checkRateLimit(ipAddress, logger);
    if (rateLimitExceeded) {
      logger.warn('Rate limit exceeded', { ipAddress });
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      };
    }

    // Send email with retry logic
    const emailResult = await sendEmailWithRetry(sanitizedData, logger, 3);

    if (!emailResult.success) {
      logger.error('Failed to send email after retries', undefined, {
        error: emailResult.error,
        ipAddress,
      });
      return {
        success: false,
        message: 'Failed to send email. Please try again later.',
      };
    }

    // Log successful submission
    const duration = Date.now() - startTime;
    logger.info('Contact form submission successful', {
      messageId: emailResult.messageId,
      duration,
      ipAddress,
    });

    return {
      success: true,
      message: 'Message sent successfully',
      messageId: emailResult.messageId,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      'Unexpected error in contact form handler',
      error instanceof Error ? error : new Error(String(error)),
      { duration }
    );

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
};

