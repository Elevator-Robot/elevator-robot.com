import { a, defineData, ClientSchema } from '@aws-amplify/backend';
import { sendEmail } from '../functions/send-email/resource';

const schema = a
  .schema({
    Message: a.model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    }).authorization((allow) => [allow.publicApiKey()]),

    Conversation: a.model({
      title: a.string().required(),
      userId: a.string().required(), // Will track user sessions for now
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }).authorization((allow) => [allow.publicApiKey()]),

    ChatMessage: a.model({
      conversationId: a.string().required(),
      content: a.string().required(),
      sender: a.string().required(), // 'user' or 'assistant'
      timestamp: a.datetime(),
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
