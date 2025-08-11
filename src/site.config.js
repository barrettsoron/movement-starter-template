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
  },
  
  // Campaign/Movement specific
  campaign: {
    primaryAction: import.meta.env.PUBLIC_PRIMARY_ACTION || 'Take Action', // TEMPLATE: Your main CTA text
    primaryActionUrl: import.meta.env.PUBLIC_PRIMARY_ACTION_URL || '/action', // TEMPLATE: Your main CTA link
    donateUrl: import.meta.env.PUBLIC_DONATE_URL || '/donate', // TEMPLATE: Your donation page URL
  },
  
  // Navigation structure
  navigation: {
    main: [
      { label: 'Home', href: '/', show: true },
      { label: 'About', href: '/about', show: true },
      { label: 'Stories', href: '/stories', show: 'features.stories' },
      { label: 'Events', href: '/events', show: 'features.events' },
      { label: 'Updates', href: '/updates', show: 'features.updates' },
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