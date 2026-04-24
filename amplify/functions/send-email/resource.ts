import { defineFunction } from '@aws-amplify/backend';

export const sendEmail = defineFunction({
  name: 'contact-form-handler',
  entry: 'handler.ts',
  timeoutSeconds: 30,
  resourceGroupName: 'data', // Assign to data stack to avoid circular dependency
  environment: {
    LOG_LEVEL: 'INFO',
  },
});

