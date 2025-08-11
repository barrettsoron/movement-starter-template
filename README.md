# Movement Starter Template

> A rapidly-deployable, accessibility-first website template for progressive movements and campaigns. Built on [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by [Incluud](https://incluud.dev/).

## Features

- 🌐 **Accessibility-first** - WCAG compliant with skip links, semantic HTML, and keyboard navigation
- ⚡ **Rapid deployment** - Configure via environment variables and deploy in minutes
- 📱 **Fully responsive** - Mobile-first design that works on all devices
- 🎨 **Dark mode** - Automatic theme switching with user preference detection
- 📝 **Content collections** - Stories, Events, and Updates ready to use
- 🔒 **Security headers** - Privacy-focused CSP and security best practices
- 🚀 **Performance optimized** - Static site generation with Astro
- 🌍 **Multi-environment** - Production, staging, and preview deployments

## Quick Start

1. **Use this template**

   ```bash
   git clone https://github.com/barrettsoron/movement-starter-template.git your-project-name
   cd your-project-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your site**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your site details
   ```

4. **Start development**

   ```bash
   npm run dev
   ```

## Configuration

All site configuration is managed through environment variables. Copy `.env.example` to `.env.local` and customize:

- **Site identity** - Name, tagline, description
- **Features** - Toggle stories, events, donations, newsletter
- **URLs** - Production, staging, contact information
- **Actions** - Primary CTAs and donation links

## Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm install && npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard
5. Enable branch deploys for staging

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, styles, fonts
│   ├── components/     # Reusable Astro components
│   ├── content/        # Content collections
│   │   ├── events/     # Event markdown files
│   │   ├── stories/    # Story markdown files
│   │   └── projects/   # Project showcases
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   └── site.config.js  # Central configuration
├── .env.example        # Environment template
└── netlify.toml        # Deployment configuration
```

## Content Collections

### Stories
Personal narratives and experiences. Create markdown files in `src/content/stories/`:

```markdown
---
title: "Your Story Title"
author: "Author Name"
description: "Brief description"
publishDate: 2024-01-15
featured: true
tags: ["organizing", "victory"]
---

Story content here...
```

### Events
Upcoming and past events. Create markdown files in `src/content/events/`:

```markdown
---
title: "Event Name"
description: "Event description"
startDate: 2024-02-20T18:00:00
endDate: 2024-02-20T20:00:00
location: "City, Province"
virtual: false
registrationUrl: "https://..."
capacity: 50
---

Event details here...
```

## Deployment Environments

### Branches & URLs
- **Production:** `main` branch → `yoursite.ca`
- **Staging:** `staging` branch → `staging.yoursite.ca`
- **Development:** `dev` branch → `dev.yoursite.ca`
- **Feature branches:** Automatic deploy previews

### Git Workflow

**Feature Development**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
# Make changes
git push -u origin feature/your-feature
# Open PR to dev branch
```

**Dev → Staging**
```bash
git checkout staging
git pull origin staging
git merge --no-ff dev
git push origin staging
```

**Staging → Production**
```bash
git checkout main
git pull origin main
git merge --no-ff staging
git push origin main
```

## Template Customization Checklist

When using this template for a new project, follow these steps:

### 1. Initial Setup
- [ ] Clone/fork this repository
- [ ] Update `package.json` with your project name and description
- [ ] Replace placeholder URLs in `src/site.config.js` (marked with `// TEMPLATE:`)
- [ ] Replace placeholder URLs in `netlify.toml` (marked with `# TEMPLATE:`)
- [ ] Update repository URLs in demo pages (`src/pages/markdown-page.md`, `src/pages/mdx-page.mdx`)

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set your `PUBLIC_SITE_NAME`
- [ ] Configure `PUBLIC_BASE_URL` for your domain
- [ ] Update contact email and social media handles
- [ ] Toggle feature flags based on your needs

### 3. Content & Branding
- [ ] Replace the logo in `src/assets/img/logo.svg`
- [ ] Update social preview image in `public/social-preview-image.png`
- [ ] Remove demo content from `src/content/` directories
- [ ] Add your own stories, events, and projects
- [ ] Customize hero section text in `src/pages/index.astro`

### 4. Deployment Setup
- [ ] Connect repository to Netlify
- [ ] Configure environment variables in Netlify dashboard
- [ ] Set up staging and dev branches
- [ ] Configure custom domain (if applicable)
- [ ] Test deployment workflow with a feature branch

### 5. Final Cleanup
- [ ] Delete `todo.md` after completing setup
- [ ] Update this README with your project information
- [ ] Remove or update example content
- [ ] Test all features in staging before production

## Customization

### Navigation
Edit `src/site.config.js` to modify navigation items and feature flags.

### Styling
- Global styles: `src/assets/scss/`
- Tailwind config: `tailwind.config.js`
- Component styles: Scoped within each `.astro` file

### Security Headers
Configure CSP and security policies in `netlify.toml`.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Accessible Astro Components](https://github.com/markteekman/accessible-astro-components) - Accessibility utilities

## Contributing

Contributions welcome! Please ensure:
- Accessibility standards are maintained
- Tests pass before submitting PRs
- Documentation is updated for new features

## License

MIT License - see [LICENSE](LICENSE) file

## Credits

- Based on [Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) by [Incluud](https://incluud.dev/)
- Extended for movement organizing by [Mike Barrett Soron](https://github.com/barrettsoron)

## Support

For issues and questions:
- [GitHub Issues](https://github.com/barrettsoron/movement-starter-template/issues)
- [Discussions](https://github.com/barrettsoron/movement-starter-template/discussions)
