# Movement Starter Template - Pre-Release Todo

## Template Readiness Assessment
**Status**: ✅ READY FOR USE  
**Last Review**: 2025-08-11
**Build Status**: ✅ Passing

## 🚨 Critical Issues (Must Fix Before Using as Template)

### ✅ All Critical Issues Resolved!

### 1. Outdated Configuration References
- [x] Update CLAUDE.md: Change `/src/content/config.ts` to `/src/content.config.mjs`
- [x] Verify all path references in documentation are correct

### 2. External Links in Demo Content
- [x] Update `src/pages/mdx-page.mdx`: Replace "Get this theme on GitHub" link
- [x] Update `src/pages/markdown-page.md`: Replace theme link with Movement Starter Template repo
- [x] Add proper attribution to Accessible Astro Starter while highlighting Movement extensions

### 3. Placeholder URLs Need Clear Markers
- [x] Mark placeholder URLs in `site.config.js` with comments like `// TEMPLATE: Replace with your domain`
- [x] Add template markers to `netlify.toml` placeholder URLs
- [x] Document all placeholder values that need replacement

### 4. Missing Template Setup Instructions
- [x] Create "Template Customization Checklist" section in README
- [x] List all values that must be replaced when creating new project
- [x] Add step-by-step guide for first-time setup

## ⚠️ Minor Issues

### 1. Dependency Documentation
- [ ] Document that Astro provides zod for env.schema.ts
- [ ] Consider explicitly adding zod to package.json for clarity

### 2. Linting Issues
- [x] Fix unused variables in `/src/pages/portfolio/[...page].astro` (lines 39-40)
- [x] Resolve any remaining ESLint warnings (ESLint passes clean)

## ✅ Completed Items
- [x] Consolidated ENVIRONMENTS.md and DEPLOYMENT_ENVIRONMENTS.md
- [x] Removed redundant documentation files
- [x] Formatted all markdown with Prettier
- [x] Verified security (no exposed secrets, proper PUBLIC_ usage)
- [x] Confirmed CSP headers configured properly
- [x] Validated multi-environment deployment system

## 📋 Template Customization Checklist (To Add to README)

When using this template for a new project:

1. **Replace Placeholder Values**
   - [ ] Update `PUBLIC_SITE_NAME` in `.env.local`
   - [ ] Replace `yoursite.com` URLs in `netlify.toml`
   - [ ] Update `site.config.js` default values
   - [ ] Change social preview image in `/public`

2. **Configure Environment**
   - [ ] Copy `.env.example` to `.env.local`
   - [ ] Set up Netlify environment variables
   - [ ] Configure branch protection rules in Git

3. **Customize Content**
   - [ ] Replace demo content in `/src/content/`
   - [ ] Update hero section text
   - [ ] Modify navigation items
   - [ ] Replace logo and branding

4. **Deploy Setup**
   - [ ] Connect to Netlify
   - [ ] Configure staging and dev branches
   - [ ] Set up domain (if custom)
   - [ ] Test deployment workflow

## 🎯 Priority Order

1. **Immediate** (Before commit):
   - Fix configuration file references
   - Add placeholder markers

2. **High** (Before first template use):
   - Create customization checklist
   - Fix external links
   - Update documentation

3. **Medium** (Quality improvements):
   - Fix linting issues
   - Clarify dependencies

## 📝 Notes

- Template security is excellent - no exposed secrets found
- Documentation is comprehensive but needs accuracy fixes
- Multi-environment system is properly configured
- Content collections are well-defined
- Component architecture follows best practices

## Next Steps

1. Address critical issues
2. Test template creation process end-to-end
3. Create example deployment from template
4. Document any additional issues found during testing