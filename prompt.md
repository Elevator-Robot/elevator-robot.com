I’m building a modern website for my AI consultancy, Elevator Robot, using:
	•	AWS Amplify Gen 2 for infrastructure and deployment
	•	AppSync GraphQL backend (not REST)
	•	DynamoDB to store contact form submissions
	•	SES (optional) for notification emails
	•	ViteJS for the front-end framework

The contact form is already styled and includes name, email, and message fields. I need you to help me implement a complete and modern solution with the following:

Backend:
	1.	Define a GraphQL schema for ContactMessage with fields id, name, email, message, and createdAt.
	2.	Add auth rules to allow public unauthenticated access (e.g., via API key or Cognito guest role).
	3.	Create a mutation to submit contact messages.
	4.	Set up a Lambda function that triggers via a resolver or pipeline function after the mutation runs and sends an email via SES.
	5.	Use Amplify Gen 2 constructs where possible (@model, @auth, @function, @map).

Frontend:
	6.	Show how to connect the ViteJS front-end to the Amplify GraphQL API.
	7.	Provide a clean, idiomatic ViteJS example (using Amplify libraries) to submit the form via GraphQL mutation and handle loading/success/error states.

Extra (if time/space permits):
	•	Recommend lightweight, modern anti-spam methods (e.g. honeypot field or reCAPTCHA v3).
	•	Suggest if it’s better to use Amplify-generated types or write custom GraphQL queries manually for this flow.

Prioritize simplicity, security, and modern best practices. I want this to be production-ready and serverless-native.
