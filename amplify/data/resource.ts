import { a, defineData, ClientSchema } from '@aws-amplify/backend';
import { sendEmail } from '../functions/send-email/resource';

const schema = a
  .schema({
    Message: a.model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    }).authorization((allow) => [allow.publicApiKey()]),

    SendMessageResponse: a.customType({
      success: a.boolean().required(),
      message: a.string(),
      messageId: a.string(),
    }),

    sendMessage: a
      .mutation()
      .arguments({
        name: a.string().required(),
        email: a.string().required(),
        message: a.string().required(),
      })
      .returns(a.ref('SendMessageResponse'))
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
