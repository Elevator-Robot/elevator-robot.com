import { defineFunction, type ClientSchema } from '@aws-amplify/backend';
import * as iam from 'aws-cdk-lib/aws-iam';

export const sendEmail = defineFunction({
  name: 'send-email',
  entry: 'send-mail.ts',
  restEndpoint: {
    path: '/send-email',
    method: 'POST',
  }
});

export type Schema = ClientSchema<typeof sendEmail>;

