import { defineFunction } from '@aws-amplify/backend';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Duration } from 'aws-cdk-lib';

/**
 * Configures log retention policies for Lambda functions and API Gateway
 * Lambda: 30 days
 * API Gateway: 14 days
 */

export function configureLogRetention(stack: any, functionName: string) {
  // Lambda function log retention (30 days)
  const lambdaLogGroup = new logs.LogGroup(stack, `${functionName}LogGroup`, {
    logGroupName: `/aws/lambda/${functionName}`,
    retention: logs.RetentionDays.ONE_MONTH,
    removalPolicy: stack.removalPolicy,
  });

  return lambdaLogGroup;
}

export function configureApiGatewayLogRetention(stack: any, apiName: string) {
  // API Gateway log retention (14 days)
  const apiLogGroup = new logs.LogGroup(stack, `${apiName}ApiLogGroup`, {
    logGroupName: `/aws/apigateway/${apiName}`,
    retention: logs.RetentionDays.TWO_WEEKS,
    removalPolicy: stack.removalPolicy,
  });

  return apiLogGroup;
}

/**
 * Log retention configuration constants
 */
export const LOG_RETENTION_CONFIG = {
  LAMBDA: logs.RetentionDays.ONE_MONTH, // 30 days
  API_GATEWAY: logs.RetentionDays.TWO_WEEKS, // 14 days
  APPLICATION: logs.RetentionDays.ONE_MONTH, // 30 days for application logs
} as const;
