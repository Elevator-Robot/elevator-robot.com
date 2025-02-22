import * as ses from 'aws-cdk-lib/aws-ses';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({ auth, data, sendEmail });

const customResourceStack = backend.createStack('CustomEmailResources');

const environment = process.env.ENV || 'dev';

const emailIdentity = new ses.EmailIdentity(customResourceStack, `EmailIdentity-${environment}`, {
  identity: ses.Identity.email('aphexlog@gmail.com'),
});

const sendEmailFunction = backend.sendEmail.resources.lambda;

const statement = new PolicyStatement({
  sid: 'AllowSendEmail',
  actions: ['SES:SendEmail'],
  resources: [emailIdentity.emailIdentityArn],
});

sendEmailFunction.addToRolePolicy(statement);

export default backend;
