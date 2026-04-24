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
      includeAssets: ['Logo.svg', 'background.png', 'offline.html'],
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
      devOptions: {
        enabled: false, // Disabled in development to prevent offline page issues
        type: 'module'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,webp,jpg,jpeg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api/, /^\/graphql/],
        runtimeCaching: [
          // Cache-first strategy for static assets (JS, CSS, images)
          {
            urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cache-first strategy for custom fonts
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cache Google Fonts
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
          },
          // Network-first strategy for API calls (GraphQL)
          {
            urlPattern: /^https:\/\/.*\.amplifyapp\.com\/graphql$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Network-first for amplify_outputs.json
          {
            urlPattern: /\/amplify_outputs\.json$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'config-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              networkTimeoutSeconds: 5
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
  build: {
    // Enable code splitting and chunk optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'aws-vendor': ['aws-amplify', '@aws-amplify/api-graphql', '@aws-amplify/ui-react'],
          'aws-rum': ['aws-rum-web'],
        },
      },
    },
    // Set chunk size warning limit to 500KB
    chunkSizeWarningLimit: 500,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    css: true,
  },
  // optimizeDeps: {
  //   exclude: ['react-devtools-core']
  // }
})
