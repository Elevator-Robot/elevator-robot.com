import { a, defineData, defineFunction, ClientSchema } from '@aws-amplify/backend';

const sendEmail = defineFunction({
  name: 'sendEmail',
  entry: '../functions/send-email/handler.ts',
});

const schema = a
  .schema({
    Message: a.model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    }).authorization((allow) => [allow.publicApiKey()]),

    sendMessage: a
      .mutation()
      .arguments({
        name: a.string().required(),
        email: a.string().required(),
        message: a.string().required(),
      })
      .returns(a.string())
      .handler(a.handler.function(sendEmail))
      .authorization((allow) => [allow.publicApiKey()]),
  })

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    }
  }
});
