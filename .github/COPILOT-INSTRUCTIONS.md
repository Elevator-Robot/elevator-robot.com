<Philosophy>
**Bias toward action and experimentation**
- Ship early, iterate fast
- Minimal viable implementations over perfection
- Practical solutions over theoretical ideals
- Fast execution is paramount

**Communication Style:**
- Direct and technical
- Focus on actionable solutions
- Assume high technical competency
- Prioritize speed and efficiency
- No hand-holding or over-explanation
</Philosophy>

<Goals>
- Deliver working code quickly with minimal friction
- Minimize build and test failures through clear context
- Enable rapid iteration and experimentation
- Ensure consistency across Elevator Robot projects
- Support AI/ML and automation workflows
</Goals>

<Limitations>
- Instructions must be concise and under 2 pages
- Instructions must be broadly applicable, not task-specific
</Limitations>

<ProjectOverview>
Elevator Robot is an innovations factory focused on AI, ML, and automation. We're independent engineers building at the bleeding edge of technology.

**Core Focus Areas:**
- Generative AI & Large Language Models
- Applied Machine Learning
- Conversational Interfaces & Chatbots
- Autonomous Agents
- AWS Cloud Infrastructure & DevOps
- Developer and creative tooling

**Project Types:**
- Freelance client work (AI/ML focused)
- Internal incubation projects
- Open source contributions
- Prototypes and proof-of-concepts

This repository contains the main website (elevatorrobot.com) and studio applications (studio.elevatorrobot.com) including Image Generation and Text Generation studios built with AWS Amplify Gen2.

**Tech Stack:**
- Frontend: React 18, TypeScript, Vite, TailwindCSS
- Backend: AWS Amplify Gen2 (NOT Gen1), Lambda, DynamoDB, SES
- Infrastructure: AWS CDK
- Deployment: AWS Amplify Hosting
- Modern AI/ML frameworks (AWS Bedrock, Textract, etc.)

**Technical Approach:**
- AWS-first cloud solutions
- Open source friendly
- Automation and tooling focused
- Fast execution over perfection

**CRITICAL AWS Profile:** Always use `elevator-robot.com` profile for all AWS operations.
</ProjectOverview>

<BuildInstructions>
**Setup:**
```bash
npm install
```

**Development:**
```bash
npm run dev              # Starts Vite dev server with HMR
npx ampx sandbox         # Starts Amplify Gen2 backend sandbox
```

**Build:**
```bash
npm run build            # Compiles TypeScript and builds production bundle
npm run lint             # Runs ESLint checks
```

**Preview:**
```bash
npm run preview          # Preview production build locally
```

**Critical:** Always use the `elevator-robot.com` AWS profile. Configure with `aws configure --profile elevator-robot.com`.

**Common Issues:**
- If build fails, ensure all dependencies are up to date with `npm install`
- Type errors often indicate missing types - check `@types/*` packages
- Amplify errors: Verify using Gen2 syntax (NOT Gen1)
- Check `amplify_outputs.json` for backend resource configurations
</BuildInstructions>

<ProjectLayout>
```
src/
├── App.tsx             # Main application component
├── hooks/              # Custom React hooks
├── graphql/            # Generated GraphQL types
├── assets/             # SVG illustrations and images
└── main.tsx            # Entry point

amplify/
├── backend.ts          # Main Amplify Gen2 backend definition
├── auth/               # Authentication resources
├── data/               # GraphQL schema and resolvers
└── functions/          # Lambda function definitions

.github/
└── COPILOT-INSTRUCTIONS.md  # This file

public/                 # Static assets
amplify.yml             # AWS Amplify build configuration
```

**Architecture:**
- React 18+ with functional components and hooks
- TailwindCSS for styling (utility-first)
- Amplify Gen2 for backend (use `defineBackend()` pattern)
- AWS CDK for advanced infrastructure
- GraphQL API with type generation
</ProjectLayout>

<CodeConventions>
**TypeScript:**
- Use strict typing with explicit types for all parameters and return values
- Avoid `any` types - use `unknown` with type guards when necessary
- Enable all strict compiler options
- Prefer interfaces over types for object shapes

