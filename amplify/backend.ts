import * as ses from 'aws-cdk-lib/aws-ses';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({ auth, data, sendEmail });

// Create SES email identity only for production (main branch)
const emailStack = backend.createStack('ElevatorRobotEmail');

// Only create email identity if not in sandbox mode
if (backend.stack.stackName.includes('main-branch')) {
  new ses.EmailIdentity(emailStack, 'ContactEmail', {
    identity: ses.Identity.email('hello@elevator-robot.com'),
  });
}

const contactFormHandler = backend.sendEmail.resources.lambda;

// Add SES permissions
const sesPermissions = new PolicyStatement({
  sid: 'AllowContactFormEmails',
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
});

contactFormHandler.addToRolePolicy(sesPermissions);

export default backend;
