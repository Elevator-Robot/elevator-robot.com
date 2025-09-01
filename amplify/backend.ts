import * as ses from 'aws-cdk-lib/aws-ses';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({ auth, data, sendEmail });

// Only create SES resources on main branch
if (process.env.AWS_BRANCH === 'main') {
  const customResourceStack = backend.createStack('SharedEmailResources');
  
  const emailIdentity = new ses.EmailIdentity(customResourceStack, 'SharedEmailIdentity', {
    identity: ses.Identity.email('aphexlog@gmail.com'),
  });
}

const sendEmailFunction = backend.sendEmail.resources.lambda;

// Add SES permissions for all environments
const sesStatement = new PolicyStatement({
  sid: 'AllowSendEmail',
  actions: ['ses:SendEmail', 'ses:SendRawEmail'],
  resources: ['*'],
});

sendEmailFunction.addToRolePolicy(sesStatement);

export default backend;
