/**
 * AWS RUM (Real User Monitoring) Setup using CDK
 * 
 * This file defines the infrastructure for AWS RUM monitoring.
 * It creates:
 * - Cognito Identity Pool for unauthenticated access
 * - IAM role with RUM permissions
 * - RUM App Monitor with telemetry configuration
 * 
 * Usage:
 * Import this in amplify/backend.ts to automatically provision RUM resources
 */

import { Stack, CfnOutput } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rum from 'aws-cdk-lib/aws-rum';
import { Construct } from 'constructs';

export interface RumSetupProps {
  /**
   * The domain(s) where the RUM client will be used
   * Example: ['elevatorrobot.com', 'www.elevatorrobot.com']
   */
  allowedDomains: string[];
  
  /**
   * Session sample rate (0.0 to 1.0)
   * 1.0 = 100% of sessions, 0.1 = 10% of sessions
   * Default: 1.0 (100%)
   */
  sessionSampleRate?: number;
  
  /**
   * Application name for the RUM monitor
   * Default: 'elevator-robot-website'
   */
  appName?: string;
}

export class RumSetup extends Construct {
  public readonly identityPoolId: string;
  public readonly applicationId: string;
  public readonly endpoint: string;
  public readonly region: string;

  constructor(scope: Construct, id: string, props: RumSetupProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const appName = props.appName || 'elevator-robot-website';
    const sessionSampleRate = props.sessionSampleRate ?? 1.0;

    // Create Cognito Identity Pool for unauthenticated access
    const identityPool = new cognito.CfnIdentityPool(this, 'RumIdentityPool', {
      identityPoolName: `${appName}-rum-pool`,
      allowUnauthenticatedIdentities: true,
    });

    // Create IAM role for unauthenticated users
    const unauthRole = new iam.Role(this, 'RumUnauthRole', {
      roleName: `${appName}-rum-unauth-role`,
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      description: 'Unauthenticated role for AWS RUM',
    });

    // Grant RUM permissions to unauthenticated role
    unauthRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['rum:PutRumEvents'],
        resources: ['*'],
      })
    );

    // Attach role to identity pool
    new cognito.CfnIdentityPoolRoleAttachment(this, 'RumIdentityPoolRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: unauthRole.roleArn,
      },
    });

    // Create RUM App Monitor
    const rumAppMonitor = new rum.CfnAppMonitor(this, 'RumAppMonitor', {
      name: appName,
      domain: props.allowedDomains[0], // Primary domain
      appMonitorConfiguration: {
        identityPoolId: identityPool.ref,
        sessionSampleRate: sessionSampleRate,
        telemetries: ['errors', 'performance', 'http'],
        allowCookies: true,
        enableXRay: true,
        // Guest role ARN for unauthenticated access
        guestRoleArn: unauthRole.roleArn,
      },
    });

    // Export values for use in frontend
    this.identityPoolId = identityPool.ref;
    this.applicationId = rumAppMonitor.ref;
    this.endpoint = `https://dataplane.rum.${stack.region}.amazonaws.com`;
    this.region = stack.region;

    // Output values to CloudFormation
    new CfnOutput(this, 'RumApplicationId', {
      value: this.applicationId,
      description: 'AWS RUM Application ID',
      exportName: `${appName}-rum-app-id`,
    });

    new CfnOutput(this, 'RumIdentityPoolId', {
      value: this.identityPoolId,
      description: 'Cognito Identity Pool ID for RUM',
      exportName: `${appName}-rum-identity-pool-id`,
    });

    new CfnOutput(this, 'RumEndpoint', {
      value: this.endpoint,
      description: 'AWS RUM Endpoint',
      exportName: `${appName}-rum-endpoint`,
    });

    new CfnOutput(this, 'RumRegion', {
      value: this.region,
      description: 'AWS RUM Region',
      exportName: `${appName}-rum-region`,
    });
  }
}

// Example usage in amplify/backend.ts:
/*
import { RumSetup } from './monitoring/rum-setup';

const backend = defineBackend({ auth, data, sendEmail });

// Create RUM setup
const rumStack = backend.createStack('ElevatorRobotRUM');
const rumSetup = new RumSetup(rumStack, 'RumSetup', {
  allowedDomains: ['elevatorrobot.com', 'www.elevatorrobot.com'],
  sessionSampleRate: 1.0, // 100% of sessions
  appName: 'elevator-robot-website',
});

// The outputs will be available in CloudFormation and can be used
// to configure environment variables in Amplify Hosting
*/
