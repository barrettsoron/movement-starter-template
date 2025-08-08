# Multi-Environment Development Workflow

This document explains how to use the Movement Starter Template's multi-environment deployment system for efficient development and safe releases.

## Environment Overview

The template supports four deployment environments, each with specific purposes and configurations:

| Environment | Branch | URL Pattern | Purpose |
|-------------|--------|-------------|---------|
| **Production** | `main` | `yoursite.com` | Live site for users |
| **Staging** | `staging` | `staging--yoursite.netlify.app` | Final testing before production |
| **Development** | `dev` | `dev--yoursite.netlify.app` | Active development and feature testing |
| **Preview** | Feature branches | `branch-name--yoursite.netlify.app` | Individual feature testing |

## Environment Configurations

Each environment has different feature sets and branding to distinguish them:

### Production Environment (`main` branch)
```bash
# All features enabled
PUBLIC_FEATURE_UPDATES=true
PUBLIC_FEATURE_STORIES=true  
PUBLIC_FEATURE_EVENTS=true
PUBLIC_FEATURE_DARKMODE=true
PUBLIC_FEATURE_NEWSLETTER=true
PUBLIC_FEATURE_DONATIONS=true

# Production branding
PUBLIC_SITE_NAME="Your Movement Site"
PUBLIC_BASE_URL="https://yoursite.com"
```

### Staging Environment (`staging` branch)
```bash
# All features enabled for testing
PUBLIC_FEATURE_UPDATES=true
PUBLIC_FEATURE_STORIES=true
PUBLIC_FEATURE_EVENTS=true
PUBLIC_FEATURE_DARKMODE=true
PUBLIC_FEATURE_NEWSLETTER=true
PUBLIC_FEATURE_DONATIONS=true

# Staging branding (notice the [STAGING] tag)
PUBLIC_SITE_NAME="Movement Site [STAGING]"
PUBLIC_BASE_URL="https://staging--yoursite.netlify.app"
```

### Development Environment (`dev` branch)
```bash
# Most features enabled, but external integrations disabled
PUBLIC_FEATURE_UPDATES=true
PUBLIC_FEATURE_STORIES=true
PUBLIC_FEATURE_EVENTS=true
PUBLIC_FEATURE_DARKMODE=true
PUBLIC_FEATURE_NEWSLETTER=false  # Disabled to prevent test emails
PUBLIC_FEATURE_DONATIONS=false   # Disabled to prevent test payments

# Development branding
PUBLIC_SITE_NAME="Movement Site [DEV]"
```

### Preview Environment (Feature branches & PRs)
```bash
# Minimal feature set for focused testing
PUBLIC_FEATURE_UPDATES=true
PUBLIC_FEATURE_STORIES=true
PUBLIC_FEATURE_EVENTS=false      # Disabled for simplicity
PUBLIC_FEATURE_DARKMODE=true
PUBLIC_FEATURE_NEWSLETTER=false
PUBLIC_FEATURE_DONATIONS=false

# Preview branding
PUBLIC_SITE_NAME="Movement Site [PREVIEW]"
```

## Development Workflow

### 🚀 Starting New Work

Always start new features from the `dev` branch:

```bash
# Switch to dev and get latest changes
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# Edit files, test locally with `npm run dev`

# Push feature branch (creates preview deploy)
git push -u origin feature/your-feature-name
```

**Result**: Your feature gets a preview URL at `https://feature-your-feature-name--yoursite.netlify.app`

### 🧪 Testing in Development

When your feature is ready for broader testing:

```bash
# Switch to dev branch
git checkout dev
git pull origin dev

# Merge your feature
git merge feature/your-feature-name

# Push to dev (triggers dev deploy)
git push origin dev

# Clean up feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

**Result**: Feature is live at `https://dev--yoursite.netlify.app` for team testing.

### 🎭 Staging Review

When development testing passes, promote to staging:

```bash
# Switch to staging
git checkout staging
git pull origin staging

# Merge dev branch (use --no-ff to preserve history)
git merge --no-ff dev

# Push to staging (triggers staging deploy)
git push origin staging
```

