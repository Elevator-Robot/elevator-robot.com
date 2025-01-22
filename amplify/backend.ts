import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({ auth, data });
const customResourceStack = backend.createStack('CustomEmailResources');

const emailIdentity = new ses.EmailIdentity(customResourceStack, 'EmailIdentity', {
  identity: ses.Identity.email('aaron@elevator-robot.com'),
});

// Create a policy statement
new iam.PolicyStatement({
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'], // Adjust the resource ARN as needed
});
