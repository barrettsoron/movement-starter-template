// Site Configuration - Movement Starter Template
// This file centralizes all site configuration for rapid deployment

export const siteConfig = {
  // Basic site metadata
  name: import.meta.env.PUBLIC_SITE_NAME || 'Movement Site', // TEMPLATE: Replace with your site name
  tagline: import.meta.env.PUBLIC_SITE_TAGLINE || 'Building power for change', // TEMPLATE: Your campaign tagline
  description: import.meta.env.PUBLIC_SITE_DESCRIPTION || 'A progressive movement site focused on organizing and action', // TEMPLATE: Your site description
  author: import.meta.env.PUBLIC_AUTHOR_NAME || 'Your Organization', // TEMPLATE: Your organization name
  
  // URLs and domains
  baseUrl: import.meta.env.PUBLIC_BASE_URL || 'http://localhost:4321',
  productionUrl: import.meta.env.PUBLIC_PRODUCTION_URL || 'https://yoursite.ca', // TEMPLATE: Replace with your domain
  stagingUrl: import.meta.env.PUBLIC_STAGING_URL || 'https://staging.yoursite.ca', // TEMPLATE: Replace with your staging domain
  
  // Contact and social
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || 'hello@yoursite.ca', // TEMPLATE: Your contact email
  twitter: import.meta.env.PUBLIC_TWITTER_HANDLE || '', // TEMPLATE: Your Twitter/X handle (optional)
  
  // Features (toggle on/off)
  features: {
    updates: import.meta.env.PUBLIC_FEATURE_UPDATES !== 'false',
    stories: import.meta.env.PUBLIC_FEATURE_STORIES !== 'false',
    events: import.meta.env.PUBLIC_FEATURE_EVENTS !== 'false',
    darkMode: import.meta.env.PUBLIC_FEATURE_DARKMODE !== 'false',
    newsletter: import.meta.env.PUBLIC_FEATURE_NEWSLETTER !== 'false',
    donations: import.meta.env.PUBLIC_FEATURE_DONATIONS !== 'false',
    forms: import.meta.env.PUBLIC_FEATURE_FORMS !== 'false',
    signup: import.meta.env.PUBLIC_FEATURE_SIGNUP !== 'false',
    volunteer: import.meta.env.PUBLIC_FEATURE_VOLUNTEER !== 'false',
  },
  
  // Campaign/Movement specific
  campaign: {
    primaryAction: import.meta.env.PUBLIC_PRIMARY_ACTION || 'Take Action', // TEMPLATE: Your main CTA text
    primaryActionUrl: import.meta.env.PUBLIC_PRIMARY_ACTION_URL || '/action', // TEMPLATE: Your main CTA link
    donateUrl: import.meta.env.PUBLIC_DONATE_URL || '/donate', // TEMPLATE: Your donation page URL
  },
  
  // Forms configuration
  forms: {
    // TEMPLATE: Configure your form endpoints and settings
    endpoints: {
      signup: import.meta.env.PUBLIC_FORMS_SIGNUP_ENDPOINT || '/api/forms/signup',
      volunteer: import.meta.env.PUBLIC_FORMS_VOLUNTEER_ENDPOINT || '/api/forms/volunteer',
      newsletter: import.meta.env.PUBLIC_FORMS_NEWSLETTER_ENDPOINT || '/api/forms/newsletter',
      contact: import.meta.env.PUBLIC_FORMS_CONTACT_ENDPOINT || '/api/forms/contact',
      petition: import.meta.env.PUBLIC_FORMS_PETITION_ENDPOINT || '/api/forms/petition',
    },
    cache: {
      enabled: import.meta.env.PUBLIC_FORMS_CACHE !== 'false',
      ttlMs: parseInt(import.meta.env.PUBLIC_FORMS_CACHE_TTL) || 60 * 60 * 1000, // 1 hour default
      storageKey: import.meta.env.PUBLIC_FORMS_CACHE_KEY || 'movement_form_cache',
    },
    validation: {
      enableClientSide: import.meta.env.PUBLIC_FORMS_CLIENT_VALIDATION !== 'false',
      enableServerSide: import.meta.env.PUBLIC_FORMS_SERVER_VALIDATION !== 'false',
    },
    security: {
      enableCSRF: false, // Disabled - public forms don't need CSRF protection
      enableRateLimit: import.meta.env.PUBLIC_FORMS_RATE_LIMIT !== 'false',
      rateLimitPerMinute: parseInt(import.meta.env.PUBLIC_FORMS_RATE_LIMIT_PER_MINUTE) || 5,
    },
    // TEMPLATE: Customize success/error pages
    redirects: {
      successPage: import.meta.env.PUBLIC_FORMS_SUCCESS_PAGE || '/thanks',
      errorPage: import.meta.env.PUBLIC_FORMS_ERROR_PAGE || '/error',
    },
  },
  
  // Navigation structure
  navigation: {
    main: [
      { label: 'Home', href: '/', show: true },
      { label: 'About', href: '/about', show: true },
      { label: 'Events', href: '/events', show: 'features.events' },
      { label: 'Updates', href: '/updates', show: 'features.updates' },
      { label: 'Join Us', href: '/signup', show: 'features.signup' },
      { label: 'Volunteer', href: '/volunteer', show: 'features.volunteer' },
      { label: 'Take Action', href: '/action', show: true, highlight: true },
    ],
    footer: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Accessibility', href: '/accessibility-statement' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  
  // Environment detection
  isProduction: import.meta.env.MODE === 'production' && import.meta.env.PUBLIC_ENVIRONMENT !== 'staging',
  isStaging: import.meta.env.PUBLIC_ENVIRONMENT === 'staging',
  isDevelopment: import.meta.env.DEV || import.meta.env.PUBLIC_ENVIRONMENT === 'development',
}

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature) {
  if (typeof feature === 'string' && feature.startsWith('features.')) {
    const featureName = feature.split('.')[1]
    return siteConfig.features[featureName] === true
  }
  return feature === true
}

// Helper to get environment-specific URL
export function getSiteUrl() {
  if (siteConfig.isProduction && !siteConfig.isStaging) {
    return siteConfig.productionUrl
  }
  if (siteConfig.isStaging) {
    return siteConfig.stagingUrl
  }
  return siteConfig.baseUrl
}