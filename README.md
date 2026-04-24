# Elevator Robot

Elevator Robot is a software studio that crafts innovative digital experiences.

## Prerequisites

- **Node.js**: v18.x, v20.x, or v22.x (LTS versions)
  - ⚠️ Node.js v25+ is not yet supported by AWS Amplify CLI
  - Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions: `nvm use 22`
- **AWS Account**: Required for backend deployment
- **AWS CLI**: Configured with `elevator-robot.com` profile

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy Amplify sandbox (backend)
npm run deploy my-sandbox-name

# Or deploy with default name
npm run deploy:default
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run deploy <name>` - Deploy Amplify sandbox with custom name
- `npm run deploy:default` - Deploy Amplify sandbox with default name

## Projects

### [Brain In Cup](https://brainincup.com)
An interactive interface with consciousness.

## License

Licensed under [Creative Commons Attribution-NonCommercial 4.0 International](LICENSE).
