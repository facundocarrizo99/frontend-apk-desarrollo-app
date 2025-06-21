// This file contains environment-specific settings
// You can replace these values at build time or use environment variables

// Default environment (can be overridden by EXPO_PUBLIC_ENV)
type Environment = 'development' | 'staging' | 'production';
const ENV = (process.env.EXPO_PUBLIC_ENV || 'development') as Environment;

// API Configuration
const API_URLS = {
  development: 'http://localhost:3000/api',
  staging: 'https://api.staging.cocinando.com/api',
  production: 'https://api.cocinando.com/api',
};

// Feature flags
const FEATURE_FLAGS = {
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: ENV === 'production',
  ENABLE_LOGGING: ENV !== 'production',
};

// App configuration
const APP_CONFIG = {
  // App version (from package.json)
  VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  // Build number (for app stores)
  BUILD_NUMBER: process.env.EXPO_PUBLIC_BUILD_NUMBER || '1',
  // Environment
  ENV,
  // Is development environment
  IS_DEV: ENV === 'development',
  // Is production environment
  IS_PROD: ENV === 'production',
  // API base URL
  API_URL: process.env.EXPO_PUBLIC_API_URL || API_URLS[ENV],
  // Web client ID for OAuth (if using Google/Facebook login)
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID || '',
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  // Sentry DSN for error tracking
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  // Stripe publishable key
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
};

// Log the current environment (only in development)
if (APP_CONFIG.IS_DEV) {
  console.log('App Config:', APP_CONFIG);
}

export { APP_CONFIG, FEATURE_FLAGS };
export default APP_CONFIG;
