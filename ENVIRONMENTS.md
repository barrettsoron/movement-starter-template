# Multi-Environment Development & Deployment

This document explains the Movement Starter Template's multi-environment deployment system for safe releases and efficient development.

## Environment Overview

| Environment        | Branch/Context   | URL Pattern                         | Purpose                | Feature Set                             |
| ------------------ | ---------------- | ----------------------------------- | ---------------------- | --------------------------------------- |
| **Production**     | `main`           | `yoursite.com`                      | Live site for users    | All features                            |
| **Staging**        | `staging`        | `staging--yoursite.netlify.app`     | Pre-production testing | All features + staging branding         |
| **Development**    | `dev`            | `dev--yoursite.netlify.app`         | Development testing    | Core features (no donations/newsletter) |
| **Branch Deploy**  | Feature branches | `branch-name--yoursite.netlify.app` | Feature testing        | Minimal features                        |
| **Deploy Preview** | Pull requests    | `pr-123--yoursite.netlify.app`      | PR review              | Conservative features                   |

## Environment Configurations

### Production (`main` branch)

```bash
PUBLIC_ENVIRONMENT="production"
PUBLIC_BASE_URL="https://yoursite.com"
PUBLIC_SITE_NAME="Your Movement Site"
# All features enabled
PUBLIC_FEATURE_UPDATES=true
PUBLIC_FEATURE_STORIES=true
PUBLIC_FEATURE_EVENTS=true
PUBLIC_FEATURE_DARKMODE=true
PUBLIC_FEATURE_NEWSLETTER=true
PUBLIC_FEATURE_DONATIONS=true
```

### Staging (`staging` branch)

```bash
PUBLIC_ENVIRONMENT="staging"
PUBLIC_BASE_URL="https://staging--yoursite.netlify.app"
PUBLIC_SITE_NAME="Movement Site [STAGING]"
# All features enabled for comprehensive testing
```

### Development (`dev` branch)

```bash
PUBLIC_ENVIRONMENT="development"
PUBLIC_SITE_NAME="Movement Site [DEV]"
# Sensitive features disabled
PUBLIC_FEATURE_NEWSLETTER=false  # Prevents test emails
PUBLIC_FEATURE_DONATIONS=false   # Prevents test payments
```

### Preview (Feature branches & PRs)

```bash
PUBLIC_ENVIRONMENT="preview"
PUBLIC_SITE_NAME="Movement Site [PREVIEW]"
# Minimal features for focused testing
PUBLIC_FEATURE_EVENTS=false
PUBLIC_FEATURE_NEWSLETTER=false
PUBLIC_FEATURE_DONATIONS=false
```

## Local Development

Copy `.env.example` to `.env.local` and customize:

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

- `PUBLIC_BASE_URL` - Site URL for current environment
- `PUBLIC_SITE_NAME` - Site name with environment indicator
- `PUBLIC_ENVIRONMENT` - Environment identifier

### Feature Flags

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

## Development Workflow

### 🚀 Start New Feature

```bash
# Always start from dev branch
git checkout dev && git pull origin dev
git checkout -b feature/your-feature-name
# Work locally, test with `npm run dev`
git push -u origin feature/your-feature-name
```

**Result**: Preview deploy at `https://feature-your-feature-name--yoursite.netlify.app`

### 🧪 Promote to Development

```bash
git checkout dev && git pull origin dev
git merge feature/your-feature-name
git push origin dev
# Clean up: git branch -d feature/your-feature-name
```

**Result**: Live at `https://dev--yoursite.netlify.app` for team testing

### 🎭 Promote to Staging

```bash
git checkout staging && git pull origin staging
git merge --no-ff dev
git push origin staging
```

**Result**: Live at `https://staging--yoursite.netlify.app` for final review

### 🌟 Release to Production

```bash
git checkout main && git pull origin main
git merge --no-ff staging
git push origin main
```

**Result**: Live at production URL

### Environment Testing Guidelines

| Environment    | Test Focus                | What to Check                             |
| -------------- | ------------------------- | ----------------------------------------- |
| **Local**      | Development & debugging   | Basic functionality, styling              |
| **Dev**        | Feature integration       | Multi-feature interactions, team feedback |
| **Staging**    | Pre-production validation | Full feature set, real-world scenarios    |
| **Production** | Live monitoring           | User analytics, error monitoring          |

## Customization Guidelines

### Adding Environment Variables

1. Add to `.env.example` with commented examples
2. Update `netlify.toml` for environment-specific values
3. Use in `site.config.js` with fallback defaults
4. Document purpose and usage

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

### Security Considerations

- **Only PUBLIC\_ variables** are exposed to the browser
- **Never commit** actual `.env.local` files
- **Use public keys only** for client-side services
- **Keep secrets** in Netlify environment variables without PUBLIC\_ prefix

## Troubleshooting

### Branch Out of Sync

```bash
# Reset dev to match main
git checkout dev && git reset --hard origin/main && git push origin dev --force-with-lease
# Reset staging to match main
git checkout staging && git reset --hard origin/main && git push origin staging --force-with-lease
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

### Merge Conflicts

```bash
git status              # See conflicted files
# Edit files to resolve conflicts
git add .               # Stage resolved files
git commit              # Complete the merge
```

## Best Practices

- **Branching**: Always create feature branches from `dev`, use descriptive names
- **Deployment**: Never commit directly to `main` or `staging`, always promote through workflow
- **Configuration**: Keep environment-specific settings in `netlify.toml`
- **Documentation**: Document feature flag changes in commit messages

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

### Deployment Checklist

- [ ] Update environment URLs in `netlify.toml`
- [ ] Set appropriate feature flags for environment
- [ ] Test with staging environment first
- [ ] Verify environment-specific branding appears
- [ ] Confirm sensitive features are disabled in non-production
- [ ] Follow promotion workflow (never skip environments)

This multi-environment system ensures safe, reliable deployments while maintaining development velocity.
