# Development Setup for Contact Form

## Issue: Contact Form "NoCredentials" Error

If you're seeing this error when submitting the contact form:
```
[Error] Error sending message:
NoCredentials: No credentials
```

This means the Amplify backend configuration is missing.

## Solution

### Option 1: Local Development Backend (Recommended)
Run a local Amplify sandbox to create your own backend instance:

```bash
# Install dependencies
npm install

# Start local Amplify backend (requires AWS credentials)
npx ampx sandbox --outputs-format json --outputs-out-dir .

# In another terminal, start the frontend
npm run dev
```

This will:
- Create a local AWS backend with all resources
- Generate `amplify_outputs.json` with your backend configuration
- Allow the contact form to work with your own AWS resources

### Option 2: Use Production Backend
If you have access to the production backend configuration:

1. Ensure `amplify_outputs.json` exists in the project root
2. The file should contain the production GraphQL API endpoints and API keys
3. This file is usually generated during deployment

### Option 3: Mock Development (Testing UI Only)
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

- `src/main.tsx` - Amplify configuration
- `src/App.tsx` - Contact form with GraphQL mutation
- `amplify_outputs.json` - Generated backend configuration (gitignored)
- `amplify/` - Backend resource definitions

## Troubleshooting

1. **"amplify_outputs.json not found"** - Run `npx ampx sandbox` first
2. **AWS credentials not configured** - Run `npx ampx configure profile` 
3. **GraphQL errors** - Check that backend resources are deployed correctly
4. **CORS errors** - Ensure your domain is configured in the backend