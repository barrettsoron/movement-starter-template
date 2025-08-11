#!/usr/bin/env tsx

/**
 * Environment validation script
 * 
 * This script validates all environment variables at build time using the
 * Zod schemas defined in src/env.schema.ts. It will fail the build if any
 * required variables are missing or invalid.
 * 
 * Run with: npm run check:env
 */

import { ENV } from "../src/env.server";
import { PUBLIC_ENV } from "../src/env.public";

console.log("🔍 Validating environment variables...");

try {
  // Validation happens automatically when importing ENV and PUBLIC_ENV
  // because they parse the environment using the Zod schemas
  
  console.log("✅ Server environment variables validated");
  console.log("✅ Public environment variables validated");
  
  // Additional conditional validations
  console.log("\n🔧 Checking conditional requirements...");
  
  // Check analytics configuration
  if (PUBLIC_ENV.PUBLIC_ANALYTICS === "plausible" && !PUBLIC_ENV.PUBLIC_ANALYTICS_DOMAIN) {
    console.error("❌ PUBLIC_ANALYTICS_DOMAIN is required when using Plausible analytics");
    process.exit(1);
  }
  
  if (PUBLIC_ENV.PUBLIC_ANALYTICS === "google" && !PUBLIC_ENV.PUBLIC_GOOGLE_ANALYTICS_ID) {
    console.error("❌ PUBLIC_GOOGLE_ANALYTICS_ID is required when using Google Analytics");
    process.exit(1);
  }
  
  // Check forms configuration
  if (ENV.ENABLE_FORMS === "true" && !ENV.HCAPTCHA_SECRET) {
    console.error("❌ HCAPTCHA_SECRET is required when ENABLE_FORMS=true");
    process.exit(1);
  }
  
  // Validate URLs are properly set for production environments
  if (ENV.NODE_ENV === "production") {
    if (!ENV.SITE_URL && !PUBLIC_ENV.PUBLIC_PRODUCTION_URL) {
      console.warn("⚠️  Neither SITE_URL nor PUBLIC_PRODUCTION_URL is set for production");
      console.warn("   This may cause issues with absolute URLs and SEO");
    }
    
    // Ensure production URLs are HTTPS
    const prodUrl = ENV.SITE_URL || PUBLIC_ENV.PUBLIC_PRODUCTION_URL;
    if (prodUrl && !prodUrl.startsWith("https://")) {
      console.error("❌ Production URLs must use HTTPS for security");
      process.exit(1);
    }
  }
  
  // Check donation configuration for movement sites
  if (PUBLIC_ENV.PUBLIC_FEATURE_DONATIONS === "true") {
    if (PUBLIC_ENV.PUBLIC_DONATE_URL === "/donate") {
      console.warn("⚠️  Using default donate URL '/donate' - consider setting PUBLIC_DONATE_URL to external donation platform");
    }
  }
  
  // Validate email configuration
  if (PUBLIC_ENV.PUBLIC_CONTACT_EMAIL) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(PUBLIC_ENV.PUBLIC_CONTACT_EMAIL)) {
      console.error("❌ PUBLIC_CONTACT_EMAIL must be a valid email address");
      process.exit(1);
    }
  }
  
  console.log("✅ All conditional requirements satisfied");
  
  // Log current configuration for transparency
  console.log("\n📋 Current configuration:");
  console.log(`   Environment: ${ENV.NODE_ENV}`);
  console.log(`   Site: ${PUBLIC_ENV.PUBLIC_SITE_NAME}`);
  console.log(`   Base URL: ${PUBLIC_ENV.PUBLIC_BASE_URL}`);
  console.log(`   Analytics: ${PUBLIC_ENV.PUBLIC_ANALYTICS}`);
  console.log(`   Forms enabled: ${ENV.ENABLE_FORMS}`);
  
  // List enabled features
  const enabledFeatures = Object.entries(PUBLIC_ENV)
    .filter(([key, value]) => key.startsWith("PUBLIC_FEATURE_") && value === "true")
    .map(([key]) => key.replace("PUBLIC_FEATURE_", "").toLowerCase());
  
  if (enabledFeatures.length > 0) {
    console.log(`   Enabled features: ${enabledFeatures.join(", ")}`);
  }
  
  console.log("\n✨ Environment validation completed successfully!");
  
} catch (error) {
  console.error("\n❌ Environment validation failed!");
  
  if (error instanceof Error) {
    // Parse Zod error for more helpful output
    try {
      const zodError = JSON.parse(error.message);
      if (Array.isArray(zodError)) {
        console.error("\nValidation errors:");
        zodError.forEach((err: { path: string[]; message: string }) => {
          console.error(`   • ${err.path.join(".")}: ${err.message}`);
        });
      } else {
        console.error(`\nError: ${error.message}`);
      }
    } catch {
      console.error(`\nError: ${error.message}`);
    }
  }
  
  console.error("\n📖 Check your .env.local file and ensure all required variables are set.");
  console.error("   See .env.example for the complete list of available variables.");
  
  process.exit(1);
}