**Result**: Changes are live at `https://staging--yoursite.netlify.app` for final review.

### 🌟 Production Release

When staging review passes, release to production:

```bash
# Switch to main
git checkout main  
git pull origin main

# Merge staging (use --no-ff to preserve history)
git merge --no-ff staging

# Push to production (triggers production deploy)
git push origin main
```

**Result**: Changes are live at your production URL.

### 🔄 Return to Development

After release, switch back to dev for next work cycle:

```bash
# Switch back to dev
git checkout dev

# Pull any changes from main (usually none, but good practice)
git pull origin main
```

## Testing Guidelines

### Local Testing (`npm run dev`)
- **Use for**: Initial development and debugging
- **Test**: Basic functionality, styling, component behavior
- **Environment**: Uses `.env.local` file for configuration

### Development Environment (`dev` branch)
- **Use for**: Feature integration testing
- **Test**: Multi-feature interactions, responsive design
- **Team access**: Share dev URL with team for feedback

### Staging Environment (`staging` branch)
- **Use for**: Pre-production validation
- **Test**: Full feature set, real-world scenarios, performance
- **Stakeholder review**: Share staging URL with non-technical stakeholders

### Production Environment (`main` branch)
- **Use for**: Live user traffic
- **Monitor**: Analytics, user feedback, error monitoring
- **Updates**: Only via staging promotion (never direct commits)

## Environment-Specific Features

### Newsletter Integration
- **Enabled**: Production, Staging
- **Disabled**: Development, Preview
- **Reason**: Prevents accidental test emails to subscribers

### Donation System
- **Enabled**: Production, Staging
- **Disabled**: Development, Preview  
- **Reason**: Prevents test payments and financial confusion

### Events System
- **Enabled**: Production, Staging, Development
- **Disabled**: Preview
- **Reason**: Simplifies preview testing focus

## Troubleshooting

### Branch Out of Sync
If environments get out of sync, use this recovery workflow:

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
1. Check the Netlify deploy logs in the dashboard
2. Verify all environment variables are set correctly
3. Test the build locally: `npm run build`
4. Check for missing dependencies in package.json

### Environment Variables Not Working
1. Verify variables start with `PUBLIC_` prefix
2. Check they're set in Netlify dashboard for each environment
3. Remember: changes to netlify.toml override dashboard settings

### Merge Conflicts
When merging between environments:

```bash
# If merge conflicts occur
git status                    # See conflicted files
# Edit files to resolve conflicts
git add .                     # Stage resolved files
git commit                    # Complete the merge
```

## Best Practices

### 🎯 **Branching**
- Always create feature branches from `dev`
- Use descriptive branch names: `feature/user-login`, `fix/mobile-nav`
- Delete feature branches after merging

### 🚦 **Deployment**
- Never commit directly to `main` or `staging`
- Always promote through the workflow: `dev` → `staging` → `main`
- Test in each environment before promoting

### 🔧 **Configuration**
- Keep environment-specific settings in `netlify.toml`
- Use `.env.local` for local development only
- Document any new environment variables in `.env.example`

### 📝 **Documentation**
- Update this file when adding new environments
- Document feature flag changes in commit messages
- Keep README.md environment URLs current

## Quick Reference

### Common Commands
```bash
# Start new feature
git checkout dev && git checkout -b feature/name

# Promote dev → staging
git checkout staging && git merge --no-ff dev && git push

# Promote staging → production  
git checkout main && git merge --no-ff staging && git push

# Check environment URLs
# Production: https://yoursite.com
# Staging: https://staging--yoursite.netlify.app  
# Dev: https://dev--yoursite.netlify.app
```

### Environment Variable Quick Check
```bash
# See what's deployed in each environment
curl -s https://yoursite.com | grep "ENVIRONMENT"
curl -s https://staging--yoursite.netlify.app | grep "ENVIRONMENT"  
curl -s https://dev--yoursite.netlify.app | grep "ENVIRONMENT"
```

This multi-environment system ensures safe, reliable deployments while maintaining development velocity. Always test thoroughly in each environment before promoting to the next level.