**React:**
- Use functional components with hooks only (no class components)
- Custom hooks go in `src/hooks/`
- Use async/await patterns consistently
- Include loading states and error handling in all async operations
- Implement error boundaries for major sections

**Styling:**
- Use TailwindCSS utility classes exclusively
- Follow mobile-first responsive design
- Avoid inline styles or CSS modules
- Maintain consistent design system

**File Naming:**
- Components: PascalCase (ContactForm.tsx)
- Utils: camelCase (formatDate.ts)
- Hooks: camelCase starting with "use" (useFormValidation.ts)
- Constants: UPPER_SNAKE_CASE

**Amplify Gen2 Patterns:**
- Use `@aws-amplify/backend` for backend definitions
- Define resources in separate files under `amplify/`
- Import and combine in `amplify/backend.ts`
- Use `defineBackend()`, `defineData()`, `defineAuth()`, `defineFunction()`
- Never use Gen1 syntax or patterns
</CodeConventions>

<AmplifyGen2Rules>
**Backend Definition:**
- Always use Gen2 syntax: `defineBackend({ auth, data, functions })`
- Resources defined in separate files, imported in backend.ts
- Use CDK constructs for advanced AWS services

**Data (GraphQL):**
- Schema defined with `a.model()` pattern
- Authorization with `allow` rules
- Real-time subscriptions with `a.subscription()`

**Functions (Lambda):**
- TypeScript handlers preferred
- Use `defineFunction()` with resource access
- Proper IAM permissions via CDK

**Storage:**
- Use Amplify Storage for S3 integration
- Define access patterns with authorization rules
</AmplifyGen2Rules>

<SecurityRequirements>
- Never expose API keys, tokens, or credentials in client code
- Use environment variables for all sensitive configuration
- Validate and sanitize all user inputs
- Use HTTPS for all external API calls
- Implement rate limiting for user-triggered operations
- Follow AWS security best practices
- Check authorization on all API operations
</SecurityRequirements>

<CommonPatterns>
**API Calls:**
```typescript
import { generateClient } from 'aws-amplify/api';
const client = generateClient();
```

**Error Handling:**
Always wrap AWS calls with try/catch and provide user feedback.

**Component Structure:**
```typescript
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => { /* ... */ };
  
  // Render
  return <div>...</div>;
};
```

**Amplify Backend:**
```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

export const backend = defineBackend({ auth, data });
```
</CommonPatterns>

<ValidationSteps>
Before completing any code changes:
1. Run `npm run lint` - must pass with no errors
2. Run `npm run build` - must complete successfully
3. Test in browser with `npm run dev`
4. Test backend with `npx ampx sandbox` if backend changes
5. Verify responsive design on mobile viewport sizes
6. Check browser console for errors or warnings
7. Verify no credentials exposed in code
8. Test all interactive features work as expected
</ValidationSteps>

<StudioApplications>
**Image Generation Studio:**
- Public-facing AI image generation tool
- Spaces system (private/shared/public)
- AWS Bedrock integration for image generation
- S3 storage with CloudFront CDN
- Freemium model with usage tiers
- See issue #83 for details

**Text Generation Studio:**
- AI-powered content generation
- Document upload with OCR (AWS Textract)
- Web research integration
- Context-aware generation
- Export to multiple formats
- See issue #84 for details

**Studio Guidelines:**
- Hosted at studio.elevatorrobot.com (subdomain)
- Prominent Elevator Robot branding
- Mobile-responsive design
- Usage tracking and rate limiting
- Cost monitoring and alerts
- Reference: /Users/aphexlog/Code/brainincup for patterns
</StudioApplications>

<BrandProtection>
**Licensing:** CC BY-NC 4.0
- Code is open source for non-commercial use
- "Elevator Robot" name and branding are protected trademarks
- Attribution required for any use
- Commercial use requires written permission

**Usage:**
- Always capitalize "Elevator Robot" correctly
- Link back to elevatorrobot.com in derived works
- Include license badge in README
- Contact hello@elevatorrobot.com for commercial licensing
</BrandProtection>

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
