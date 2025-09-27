import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';

// Configure Amplify
// In production, amplify_outputs.json is generated during deployment
// For local development, run: npx ampx sandbox --outputs-format json --outputs-out-dir .
async function configureAmplify() {
  try {
    // Fetch the config file at runtime to avoid build-time resolution issues
    const response = await fetch('/amplify_outputs.json');
    if (response.ok) {
      const awsconfig = await response.json();
      Amplify.configure(awsconfig);
      console.log('✅ Amplify configured successfully');
    } else {
      throw new Error('Configuration file not found');
    }
  } catch (error) {
    console.warn('⚠️  amplify_outputs.json not found');
    console.warn('To fix the contact form:');
    console.warn('1. Run "npx ampx sandbox --outputs-format json --outputs-out-dir ." to create a local backend, or');
    console.warn('2. Ensure the backend is deployed and amplify_outputs.json is generated');
    console.warn('3. Contact form will not work without proper AWS configuration');
  }
}

// Initialize Amplify configuration
configureAmplify();


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
