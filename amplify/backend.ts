import * as ses from 'aws-cdk-lib/aws-ses';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({ auth, data, sendEmail });

// Create SES email identity for contact form
const customResourceStack = backend.createStack('EmailResources');

const emailIdentity = new ses.EmailIdentity(customResourceStack, 'ContactEmailIdentity', {
  identity: ses.Identity.email('hello@elevator-robot.com'),
});

const sendEmailFunction = backend.sendEmail.resources.lambda;

// Add SES permissions for all environments
const sesStatement = new PolicyStatement({
  sid: 'AllowSendEmail',
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
});

sendEmailFunction.addToRolePolicy(sesStatement);

export default backend;
