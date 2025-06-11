import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from 'node:url';

const pwaConfig = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "logo2.png", "offline.html"],
  useCredentials: true,
  manifest: {
    name: "PulihHati - Aplikasi Kesehatan Mental",
    short_name: "PulihHati",
    description: "Aplikasi kesehatan mental untuk membantu Anda pulih dan berkembang. Fitur Safe Space, Chatbot AI, dan Daily Tracker.",
    icons: [
      {
        src: "/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/logo2-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/logo2-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon"
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#10b981",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    categories: ["health", "medical", "lifestyle"],
    lang: "id",
    dir: "ltr",
    shortcuts: [
      {
        name: "Safe Space",
        short_name: "Safe Space",
        description: "Berbagi cerita dan pengalaman",
        url: "/safespace",
        icons: [
          {
            src: "/logo2-192x192.png",
            sizes: "192x192"
          }
        ]
      },
      {
        name: "Chatbot",
        short_name: "Chatbot",
        description: "Konsultasi dengan AI",
        url: "/chatbot",
        icons: [
          {
            src: "/logo2-192x192.png",
            sizes: "192x192"
          }
        ]
      },
      {
        name: "Profile",
        short_name: "Profile",
        description: "Kelola profil Anda",
        url: "/profile",
        icons: [
          {
            src: "/logo2-192x192.png",
            sizes: "192x192"
          }
        ]
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
    navigateFallback: '/offline.html',
    navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    runtimeCaching: [
      // Cache for Local Development API
      {
        urlPattern: /^http:\/\/localhost:5000\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache-local',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 // 24 hours
          },
          networkTimeoutSeconds: 10
        }
      },
      // Cache for Production API (Railway)
      {
        urlPattern: /^https:\/\/pulih-hati-backend-production\.up\.railway\.app\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache-railway',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 // 24 hours
          },
          networkTimeoutSeconds: 10
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-stylesheets'
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          }
        }
      }
    ]
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
