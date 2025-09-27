# Development Setup for Contact Form

## Issue: Contact Form "NoCredentials" Error

If you're seeing this error when submitting the contact form:
```
[Error] Error sending message:
NoCredentials: No credentials
```

This means the Amplify backend configuration is missing or invalid.

## Solution

### Option 1: Local Development Backend (Recommended)
Run a local Amplify sandbox to create your own backend instance:

```bash
# Install dependencies
npm install

# Start local Amplify backend (requires AWS credentials)
npx ampx sandbox --outputs-format json --outputs-out-dir .

# Copy configuration to public directory for local development
cp amplify_outputs.json public/

# In another terminal, start the frontend
npm run dev
```

This will:
- Create a local AWS backend with all resources
- Generate `amplify_outputs.json` with your backend configuration
- Copy the configuration to the public directory so the frontend can access it
- Allow the contact form to work with your own AWS resources

### Option 2: Use Environment Variables
If you have the production backend configuration, you can set environment variables:

Create a `.env.local` file in the project root:
```
VITE_AWS_REGION=us-east-1
VITE_AWS_API_ENDPOINT=https://your-api-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
VITE_AWS_API_KEY=your-api-key
```

### Option 3: Use Production Backend
If you have access to the production backend configuration:

1. Ensure `amplify_outputs.json` exists in the project root
2. Copy it to the public directory: `cp amplify_outputs.json public/`
3. The file should contain the production GraphQL API endpoints and API keys
4. This file is usually generated during deployment

### Option 4: Mock Development (Testing UI Only)
If you just want to test the UI without backend functionality:

1. The form will show loading states and error handling
2. Check browser console for detailed error messages
3. The form validation and UI interactions will work

## Verification

Once configured correctly, you should see in the browser console:
```
✅ Amplify configured successfully
```

When you submit the contact form, you should see:
```
Sending message with client: [GeneratedClient object]
Form data: {name: "...", email: "...", message: "..."}
Message sent successfully: [response object]
```

## Files Involved

- `src/main.tsx` - Amplify configuration with fallback options
- `src/App.tsx` - Contact form with GraphQL mutation and improved error handling
- `amplify_outputs.json` - Generated backend configuration (gitignored from repo root)
- `public/amplify_outputs.json` - Configuration file for frontend (also gitignored)
- `amplify/` - Backend resource definitions
- `amplify.yml` - Build configuration for production deployment

## Troubleshooting

1. **"amplify_outputs.json not found"** - Run `npx ampx sandbox --outputs-format json --outputs-out-dir . && cp amplify_outputs.json public/`
2. **AWS credentials not configured** - Run `npx ampx configure profile` or set up AWS CLI credentials
3. **GraphQL errors** - Check that backend resources are deployed correctly with `npx ampx sandbox`
4. **CORS errors** - Ensure your domain is configured in the backend
5. **Build fails in production** - Check that `amplify.yml` properly copies configuration files during deployment

## Production Deployment Notes

The `amplify.yml` configuration handles:
- Backend deployment first (generates `amplify_outputs.json`)
- Copying configuration to public directory during frontend build
- Fallback placeholder if configuration is missing
- Proper error handling for missing configuration

If the contact form still doesn't work in production, check the browser console for configuration status messages.