import { PublicEnvSchema } from "./env.schema";

/**
 * Get environment variables from the appropriate source
 * In Node.js (build time): use process.env
 * In browser: use import.meta.env
 */
function getEnv() {
  // Check if we're in Node.js (build-time) or browser
  const isNode = typeof process !== 'undefined' && process.env;
  
  if (isNode) {
    // Build-time: use process.env
    return process.env;
  } else {
    // Runtime: use import.meta.env (available in Vite/Astro)
    return import.meta.env;
  }
}

const env = getEnv();

/**
 * Public environment variables
 * These are validated at build time and EXPOSED to the browser
 * 
 * IMPORTANT: Only put public, non-sensitive data here!
 * - Site configuration and metadata
 * - Feature flags
 * - Public API keys (write-only keys, never secrets)
 * - URLs and domains
 */
export const PUBLIC_ENV = PublicEnvSchema.parse({
  // Base configuration
  PUBLIC_BASE_URL: env.PUBLIC_BASE_URL,
  PUBLIC_PRODUCTION_URL: env.PUBLIC_PRODUCTION_URL,
  PUBLIC_STAGING_URL: env.PUBLIC_STAGING_URL,
  
  // Site metadata
  PUBLIC_SITE_NAME: env.PUBLIC_SITE_NAME,
  PUBLIC_SITE_TAGLINE: env.PUBLIC_SITE_TAGLINE,
  PUBLIC_SITE_DESCRIPTION: env.PUBLIC_SITE_DESCRIPTION,
  PUBLIC_AUTHOR_NAME: env.PUBLIC_AUTHOR_NAME,
  
  // Contact and social
  PUBLIC_CONTACT_EMAIL: env.PUBLIC_CONTACT_EMAIL,
  PUBLIC_TWITTER_HANDLE: env.PUBLIC_TWITTER_HANDLE,
  
  // Feature flags
  PUBLIC_FEATURE_UPDATES: env.PUBLIC_FEATURE_UPDATES,
  PUBLIC_FEATURE_STORIES: env.PUBLIC_FEATURE_STORIES,
  PUBLIC_FEATURE_EVENTS: env.PUBLIC_FEATURE_EVENTS,
  PUBLIC_FEATURE_DARKMODE: env.PUBLIC_FEATURE_DARKMODE,
  PUBLIC_FEATURE_NEWSLETTER: env.PUBLIC_FEATURE_NEWSLETTER,
  PUBLIC_FEATURE_DONATIONS: env.PUBLIC_FEATURE_DONATIONS,
  
  // Campaign/Movement actions
  PUBLIC_PRIMARY_ACTION: env.PUBLIC_PRIMARY_ACTION,
  PUBLIC_PRIMARY_ACTION_URL: env.PUBLIC_PRIMARY_ACTION_URL,
  PUBLIC_DONATE_URL: env.PUBLIC_DONATE_URL,
  
  // Analytics (public keys only)
  PUBLIC_ANALYTICS: env.PUBLIC_ANALYTICS,
  PUBLIC_ANALYTICS_DOMAIN: env.PUBLIC_ANALYTICS_DOMAIN,
  PUBLIC_ANALYTICS_WRITE_KEY: env.PUBLIC_ANALYTICS_WRITE_KEY,
  PUBLIC_GOOGLE_ANALYTICS_ID: env.PUBLIC_GOOGLE_ANALYTICS_ID,
  
  // Environment detection
  PUBLIC_ENVIRONMENT: env.PUBLIC_ENVIRONMENT,
  PUBLIC_DEPLOY_CONTEXT: env.PUBLIC_DEPLOY_CONTEXT,
});

// Helper functions for environment detection
export const isDevelopment = PUBLIC_ENV.PUBLIC_ENVIRONMENT === "development";
export const isStaging = PUBLIC_ENV.PUBLIC_ENVIRONMENT === "staging";  
export const isProduction = PUBLIC_ENV.PUBLIC_ENVIRONMENT === "production";

// Helper to get the appropriate site URL based on environment
export function getSiteUrl(): string {
  if (isProduction && !isStaging && PUBLIC_ENV.PUBLIC_PRODUCTION_URL) {
    return PUBLIC_ENV.PUBLIC_PRODUCTION_URL;
  }
  if (isStaging && PUBLIC_ENV.PUBLIC_STAGING_URL) {
    return PUBLIC_ENV.PUBLIC_STAGING_URL;
  }
  return PUBLIC_ENV.PUBLIC_BASE_URL;
}

// Helper to check if a feature is enabled (handles string boolean conversion)
export function isFeatureEnabled(featureName: keyof typeof PUBLIC_ENV): boolean {
  const value = PUBLIC_ENV[featureName];
  return value !== "false";
}