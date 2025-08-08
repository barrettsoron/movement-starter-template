# Deployment Environment Configuration

This document explains how environment variables are configured across different deployment contexts in the Movement Starter Template.

## Deploy Types Overview

The project supports 5 different deployment environments with distinct configurations:

| Environment | Branch/Context | Purpose | Feature Set |
|-------------|----------------|---------|-------------|
| **Production** | `main` | Live site for users | All features enabled |
| **Staging** | `staging` | Pre-production testing | All features enabled + staging branding |
| **Development** | `dev` | Development branch testing | Most features (no donations/newsletter) |
| **Branch Deploy** | Feature branches | Feature testing | Minimal features |
| **Deploy Preview** | Pull requests | PR review | Conservative feature set |

## Environment Variable Configuration

### Production (`main` branch)
- **URL**: `https://yoursite.com`
- **Features**: All enabled (donations, newsletter, events, etc.)
- **Branding**: Production site name
- **Purpose**: Live site serving actual users

```toml
PUBLIC_ENVIRONMENT = "production"
PUBLIC_FEATURE_UPDATES = "true"
PUBLIC_FEATURE_STORIES = "true"
PUBLIC_FEATURE_EVENTS = "true"
PUBLIC_FEATURE_DARKMODE = "true"
PUBLIC_FEATURE_NEWSLETTER = "true"
PUBLIC_FEATURE_DONATIONS = "true"
PUBLIC_BASE_URL = "https://yoursite.com"
```

### Staging (`staging` branch)  
- **URL**: `https://staging--yoursite.netlify.app`
- **Features**: All enabled for comprehensive testing
- **Branding**: `[STAGING]` suffix for clear identification
- **Purpose**: Final testing before production deployment

```toml
PUBLIC_ENVIRONMENT = "staging"
PUBLIC_SITE_NAME = "Movement Site [STAGING]"
PUBLIC_BASE_URL = "https://staging--yoursite.netlify.app"
# All features enabled for testing
```

### Development (`dev` branch)
- **Features**: Core features enabled, sensitive features disabled
- **Branding**: `[DEV]` suffix
- **Purpose**: Development branch integration testing
- **Disabled**: Newsletter signup, donation processing

```toml
PUBLIC_ENVIRONMENT = "development"
PUBLIC_SITE_NAME = "Movement Site [DEV]"
PUBLIC_FEATURE_NEWSLETTER = "false"
PUBLIC_FEATURE_DONATIONS = "false"
```

### Branch Deploy (feature branches)
- **Features**: Minimal feature set for focused testing
- **Branding**: `[PREVIEW]` suffix  
- **Purpose**: Feature branch testing
- **Disabled**: Events, newsletter, donations

```toml
PUBLIC_ENVIRONMENT = "preview"
PUBLIC_SITE_NAME = "Movement Site [PREVIEW]"
PUBLIC_FEATURE_EVENTS = "false"
PUBLIC_FEATURE_NEWSLETTER = "false"
PUBLIC_FEATURE_DONATIONS = "false"
```

### Deploy Preview (Pull Requests)
- **Features**: Conservative feature set for code review
- **Branding**: `[PR PREVIEW]` suffix
- **Purpose**: Pull request review and testing
- **Focus**: Core content features only

```toml
PUBLIC_ENVIRONMENT = "preview"
PUBLIC_SITE_NAME = "Movement Site [PR PREVIEW]"
PUBLIC_FEATURE_EVENTS = "false"
PUBLIC_FEATURE_NEWSLETTER = "false"
PUBLIC_FEATURE_DONATIONS = "false"
```

## Local Development

For local development, copy `.env.example` to `.env.local` and customize:

```bash
cp .env.example .env.local
```

Key local variables:
```bash
PUBLIC_BASE_URL=http://localhost:4321
PUBLIC_SITE_NAME=Your Local Site Name
PUBLIC_ENVIRONMENT=development
```

## Environment Variable Categories

### Core Configuration
- `PUBLIC_BASE_URL` - Site URL for the current environment
- `PUBLIC_SITE_NAME` - Site name with environment indicator
- `PUBLIC_ENVIRONMENT` - Environment identifier

### Feature Flags
Control which site sections appear:
- `PUBLIC_FEATURE_UPDATES` - News/updates section
- `PUBLIC_FEATURE_STORIES` - Personal stories section
- `PUBLIC_FEATURE_EVENTS` - Events listing
- `PUBLIC_FEATURE_NEWSLETTER` - Newsletter signup
- `PUBLIC_FEATURE_DONATIONS` - Donation functionality

