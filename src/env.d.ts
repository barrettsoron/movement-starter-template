/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * TypeScript definitions for environment variables
 * These must match the schema definitions in env.schema.ts
 */
interface ImportMetaEnv {
  // Base configuration
  readonly PUBLIC_BASE_URL?: string;
  readonly PUBLIC_PRODUCTION_URL?: string;
  readonly PUBLIC_STAGING_URL?: string;
  
  // Site metadata
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_TAGLINE?: string;
  readonly PUBLIC_SITE_DESCRIPTION?: string;
  readonly PUBLIC_AUTHOR_NAME?: string;
  
  // Contact and social
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_TWITTER_HANDLE?: string;
  
  // Feature flags
  readonly PUBLIC_FEATURE_UPDATES?: "true" | "false";
  readonly PUBLIC_FEATURE_STORIES?: "true" | "false";
  readonly PUBLIC_FEATURE_EVENTS?: "true" | "false";
  readonly PUBLIC_FEATURE_DARKMODE?: "true" | "false";
  readonly PUBLIC_FEATURE_NEWSLETTER?: "true" | "false";
  readonly PUBLIC_FEATURE_DONATIONS?: "true" | "false";
  
  // Campaign/Movement actions
  readonly PUBLIC_PRIMARY_ACTION?: string;
  readonly PUBLIC_PRIMARY_ACTION_URL?: string;
  readonly PUBLIC_DONATE_URL?: string;
  
  // Analytics (public keys only)
  readonly PUBLIC_ANALYTICS?: "plausible" | "matomo" | "google" | "none";
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly PUBLIC_ANALYTICS_WRITE_KEY?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  
  // Environment detection
  readonly PUBLIC_ENVIRONMENT?: "development" | "staging" | "production";
  readonly PUBLIC_DEPLOY_CONTEXT?: "production" | "deploy-preview" | "branch-deploy";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Node.js process environment variables (server-side only)
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "test" | "production";
    SITE_URL?: string;
    
    // Movement/Campaign features
    ENABLE_FORMS?: "true" | "false";
    HCAPTCHA_SECRET?: string;
    
    // Email service secrets
    MAILCHIMP_API_KEY?: string;
    CONVERTKIT_API_SECRET?: string;
    
    // Payment processing secrets
    STRIPE_SECRET_KEY?: string;
    PAYPAL_SECRET?: string;
  }
}