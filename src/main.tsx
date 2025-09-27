import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';

// Configure Amplify
// In production, amplify_outputs.json is generated during deployment and copied to public directory
// For local development, run: npx ampx sandbox --outputs-format json --outputs-out-dir .
async function configureAmplify() {
  try {
    // Try to fetch the config file from public directory
    const response = await fetch('/amplify_outputs.json');
    if (response.ok) {
      const awsconfig = await response.json();
      
      // Check if it's a placeholder error file
      if (awsconfig.error) {
        throw new Error('Configuration placeholder found - backend not properly deployed');
      }
      
      Amplify.configure(awsconfig);
      console.log('✅ Amplify configured successfully with amplify_outputs.json');
      return true;
    } else {
      throw new Error('Configuration file not found');
    }
  } catch (error) {
    console.warn('⚠️  amplify_outputs.json not found or invalid');
    
    // Try to use environment variables as fallback (for production builds)
    if (import.meta.env.VITE_AWS_REGION && import.meta.env.VITE_AWS_API_ENDPOINT) {
      const config = {
        aws_project_region: import.meta.env.VITE_AWS_REGION,
        aws_appsync_graphqlEndpoint: import.meta.env.VITE_AWS_API_ENDPOINT,
        aws_appsync_region: import.meta.env.VITE_AWS_REGION,
        aws_appsync_authenticationType: "API_KEY",
        aws_appsync_apiKey: import.meta.env.VITE_AWS_API_KEY,
      };
      
      Amplify.configure(config);
      console.log('✅ Amplify configured successfully with environment variables');
      return true;
    }
    
    console.warn('To fix the contact form:');
    console.warn('1. For development: Run "npx ampx sandbox --outputs-format json --outputs-out-dir . && cp amplify_outputs.json public/" to create a local backend');
    console.warn('2. For production: Ensure backend is properly deployed and amplify_outputs.json is generated');
    console.warn('3. Contact form will not work without proper AWS configuration');
    return false;
  }
}

// Initialize Amplify configuration and render app
configureAmplify().then((configured) => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // If Amplify is not configured, show a warning in the app
  if (!configured) {
    console.error('❌ Amplify not configured - contact form will not work');
  }
});
