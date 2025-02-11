import { a, defineData, defineFunction, ClientSchema } from '@aws-amplify/backend';

// Define the Lambda function
const sendEmail = defineFunction({
  name: 'sendEmail',
  entry: '../functions/send-email/handler.ts',
});

const schema = a
  .schema({
    // Define the Message model
    Message: a.model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    }).authorization((allow) => [allow.guest()]),

    // Define the sendMessage mutation
    sendMessage: a
      .mutation()
      .arguments({
        name: a.string().required(),
        email: a.string().required(),
        message: a.string().required(),
      })
      .returns(a.string())
      .handler(a.handler.function(sendEmail))
      .authorization((allow) => [allow.guest()]),
  })

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema });
