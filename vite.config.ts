import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Logo.svg', 'background.png'],
      manifest: {
        name: 'Elevator Robot',
        short_name: 'Elevator Robot',
        description: 'A software studio that crafts innovative digital experiences',
        theme_color: '#1a1a2e',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          {
            src: '/Logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
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
