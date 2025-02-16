import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Handler } from 'aws-lambda';

const sesClient = new SESClient({ region: 'us-east-1' });

export const handler: Handler = async (event, context) => {
  const { name, email, message } = event.arguments;

  const params = {
    Source: 'aphexlog@gmail.com',
    Destination: {
      ToAddresses: ['recipient@example.com'],
    },
    Message: {
      Subject: {
        Data: 'New Contact Form Submission',
      },
      Body: {
        Text: {
          Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        },
      },
    },
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));
    console.log(`Email sent: ${result.MessageId}`);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: 'Email sent successfully',
        messageId: result.MessageId
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

