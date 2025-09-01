import { defineFunction } from '@aws-amplify/backend';

export const sendEmail = defineFunction({
  name: 'contact-form-handler',
  entry: 'handler.ts',
});

