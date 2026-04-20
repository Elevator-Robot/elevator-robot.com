/**
 * CloudWatch Dashboard for Elevator Robot Website Monitoring
 * 
 * This dashboard provides comprehensive monitoring for:
 * - Lambda function metrics (invocations, errors, duration)
 * - API Gateway metrics (requests, latency, errors)
 * - SES metrics (sent, bounced, complaints, delivery rate)
 * - AWS RUM metrics (page views, sessions, errors, Core Web Vitals)
 * - Custom metrics (form submissions, user engagement)
 * 
 * Usage:
 * Import and instantiate in amplify/backend.ts after defining backend resources
 */

import { Stack, Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface DashboardProps {
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
   * Dashboard name
   * Default: 'elevator-robot-website'
   */
  dashboardName?: string;
}

export class MonitoringDashboard extends Construct {
  public readonly dashboard: cloudwatch.Dashboard;

  constructor(scope: Construct, id: string, props: DashboardProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const dashboardName = props.dashboardName || 'elevator-robot-website';
    const rumAppName = props.rumAppName || 'elevator-robot-website';

    // Create the dashboard
    this.dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
      dashboardName: dashboardName,
      defaultInterval: Duration.hours(1),
    });

    // ========================================
    // Lambda Metrics Widget
    // ========================================
    const lambdaInvocationsMetric = props.lambdaFunction.metricInvocations({
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const lambdaErrorsMetric = props.lambdaFunction.metricErrors({
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const lambdaThrottlesMetric = props.lambdaFunction.metricThrottles({
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const lambdaDurationMetric = props.lambdaFunction.metricDuration({
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const lambdaDurationP95Metric = props.lambdaFunction.metricDuration({
      statistic: 'p95',
      period: Duration.minutes(5),
    });

    const lambdaDurationP99Metric = props.lambdaFunction.metricDuration({
      statistic: 'p99',
      period: Duration.minutes(5),
    });

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Lambda Invocations & Errors',
        width: 12,
        height: 6,
        left: [lambdaInvocationsMetric],
        right: [lambdaErrorsMetric, lambdaThrottlesMetric],
        leftYAxis: {
          label: 'Invocations',
          showUnits: false,
        },
        rightYAxis: {
          label: 'Errors & Throttles',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'Lambda Duration',
        width: 12,
        height: 6,
        left: [lambdaDurationMetric, lambdaDurationP95Metric, lambdaDurationP99Metric],
        leftYAxis: {
          label: 'Duration (ms)',
          showUnits: false,
        },
      })
    );

    // ========================================
    // API Gateway Metrics Widget
    // ========================================
    const apiRequestsMetric = new cloudwatch.Metric({
      namespace: 'AWS/AppSync',
      metricName: '4XXError',
      dimensionsMap: {
        GraphQLAPIId: props.graphqlApiId,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const api5xxErrorsMetric = new cloudwatch.Metric({
      namespace: 'AWS/AppSync',
      metricName: '5XXError',
      dimensionsMap: {
        GraphQLAPIId: props.graphqlApiId,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const apiLatencyMetric = new cloudwatch.Metric({
      namespace: 'AWS/AppSync',
      metricName: 'Latency',
      dimensionsMap: {
        GraphQLAPIId: props.graphqlApiId,
      },
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const apiLatencyP95Metric = new cloudwatch.Metric({
      namespace: 'AWS/AppSync',
      metricName: 'Latency',
      dimensionsMap: {
        GraphQLAPIId: props.graphqlApiId,
      },
      statistic: 'p95',
      period: Duration.minutes(5),
    });

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'API Gateway Errors',
        width: 12,
        height: 6,
        left: [apiRequestsMetric, api5xxErrorsMetric],
        leftYAxis: {
          label: 'Error Count',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'API Gateway Latency',
        width: 12,
        height: 6,
        left: [apiLatencyMetric, apiLatencyP95Metric],
        leftYAxis: {
          label: 'Latency (ms)',
          showUnits: false,
        },
      })
    );

    // ========================================
    // SES Metrics Widget
    // ========================================
    const sesSentMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Send',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const sesBouncesMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Bounce',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const sesComplaintsMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Complaint',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const sesRejectsMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Reject',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const sesDeliveryMetric = new cloudwatch.Metric({
      namespace: 'AWS/SES',
      metricName: 'Delivery',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    // Calculate bounce rate using math expression
    const sesBounceRateMetric = new cloudwatch.MathExpression({
      expression: '(bounces / sent) * 100',
      usingMetrics: {
        bounces: sesBouncesMetric,
        sent: sesSentMetric,
      },
      label: 'Bounce Rate (%)',
      period: Duration.minutes(5),
    });

    // Calculate complaint rate using math expression
    const sesComplaintRateMetric = new cloudwatch.MathExpression({
      expression: '(complaints / sent) * 100',
      usingMetrics: {
        complaints: sesComplaintsMetric,
        sent: sesSentMetric,
      },
      label: 'Complaint Rate (%)',
      period: Duration.minutes(5),
    });

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'SES Email Delivery',
        width: 12,
        height: 6,
        left: [sesSentMetric, sesDeliveryMetric],
        right: [sesBouncesMetric, sesComplaintsMetric, sesRejectsMetric],
        leftYAxis: {
          label: 'Sent & Delivered',
          showUnits: false,
        },
        rightYAxis: {
          label: 'Bounces, Complaints & Rejects',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'SES Bounce & Complaint Rates',
        width: 12,
        height: 6,
        left: [sesBounceRateMetric, sesComplaintRateMetric],
        leftYAxis: {
          label: 'Rate (%)',
          showUnits: false,
        },
      })
    );

    // ========================================
    // AWS RUM Metrics Widget
    // ========================================
    const rumPageViewsMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'PageViewCount',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const rumSessionsMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'SessionCount',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const rumJsErrorsMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'JsErrorCount',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const rumHttpErrorsMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'HttpErrorCount',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    // Core Web Vitals
    const rumLCPMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'LargestContentfulPaint',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const rumFIDMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'FirstInputDelay',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const rumCLSMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'CumulativeLayoutShift',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const rumPageLoadTimeMetric = new cloudwatch.Metric({
      namespace: 'AWS/RUM',
      metricName: 'PageLoadTime',
      dimensionsMap: {
        application_name: rumAppName,
      },
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'RUM Page Views & Sessions',
        width: 12,
        height: 6,
        left: [rumPageViewsMetric, rumSessionsMetric],
        leftYAxis: {
          label: 'Count',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'RUM Errors',
        width: 12,
        height: 6,
        left: [rumJsErrorsMetric, rumHttpErrorsMetric],
        leftYAxis: {
          label: 'Error Count',
          showUnits: false,
        },
      })
    );

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Core Web Vitals',
        width: 12,
        height: 6,
        left: [rumLCPMetric, rumFIDMetric],
        right: [rumCLSMetric],
        leftYAxis: {
          label: 'LCP (ms) / FID (ms)',
          showUnits: false,
        },
        rightYAxis: {
          label: 'CLS (score)',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'Page Load Time',
        width: 12,
        height: 6,
        left: [rumPageLoadTimeMetric],
        leftYAxis: {
          label: 'Load Time (ms)',
          showUnits: false,
        },
      })
    );

    // ========================================
    // Custom Metrics Widget
    // ========================================
    // Custom metrics for form submissions and user engagement
    const formSubmissionsMetric = new cloudwatch.Metric({
      namespace: 'ElevatorRobot/ContactForm',
      metricName: 'FormSubmissions',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const formSuccessMetric = new cloudwatch.Metric({
      namespace: 'ElevatorRobot/ContactForm',
      metricName: 'FormSubmissionSuccess',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const formErrorMetric = new cloudwatch.Metric({
      namespace: 'ElevatorRobot/ContactForm',
      metricName: 'FormSubmissionError',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const navigationClicksMetric = new cloudwatch.Metric({
      namespace: 'ElevatorRobot/UserEngagement',
      metricName: 'NavigationClicks',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    const serviceCardClicksMetric = new cloudwatch.Metric({
      namespace: 'ElevatorRobot/UserEngagement',
      metricName: 'ServiceCardClicks',
      statistic: 'Sum',
      period: Duration.minutes(5),
    });

    // Calculate success rate using math expression
    const formSuccessRateMetric = new cloudwatch.MathExpression({
      expression: '(success / total) * 100',
      usingMetrics: {
        success: formSuccessMetric,
        total: formSubmissionsMetric,
      },
      label: 'Success Rate (%)',
      period: Duration.minutes(5),
    });

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Contact Form Submissions',
        width: 12,
        height: 6,
        left: [formSubmissionsMetric, formSuccessMetric, formErrorMetric],
        leftYAxis: {
          label: 'Submission Count',
          showUnits: false,
        },
      }),
      new cloudwatch.GraphWidget({
        title: 'Form Success Rate',
        width: 12,
        height: 6,
        left: [formSuccessRateMetric],
        leftYAxis: {
          label: 'Success Rate (%)',
          showUnits: false,
        },
      })
    );

    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'User Engagement',
        width: 24,
        height: 6,
        left: [navigationClicksMetric, serviceCardClicksMetric],
        leftYAxis: {
          label: 'Click Count',
          showUnits: false,
        },
      })
    );
  }
}

// Example usage in amplify/backend.ts:
/*
import { MonitoringDashboard } from './monitoring/dashboard';

const backend = defineBackend({ auth, data, sendEmail });

// Get the Lambda function and API ID
const contactFormHandler = backend.sendEmail.resources.lambda;
const graphqlApi = backend.data.resources.graphqlApi;

// Create monitoring dashboard
const dashboardStack = backend.createStack('ElevatorRobotDashboard');
const dashboard = new MonitoringDashboard(dashboardStack, 'MonitoringDashboard', {
  lambdaFunction: contactFormHandler,
  graphqlApiId: graphqlApi.apiId,
  rumAppName: 'elevator-robot-website',
  dashboardName: 'elevator-robot-website',
});
*/
