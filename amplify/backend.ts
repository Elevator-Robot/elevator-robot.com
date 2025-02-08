import * as ses from 'aws-cdk-lib/aws-ses';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({ auth, data, sendEmail });

const customResourceStack = backend.createStack('CustomEmailResources');

const emailIdentity = new ses.EmailIdentity(customResourceStack, 'EmailIdentity', {
  identity: ses.Identity.email('aphexlog@gmail.com'),
});

