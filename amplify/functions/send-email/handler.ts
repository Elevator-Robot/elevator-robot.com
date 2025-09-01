import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Handler } from 'aws-lambda';

const sesClient = new SESClient({ region: 'us-east-1' });

export const handler: Handler = async (event) => {
  const { name, email, message } = event.arguments;

  const params = {
    Source: 'hello@elevator-robot.com',
    Destination: {
      ToAddresses: ['hello@elevator-robot.com'],
    },
    Message: {
      Subject: {
        Data: `New Contact Form Submission - ${name}`,
      },
      Body: {
        Text: {
          Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\nSubmitted at: ${new Date().toISOString()}`,
        },
      },
    },
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));
    console.log(`Email sent: ${result.MessageId}`);
    return 'Email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

