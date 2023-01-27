import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HostedSite } from '@elevator-robot/cdk-s3-site';

interface InfraStackProps extends cdk.StackProps {
  domainName: string;
  webAssetPath: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    new HostedSite(this, 'DotCom', {
      domainName: props.domainName,
      webAssetPath: props.webAssetPath,
    });

  }
}
