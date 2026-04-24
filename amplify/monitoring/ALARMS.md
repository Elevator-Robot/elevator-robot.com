# CloudWatch Alarms Configuration

This document describes the CloudWatch alarms configured for the Elevator Robot website monitoring system.

## Overview

The monitoring system includes four critical alarms that send notifications via SNS when thresholds are breached:

1. **Lambda Error Rate Alarm** - Monitors backend function errors
2. **API Latency Alarm** - Monitors GraphQL API response times
3. **SES Bounce Rate Alarm** - Monitors email delivery issues
4. **RUM JavaScript Error Alarm** - Monitors frontend JavaScript errors

## SNS Topic Configuration

**Topic Name**: `elevator-robot-alarms`

**Subscription**: Email notifications sent to `hello@elevatorrobot.com`

**Note**: After deployment, you must confirm the email subscription by clicking the link in the confirmation email sent by AWS SNS.

## Alarm Details

### 1. Lambda Error Rate Alarm

**Alarm Name**: `elevator-robot-lambda-error-rate`

**Description**: Triggers when the Lambda function error rate exceeds 5%

**Metric**: Error rate calculated as `(errors / invocations) * 100`

**Threshold**: 5%

**Evaluation**: 2 consecutive periods of 5 minutes

**Action**: Send notification to SNS topic

**Use Case**: Detects when the contact form backend is experiencing high error rates, indicating potential issues with:
- Input validation failures
- SES service errors
- Rate limiting issues
- Unexpected exceptions

### 2. API Latency Alarm

**Alarm Name**: `elevator-robot-api-latency`

**Description**: Triggers when the GraphQL API P95 latency exceeds 1000ms

**Metric**: AppSync Latency (P95 percentile)

**Threshold**: 1000ms

**Evaluation**: 3 consecutive periods of 5 minutes

**Action**: Send notification to SNS topic

**Use Case**: Detects when the API is responding slowly, which could indicate:
- Lambda cold starts
- Database performance issues
- Network latency
- Increased load

### 3. SES Bounce Rate Alarm

**Alarm Name**: `elevator-robot-ses-bounce-rate`

**Description**: Triggers when the SES bounce rate exceeds 5%

**Metric**: Bounce rate calculated as `(bounces / sent) * 100`

**Threshold**: 5%

**Evaluation**: 1 period of 15 minutes

**Action**: Send notification to SNS topic

**Use Case**: Detects email delivery issues, which could indicate:
- Invalid email addresses being submitted
- Domain reputation issues
- SES configuration problems
- Spam filter issues

**Important**: High bounce rates can affect your SES sending reputation. Investigate immediately if this alarm triggers.

### 4. RUM JavaScript Error Alarm

**Alarm Name**: `elevator-robot-rum-js-errors`

**Description**: Triggers when JavaScript errors exceed 10 per minute

**Metric**: JS error rate calculated as `errors / 5` (per minute)

**Threshold**: 10 errors per minute

**Evaluation**: 2 consecutive periods of 5 minutes

**Action**: Send notification to SNS topic

**Use Case**: Detects frontend issues affecting users, which could indicate:
- JavaScript runtime errors
- Browser compatibility issues
- Network failures
- Third-party script failures

## Alarm States

Each alarm can be in one of three states:

- **OK**: Metric is within threshold
- **ALARM**: Metric has breached threshold for the specified evaluation periods
- **INSUFFICIENT_DATA**: Not enough data to evaluate the alarm

## Missing Data Treatment

All alarms are configured with `treatMissingData: NOT_BREACHING`, which means:
- If no data is available for a period, the alarm will not trigger
- This prevents false alarms during periods of no activity

## Testing Alarms

### Test Lambda Error Alarm

Trigger errors by submitting invalid data to the contact form or by temporarily modifying the Lambda function to throw errors.

### Test API Latency Alarm

Add artificial delays to the Lambda function or simulate high load.

### Test SES Bounce Rate Alarm

Send emails to known bounce addresses (e.g., `bounce@simulator.amazonses.com` in SES sandbox).

### Test RUM JavaScript Error Alarm

Trigger JavaScript errors in the frontend application (e.g., throw errors in event handlers).

## Viewing Alarms

### AWS Console

1. Navigate to CloudWatch → Alarms
2. Filter by alarm name prefix: `elevator-robot-`
3. View alarm state, history, and metrics

### AWS CLI

```bash
# List all alarms
aws cloudwatch describe-alarms \
  --alarm-name-prefix elevator-robot- \
  --profile elevator-robot.com

# Get alarm history
aws cloudwatch describe-alarm-history \
  --alarm-name elevator-robot-lambda-error-rate \
  --profile elevator-robot.com
```

## Modifying Alarms

To modify alarm thresholds or evaluation periods:

1. Edit `amplify/monitoring/alarms.ts`
2. Update the relevant alarm configuration
3. Deploy changes: `npx ampx sandbox` (dev) or push to main branch (prod)

## SNS Email Subscription

After first deployment, you must confirm the email subscription:

1. Check the inbox for `hello@elevatorrobot.com`
2. Look for email from AWS Notifications
3. Click the "Confirm subscription" link
4. Verify subscription is active in SNS console

## Alarm Notifications

When an alarm triggers, you'll receive an email with:

- Alarm name and description
- Current metric value
- Threshold that was breached
- Timestamp of the alarm
- Link to view the alarm in AWS Console

## Best Practices

1. **Respond Promptly**: Investigate alarms as soon as they trigger
2. **Review Trends**: Check CloudWatch dashboard for patterns before alarms trigger
3. **Adjust Thresholds**: Fine-tune thresholds based on actual usage patterns
4. **Document Incidents**: Keep a log of alarm triggers and resolutions
5. **Test Regularly**: Periodically test alarms to ensure they're working correctly

## Troubleshooting

### Alarm Not Triggering

- Verify the alarm is in OK state (not INSUFFICIENT_DATA)
- Check that metrics are being published to CloudWatch
- Verify threshold and evaluation period settings
- Check alarm actions are configured correctly

### False Alarms

- Review metric data to understand normal patterns
- Adjust threshold or evaluation periods
- Consider using anomaly detection for dynamic thresholds

### Email Not Received

- Verify SNS subscription is confirmed
- Check spam/junk folder
- Verify email address in SNS subscription
- Check SNS topic permissions

## Related Documentation

- [CloudWatch Dashboard](./README.md)
- [AWS RUM Setup](./rum-setup.ts)
- [Lambda Function](../functions/send-email/handler.ts)
- [Backend Configuration](../backend.ts)
