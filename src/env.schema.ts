import { z } from "zod";

/**
 * Server-side environment variables schema
 * These are NOT exposed to the browser and can contain secrets
 */
export const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Core site URLs - required for proper deployment
  SITE_URL: z.string().url().optional(),
  
  // Movement/Campaign features that might need server-side secrets
  ENABLE_FORMS: z.enum(["true", "false"]).default("false"),
  HCAPTCHA_SECRET: z.string().optional(), // Required only if ENABLE_FORMS=true
  
  // Newsletter/Email service secrets (server-only)
  MAILCHIMP_API_KEY: z.string().optional(),
  CONVERTKIT_API_SECRET: z.string().optional(),
  
  // Payment processing secrets (server-only)
  STRIPE_SECRET_KEY: z.string().optional(),
  PAYPAL_SECRET: z.string().optional(),
}).refine(
  (data) => {
    // Conditional validation: if forms are enabled, require HCAPTCHA_SECRET
    if (data.ENABLE_FORMS === "true" && !data.HCAPTCHA_SECRET) {
      return false;
    }
    return true;
  },
  {
    message: "HCAPTCHA_SECRET is required when ENABLE_FORMS=true",
    path: ["HCAPTCHA_SECRET"],
  }
);

/**
 * Public environment variables schema
 * These ARE exposed to the browser - only put public data here
 */
export const PublicEnvSchema = z.object({
  // Base configuration
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:4321"),
  PUBLIC_PRODUCTION_URL: z.string().url().optional(),
  PUBLIC_STAGING_URL: z.string().url().optional(),
  
  // Site metadata
  PUBLIC_SITE_NAME: z.string().default("Movement Site"),
  PUBLIC_SITE_TAGLINE: z.string().default("Building power for change"),
  PUBLIC_SITE_DESCRIPTION: z.string().default("A progressive movement site focused on organizing and action"),
  PUBLIC_AUTHOR_NAME: z.string().default("Your Organization"),
  
  // Contact and social
  PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
  PUBLIC_TWITTER_HANDLE: z.string().optional(),
  
  // Feature flags (default to enabled for movement features)
  PUBLIC_FEATURE_UPDATES: z.enum(["true", "false"]).default("true"),
  PUBLIC_FEATURE_STORIES: z.enum(["true", "false"]).default("true"),
  PUBLIC_FEATURE_EVENTS: z.enum(["true", "false"]).default("true"),
  PUBLIC_FEATURE_DARKMODE: z.enum(["true", "false"]).default("true"),
  PUBLIC_FEATURE_NEWSLETTER: z.enum(["true", "false"]).default("true"),
  PUBLIC_FEATURE_DONATIONS: z.enum(["true", "false"]).default("true"),
  
  // Campaign/Movement specific actions
  PUBLIC_PRIMARY_ACTION: z.string().default("Take Action"),
  PUBLIC_PRIMARY_ACTION_URL: z.string().default("/action"),
  PUBLIC_DONATE_URL: z.string().default("/donate"),
  
  // Analytics (public write keys only, never secrets)
  PUBLIC_ANALYTICS: z.enum(["plausible", "matomo", "google", "none"]).default("none"),
  PUBLIC_ANALYTICS_DOMAIN: z.string().optional(), // For Plausible
  PUBLIC_ANALYTICS_WRITE_KEY: z.string().optional(), // Generic analytics key
  PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(), // GA4 measurement ID
  
  // Environment detection
  PUBLIC_ENVIRONMENT: z.enum(["development", "staging", "production"]).optional(),
  
  // Deployment context (set by Netlify/Vercel)
  PUBLIC_DEPLOY_CONTEXT: z.enum([
    "production", 
    "deploy-preview", 
    "branch-deploy"
  ]).optional(),
}).refine(
  (data) => {
    // Conditional validation: if analytics is enabled, require appropriate keys
    if (data.PUBLIC_ANALYTICS === "plausible" && !data.PUBLIC_ANALYTICS_DOMAIN) {
      return false;
    }
    if (data.PUBLIC_ANALYTICS === "google" && !data.PUBLIC_GOOGLE_ANALYTICS_ID) {
      return false;
    }
    return true;
  },
  {
    message: "Analytics configuration incomplete for selected provider",
    path: ["PUBLIC_ANALYTICS"],
  }
);

// Export types for use in other files
export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export type PublicEnv = z.infer<typeof PublicEnvSchema>;