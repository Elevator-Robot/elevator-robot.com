import { a, defineData } from '@aws-amplify/backend';
import { sendEmail } from '../functions/send-email/resource'

// create a schema for sending an ses email from the contact form (name, email, message)

export const contactSchema = defineData({
  name: 'contact',
  fields: {
    name: a.string(),
    email: a.string(),
    message: a.string(),
  },
  syncConfig: {
    conflictDetection: 'VERSION',
    conflictHandler: 'AUTOMERGE',
  },
  timestamps: true,
  functionTriggers: {
    onCreate: [sendEmail],
  },
});

export type Schema = typeof contactSchema;

