# AGENTS.md - Elevator Robot Development Guide

## Dev Environment Tips
- Use `npm run dev` to start the Vite development server with hot reload.
- Run `npx ampx sandbox` to start the Amplify Gen2 backend sandbox environment.
- Always use the `elevator-robot.com` AWS profile for all AWS operations.
- Check `amplify_outputs.json` for current backend resource configurations after deployment.
- Run `npm run build` to create a production build and validate TypeScript compilation.
- Frontend code lives in `src/` while backend resources are in `amplify/`.

## Testing Instructions
- Run `npm run lint` to check ESLint and TypeScript rules across the project.
- Run `npm run build` to validate that TypeScript compiles without errors.
- Test the site by running `npm run dev` and checking all pages and interactions.
- For backend testing, use `npx ampx sandbox` and test API endpoints.
- Test authentication flows if implementing auth-related changes.
- Validate responsive design at mobile, tablet, and desktop breakpoints.
- Test contact form submissions end-to-end (form → Lambda → SES).
- Check browser console for errors or warnings during testing.

## Architecture Validation
- Ensure all AWS resources are defined using Amplify Gen2 patterns (NOT Gen1).
- Use `defineBackend()` in `amplify/backend.ts` for backend configuration.
- Validate that authorization rules are properly implemented for protected resources.
- Check that Lambda functions use proper error handling and logging.
- Verify that DynamoDB table designs follow single-table design patterns where applicable.
- Ensure SES email sending includes proper error handling and user feedback.

## AWS Deployment
- Always use the `elevator-robot.com` AWS profile: `aws configure --profile elevator-robot.com`.
- Deploy backend with `npx ampx sandbox` for development testing.
- For production deployment, push to main branch (auto-deploys via Amplify Hosting).
- Validate IAM policies follow least privilege principles.
- Check that Lambda functions have proper permissions for DynamoDB, SES, etc.
- Ensure all AWS resources are properly tagged with project metadata.

## Code Quality
- Run `npm run lint` before every commit to ensure code quality.
- Use strict TypeScript typing with explicit types for all function parameters and return values.
- Follow React functional components with hooks pattern exclusively.
- Use TailwindCSS for styling with consistent design system.
- Write meaningful commit messages following conventional commits format.
- Keep components focused and under 250 lines when possible.
- Extract reusable logic into custom hooks in `src/hooks/`.

## Security Checklist
- Never expose sensitive data, API keys, or credentials in client-side code.
- Use environment variables for all configuration values.
- Implement proper input validation and sanitization for all user inputs.
- Validate that API endpoints use proper authentication/authorization.
- Check that Lambda functions don't log sensitive information.
- Ensure email submissions include rate limiting to prevent abuse.

## PR Instructions
- Title format: `[elevator-robot] <descriptive-title>`
- Always run `npm run lint && npm run build` before committing.
- Test responsive design and cross-browser compatibility for frontend changes.
- For backend changes, validate sandbox deployment works correctly.
- Include screenshots for UI changes and test results for backend modifications.
- Update documentation if changes affect the overall architecture or setup.
- Ensure all commits pass linting and build checks.

## Studio Development
- Studio apps (Image Gen, Text Gen) will be built as part of this repo.
- Use subdomain routing: `studio.elevatorrobot.com`.
- Follow public/freemium model with usage tiers.
- Maintain consistent branding with main site.
- Reference issues #83 (Image Studio) and #84 (Text Studio) for requirements.
- See `/Users/aphexlog/Code/brainincup` for Amplify Gen2 reference patterns.

## Amplify Gen2 Patterns
- Use `@aws-amplify/backend` for all backend definitions.
- Define resources in separate files under `amplify/` directory.
- Import and combine in `amplify/backend.ts`.
- Use CDK constructs for advanced AWS service integrations.
- Follow Gen2 documentation: https://docs.amplify.aws/

## Emergency Procedures
- If sandbox deployment fails, check AWS CloudFormation stack status.
- For build failures, check `dist/` directory and Vite build logs.
- If email sending breaks, verify SES configuration and sending limits.
- For Lambda errors, check CloudWatch logs: `aws logs tail /aws/lambda/<function-name> --profile elevator-robot.com`.
- If authentication issues occur, verify Amplify Auth configuration.

## Common Issues & Solutions
- **Vite build fails**: Clear `node_modules` and reinstall with `npm ci`.
- **Type errors**: Ensure all dependencies are up to date and types are installed.
- **Tailwind not applying**: Check `tailwind.config.js` and imported CSS files.
- **Amplify Gen2 errors**: Verify using Gen2 syntax, not Gen1.
- **AWS profile issues**: Ensure `elevator-robot.com` profile is configured correctly.
- **Lambda permissions**: Check IAM roles in CloudFormation console.

## Brand Guidelines
- "Elevator Robot" name and logos are protected trademarks.
- Always capitalize "Elevator Robot" (not "elevator robot" or "ElevatorRobot").
- Use CC BY-NC 4.0 license for open source code.
- Require attribution for any use of the codebase.
- Commercial use requires explicit permission.
- Link back to elevatorrobot.com in any derived works.
