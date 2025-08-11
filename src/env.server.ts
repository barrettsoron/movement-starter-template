import { ServerEnvSchema } from "./env.schema";

/**
 * Server-side environment variables
 * These are validated at build time and NOT exposed to the browser
 * 
 * Use this for:
 * - API secrets and keys
 * - Database connections
 * - Third-party service credentials
 * - Server-only configuration
 */
export const ENV = ServerEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  ENABLE_FORMS: process.env.ENABLE_FORMS,
  HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  CONVERTKIT_API_SECRET: process.env.CONVERTKIT_API_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  PAYPAL_SECRET: process.env.PAYPAL_SECRET,
});

// Helper functions for server-side environment detection
export const isDevelopment = ENV.NODE_ENV === "development";
export const isProduction = ENV.NODE_ENV === "production";
export const isTest = ENV.NODE_ENV === "test";