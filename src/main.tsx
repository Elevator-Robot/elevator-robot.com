import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
// import { Amplify } from 'aws-amplify';
// import awsconfig from '../amplify_outputs.json';

// Temporary configuration for build - actual Amplify config will be added later
// Amplify.configure(awsconfig);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
