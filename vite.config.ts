import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Terminal from 'vite-plugin-terminal';

export default defineConfig({
  plugins: [
    react(),
    Terminal({
      console: 'terminal', // Redirect console logs to the terminal
      output: ['terminal', 'console'], // Optionally log to both terminal and browser console
    }),
  ],
});
