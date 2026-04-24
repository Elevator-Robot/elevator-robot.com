/**
 * CloudWatch Alarms for Elevator Robot Website Monitoring
 * 
 * This module configures CloudWatch alarms for critical metrics:
 * - Lambda error rate alarm (threshold: 5%, 2 periods of 5 min)
 * - API latency alarm (threshold: 1000ms p95, 3 periods of 5 min)
 * - SES bounce rate alarm (threshold: 5%, 1 period of 15 min)
 * - RUM JavaScript error alarm (threshold: 10/min, 2 periods of 5 min)
 * 
 * All alarms send notifications to an SNS topic configured with admin email.
 * 
 * Usage:
 * Import and instantiate in amplify/backend.ts after defining backend resources
 */

import { Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface AlarmsProps {
  /**
   * The Lambda function to monitor
   */
  lambdaFunction: lambda.IFunction;
  
  /**
   * The GraphQL API ID to monitor
   */
  graphqlApiId: string;
  
  /**
   * The RUM application name
   * Default: 'elevator-robot-website'
   */
  rumAppName?: string;
  
  /**
   * Admin email address for alarm notifications
   * Required for SNS topic subscription
   */
  adminEmail: string;
  
  /**
   * SNS topic name for alarms
   * Default: 'elevator-robot-alarms'
   */
  snsTopicName?: string;
}

export class MonitoringAlarms extends Construct {
  public readonly alarmTopic: sns.Topic;
  public readonly lambdaErrorAlarm: cloudwatch.Alarm;
  public readonly apiLatencyAlarm: cloudwatch.Alarm;
  public readonly sesBounceRateAlarm: cloudwatch.Alarm;
  public readonly rumJsErrorAlarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: AlarmsProps) {
    super(scope, id);

    const rumAppName = props.rumAppName || 'elevator-robot-website';
    const snsTopicName = props.snsTopicName || 'elevator-robot-alarms';

    // ========================================
    // SNS Topic for Alarm Notifications
    // ========================================
    this.alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      topicName: snsTopicName,
      displayName: 'Elevator Robot Website Alarms',
    });

    // Subscribe admin email to the topic
    this.alarmTopic.addSubscription(
      new snsSubscriptions.EmailSubscription(props.adminEmail)
    );

    // ========================================
    // Lambda Error Rate Alarm
    // ========================================
    // Threshold: Error rate > 5%
    // Evaluation: 2 consecutive periods of 5 minutes
    
    const lambdaInvocationsMetric = props.lambdaFunction.metricInvocations({
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const lambdaErrorsMetric = props.lambdaFunction.metricErrors({
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    // Calculate error rate as percentage
    const lambdaErrorRateMetric = new cloudwatch.MathExpression({
      expression: '(errors / invocations) * 100',
      usingMetrics: {
        errors: lambdaErrorsMetric,
        invocations: lambdaInvocationsMetric,
      },
      label: 'Error Rate (%)',
      period: Duration.minutes(5),
    });

    this.lambdaErrorAlarm = new cloudwatch.Alarm(this, 'LambdaErrorRateAlarm', {
      alarmName: 'elevator-robot-lambda-error-rate',
      alarmDescription: 'Lambda function error rate exceeded 5% threshold',
      metric: lambdaErrorRateMetric,
      threshold: 5,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    this.lambdaErrorAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(this.alarmTopic)
    );

    // ========================================
    // API Latency Alarm
    // ========================================
    // Threshold: P95 latency > 1000ms
    // Evaluation: 3 consecutive periods of 5 minutes
    
    const apiLatencyP95Metric = new cloudwatch.Metric({
      namespace: 'AWS/AppSync',
      metricName: 'Latency',
      dimensionsMap: {
        GraphQLAPIId: props.graphqlApiId,
      },
      statistic: 'p95',
      period: Duration.minutes(5),
    });

    this.apiLatencyAlarm = new cloudwatch.Alarm(this, 'ApiLatencyAlarm', {
      alarmName: 'elevator-robot-api-latency',
      alarmDescription: 'API Gateway P95 latency exceeded 1000ms threshold',
      metric: apiLatencyP95Metric,
      threshold: 1000,
      evaluationPeriods: 3,
      datapointsToAlarm: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    this.apiLatencyAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(this.alarmTopic)
    );

    // ========================================
    // SES Bounce Rate Alarm
    // ========================================
    // Threshold: Bounce rate > 5%
    // Evaluation: 1 period of 15 minutes
    
    const sesSentMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Send',
      statistic: 'Sum',
      period: Duration.minutes(15),
    });

    const sesBouncesMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Bounce',
      statistic: 'Sum',
      period: Duration.minutes(15),
    });

    // Calculate bounce rate as percentage
    const sesBounceRateMetric = new cloudwatch.MathExpression({
      expression: '(bounces / sent) * 100',
      usingMetrics: {
        bounces: sesBouncesMetric,
        sent: sesSentMetric,
      },
      label: 'Bounce Rate (%)',
      period: Duration.minutes(15),
    });

    this.sesBounceRateAlarm = new cloudwatch.Alarm(this, 'SesBounceRateAlarm', {
      alarmName: 'elevator-robot-ses-bounce-rate',
      alarmDescription: 'SES bounce rate exceeded 5% threshold',
      metric: sesBounceRateMetric,
      threshold: 5,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    this.sesBounceRateAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(this.alarmTopic)
    );

    // ========================================
    // RUM JavaScript Error Alarm
    // ========================================
    // Threshold: Error count > 10 per minute
    // Evaluation: 2 consecutive periods of 5 minutes
    
    const rumJsErrorsMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'JsErrorCount',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    // Calculate error rate per minute
    const rumJsErrorRateMetric = new cloudwatch.MathExpression({
      expression: 'errors / 5',
      usingMetrics: {
        errors: rumJsErrorsMetric,
      },
      label: 'JS Errors per Minute',
      period: Duration.minutes(5),
    });

    this.rumJsErrorAlarm = new cloudwatch.Alarm(this, 'RumJsErrorAlarm', {
      alarmName: 'elevator-robot-rum-js-errors',
      alarmDescription: 'RUM JavaScript error rate exceeded 10 errors per minute',
      metric: rumJsErrorRateMetric,
      threshold: 10,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    this.rumJsErrorAlarm.addAlarmAction(
      new cloudwatchActions.SnsAction(this.alarmTopic)
    );
  }
}

// Example usage in amplify/backend.ts:
/*
import { MonitoringAlarms } from './monitoring/alarms';

const backend = defineBackend({ auth, data, sendEmail });

// Get the Lambda function and API ID
const contactFormHandler = backend.sendEmail.resources.lambda;
const graphqlApi = backend.data.resources.graphqlApi;

// Create monitoring alarms
const alarmsStack = backend.createStack('ElevatorRobotAlarms');
const alarms = new MonitoringAlarms(alarmsStack, 'MonitoringAlarms', {
  lambdaFunction: contactFormHandler,
  graphqlApiId: graphqlApi.apiId,
  rumAppName: 'elevator-robot-website',
  adminEmail: 'hello@elevatorrobot.com',
  snsTopicName: 'elevator-robot-alarms',
});
*/
