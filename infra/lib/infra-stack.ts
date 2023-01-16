import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HostedSite } from '@elevator-robot/cdk-s3-site';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new HostedSite(this, 'DotCom', {
      domainName: 'elevator-robot.com',
      webAssetPath: '../out',
    });

  }
}