### Site Metadata
- `PUBLIC_SITE_TAGLINE` - Site description
- `PUBLIC_AUTHOR_NAME` - Organization name
- `PUBLIC_CONTACT_EMAIL` - Contact information

### Campaign Actions
- `PUBLIC_PRIMARY_ACTION` - Main call-to-action text
- `PUBLIC_PRIMARY_ACTION_URL` - Main CTA link
- `PUBLIC_DONATE_URL` - Donation page link

## Customization Guidelines

### Adding New Environment Variables

1. **Add to `.env.example`** with commented examples
2. **Update `netlify.toml`** for environment-specific values
3. **Use in `site.config.js`** with fallback defaults
4. **Document here** with purpose and usage

### Feature Flag Pattern

```javascript
// site.config.js
features: {
  newFeature: import.meta.env.PUBLIC_FEATURE_NEW !== 'false',
}
```

```toml
# netlify.toml
PUBLIC_FEATURE_NEW = "true"  # or "false" to disable
```

### Environment-Specific URLs

```javascript
// Automatically selects correct URL based on environment
export function getSiteUrl() {
  if (siteConfig.isProduction && !siteConfig.isStaging) {
    return siteConfig.productionUrl
  }
  if (siteConfig.isStaging) {
    return siteConfig.stagingUrl  
  }
  return siteConfig.baseUrl
}
```

## Security Considerations

- **Only PUBLIC_ variables** are exposed to the browser
- **Never commit** actual `.env.local` files
- **Use public keys only** for client-side services
- **Keep secrets** in Netlify environment variables without PUBLIC_ prefix

## Development Workflow

### Daily Development Process

#### 🚀 Starting New Work
Always start new features from the `dev` branch:

```bash
# Switch to dev and get latest changes
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# Test locally with `npm run dev`

# Push feature branch (creates preview deploy)
git push -u origin feature/your-feature-name
```

#### 🧪 Promote to Development Testing
```bash
# Switch to dev branch
git checkout dev
git pull origin dev

# Merge your feature
git merge feature/your-feature-name

# Push to dev (triggers dev deploy)
git push origin dev
```

#### 🎭 Promote to Staging Review
```bash
# Switch to staging
git checkout staging
git pull origin staging

# Merge dev branch (preserves history)
git merge --no-ff dev

# Push to staging (triggers staging deploy)
git push origin staging
```

#### 🌟 Release to Production
```bash
# Switch to main
git checkout main  
git pull origin main

# Merge staging (preserves history)
git merge --no-ff staging

# Push to production (triggers production deploy)
git push origin main
```

### Environment Testing Guidelines

| Environment | Test Focus | What to Check |
|-------------|------------|---------------|
| **Local** | Development & debugging | Basic functionality, styling |
| **Dev** | Feature integration | Multi-feature interactions, team feedback |
| **Staging** | Pre-production validation | Full feature set, real-world scenarios |
| **Production** | Live monitoring | User analytics, error monitoring |

## Troubleshooting

### Branch Out of Sync
```bash
# Reset dev to match main
git checkout dev
git reset --hard origin/main
git push origin dev --force-with-lease

# Reset staging to match main
git checkout staging  
git reset --hard origin/main
git push origin staging --force-with-lease
```

### Failed Deployment
1. Check Netlify deploy logs
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Check package.json dependencies

### Environment Variables Not Working
1. Verify `PUBLIC_` prefix
2. Check Netlify dashboard settings
3. Remember: netlify.toml overrides dashboard

## Quick Reference

### Common Commands
```bash
# Start new feature
git checkout dev && git checkout -b feature/name

# Promote dev → staging
git checkout staging && git merge --no-ff dev && git push

# Promote staging → production  
git checkout main && git merge --no-ff staging && git push
```

### Environment URLs
- **Production**: `https://yoursite.com`
- **Staging**: `https://staging--yoursite.netlify.app`  
- **Dev**: `https://dev--yoursite.netlify.app`
- **Feature Branch**: `https://branch-name--yoursite.netlify.app`

## Deployment Checklist

Before deploying to a new environment:

- [ ] Update environment URLs in `netlify.toml`
- [ ] Set appropriate feature flags for environment
- [ ] Test with staging environment first
- [ ] Verify environment-specific branding appears
- [ ] Confirm sensitive features are disabled in non-production
- [ ] Follow the promotion workflow (never skip environments)