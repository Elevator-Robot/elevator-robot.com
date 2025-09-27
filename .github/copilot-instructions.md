# GitHub Copilot Instructions - Elevator Robot

## Project Overview
Elevator Robot is an innovations factory focused on AI, ML, and automation. This is a React + TypeScript website built with AWS Amplify Gen2, showcasing our capabilities and providing a contact interface.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: AWS Amplify Gen2 (NOT Gen1)
- **Infrastructure**: AWS CDK
- **Services**: SES (email), DynamoDB, Lambda
- **Profile**: Always use `elevator-robot.com` AWS profile

## Code Standards
- Minimal, focused implementations
- Ship early, iterate fast
- TypeScript strict mode
- Functional components with hooks
- AWS-first solutions

## Key Patterns
- Use `generateClient()` from `aws-amplify/api` for GraphQL
- Amplify Gen2 patterns: `defineBackend()`, resource definitions
- React hooks for state management
- TailwindCSS for styling
- Custom components with TypeScript interfaces

## File Structure
```
src/
├── App.tsx           # Main application
├── hooks/            # Custom React hooks
├── graphql/          # Generated GraphQL types
└── assets/           # SVG robot illustrations

amplify/
├── backend.ts        # Main backend definition
├── auth/             # Authentication resources
├── data/             # GraphQL schema
└── functions/        # Lambda functions
```

## AWS Amplify Gen2 Rules
- Use `@aws-amplify/backend` for all backend definitions
- Define resources in separate files, import in backend.ts
- Use CDK constructs for advanced AWS services
- Always use Gen2 syntax and patterns

## Contact Form Implementation
- GraphQL mutations for data persistence
- SES integration for email notifications
- Lambda function handlers in TypeScript
- Proper error handling and user feedback

## Styling Guidelines
- TailwindCSS utility classes
- Responsive design patterns
- Custom animations and effects
- Robot-themed visual elements

## Development Workflow
- `npm run dev` for local development
- `npx ampx sandbox` for backend testing
- TypeScript compilation with strict checks
- ESLint for code quality
