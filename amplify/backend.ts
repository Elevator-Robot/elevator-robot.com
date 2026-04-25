import * as ses from 'aws-cdk-lib/aws-ses';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { MonitoringDashboard } from './monitoring/dashboard';
import { MonitoringAlarms } from './monitoring/alarms';
import { LOG_RETENTION_CONFIG } from './monitoring/log-retention';

const backend = defineBackend({ auth, data, sendEmail });

// Get references to resources
const contactFormHandler = backend.sendEmail.resources.lambda;
const graphqlApi = backend.data.resources.graphqlApi;

// Use the data stack for all additional resources to avoid circular dependencies
// Since sendEmail function is already assigned to data stack via resourceGroupName
const dataStack = backend.data.resources.cfnResources.cfnGraphqlApi.stack;

// Only create email identity if not in sandbox mode
// SES email identity already deployed - commenting out to avoid conflicts
// Email hello@elevatorrobot.com is already verified at the account level
// if (backend.stack.stackName.includes('main-branch')) {
//   new ses.EmailIdentity(dataStack, 'ContactEmail', {
//     identity: ses.Identity.email('hello@elevatorrobot.com'),
//   });
// }

// Create DynamoDB table for rate limiting in data stack
// Using dynamic table name to avoid conflicts across deployments
const rateLimitTable = new dynamodb.Table(dataStack, 'RateLimitTable', {
  // Don't specify tableName - let CDK generate unique name
  partitionKey: {
    name: 'ipAddress',
    type: dynamodb.AttributeType.STRING,
  },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY, // For development; use RETAIN in production
  timeToLiveAttribute: 'ttl',
});

// Add SES permissions
const sesPermissions = new PolicyStatement({
  sid: 'AllowContactFormEmails',
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
});

contactFormHandler.addToRolePolicy(sesPermissions);

// Add DynamoDB permissions for rate limiting
rateLimitTable.grantReadWriteData(contactFormHandler);

// Pass table name to Lambda via environment variable
(contactFormHandler as any).addEnvironment('RATE_LIMIT_TABLE', rateLimitTable.tableName);

// ========================================
// CloudWatch Log Retention
// ========================================
// Configure Lambda function log retention (30 days)
new logs.LogGroup(dataStack, 'ContactFormHandlerLogGroup', {
  logGroupName: `/aws/lambda/${contactFormHandler.functionName}`,
  retention: LOG_RETENTION_CONFIG.LAMBDA,
  removalPolicy: RemovalPolicy.DESTROY,
});

// Configure API Gateway log retention (14 days)
new logs.LogGroup(dataStack, 'ApiGatewayLogGroup', {
  logGroupName: `/aws/appsync/${graphqlApi.apiId}`,
  retention: LOG_RETENTION_CONFIG.API_GATEWAY,
  removalPolicy: RemovalPolicy.DESTROY,
});

// ========================================
// CloudWatch Dashboard & Alarms
// ========================================
// Add monitoring to data stack to avoid circular dependencies
new MonitoringDashboard(dataStack, 'MonitoringDashboard', {
  lambdaFunction: contactFormHandler,
  graphqlApiId: graphqlApi.apiId,
  rumAppName: 'elevator-robot-website',
  dashboardName: 'elevator-robot-website',
});

new MonitoringAlarms(dataStack, 'MonitoringAlarms', {
  lambdaFunction: contactFormHandler,
  graphqlApiId: graphqlApi.apiId,
  rumAppName: 'elevator-robot-website',
  adminEmail: 'hello@elevatorrobot.com',
  // Remove hardcoded SNS topic name to avoid conflicts
  // snsTopicName: 'elevator-robot-alarms',
});

export default backend;
