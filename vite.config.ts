import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to copy amplify_outputs.json to public directory and dist
    {
      name: 'copy-amplify-outputs',
      buildStart() {
        const sourcePath = resolve(__dirname, 'amplify_outputs.json')
        const publicPath = resolve(__dirname, 'public/amplify_outputs.json')
        
        if (existsSync(sourcePath)) {
          try {
            copyFileSync(sourcePath, publicPath)
            console.log('✅ Copied amplify_outputs.json to public directory')
          } catch (error) {
            console.warn('⚠️  Failed to copy amplify_outputs.json to public:', error)
          }
        } else {
          console.warn('⚠️  amplify_outputs.json not found in root directory')
        }
      },
      writeBundle() {
        // Also copy to dist after build
        const sourcePath = resolve(__dirname, 'amplify_outputs.json')
        const distPath = resolve(__dirname, 'dist/amplify_outputs.json')
        
        if (existsSync(sourcePath)) {
          try {
            copyFileSync(sourcePath, distPath)
            console.log('✅ Copied amplify_outputs.json to dist directory')
          } catch (error) {
            console.warn('⚠️  Failed to copy amplify_outputs.json to dist:', error)
          }
        }
      }
    }
  ],
  // optimizeDeps: {
  //   exclude: ['react-devtools-core']
  // }
})
