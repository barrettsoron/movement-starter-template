# Accessible Astro Starter Reference

[Accessible Astro Starter](https://github.com/incluud/accessible-astro-starter) is a ready-to-use, SEO and accessibility-friendly blogging theme with accessible components, Tailwind CSS integration, and example pages. Version 4.0.0 introduces OKLCH colors, Atkinson Hyperlegible font, and significant accessibility improvements.

## Key Features

- Built on Astro 5.7.5 with Tailwind CSS 4.0 integration
- Modern OKLCH color system with automatic accessible palette generation
- Atkinson Hyperlegible font for improved readability
- Full accessibility: WCAG compliance, keyboard navigation, screen reader support
- MDX/Markdown support with dynamic blog and pagination
- ESLint with strict accessibility settings + Prettier formatting
- View Transitions support and excellent Lighthouse scores
- Dark mode with system preference detection

## Accessibility Features

- Semantic HTML landmarks, proper heading hierarchy, ARIA attributes
- Keyboard-accessible navigation with dropdown support, skip links
- Focus indicators, reduced motion preferences, screen reader utilities
- Accessible components: Accordions, Breadcrumbs, Modals
- Color Contrast Checker component for accessibility testing

## Commands

| Command           | Action                               |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |

## Core Components

**Layout Components:**

- `Header.astro` - Responsive navigation
- `Footer.astro` - Customizable content
- `Navigation.astro` - Keyboard accessible dropdown
- `Hero.astro` - Hero section component
- `SiteMeta.astro` - SEO meta component

**Content Components:**

- `CallToAction.astro` - Styled block with button
- `ContentMedia.astro` - Content with media layout
- `Feature.astro` - Feature highlight component
- `Counter.astro` - Icon and number counter

**Accessibility Components:**

- `SkipLinks.astro` - For keyboard users
- `DarkMode.astro` - Theme toggle with system preference
- `ColorContrast.astro` - Color contrast testing
- `ResponsiveToggle.astro` - Mobile navigation toggle

**New in v4.0.0:**

- `PageHeader.astro`, `Logo.astro`, `ExternalLink.astro`
- `BlockQuote.astro`, `BreakoutImage.astro`, `SocialShares.astro`

## Project Structure

```text
src/
├── components/           # Astro components (.astro files)
├── layouts/             # Page layouts (DefaultLayout, MarkdownLayout)
├── pages/               # Routes (blog/[...page], portfolio/[...page], index, etc.)
├── content/             # Markdown collections (projects/)
└── assets/
    ├── img/            # Images
    └── scss/           # SCSS styling system
        └── base/       # _root.scss, _colors.scss, _font.scss, etc.
```

## OKLCH Color System

Version 4.0.0 introduces powerful OKLCH-based colors. Define three brand colors and get a full accessible palette automatically generated:

```css
:root {
  --brand-primary: #d648ff; /* Your primary brand color */
  --brand-secondary: #00d1b7; /* Your secondary brand color */
  --brand-neutral: #b9bec4; /* Your neutral brand color */

  /* The rest of the color palette is automatically generated! */
}
```

OKLCH (Lightness, Chroma, Hue) is a perceptually uniform color space that creates consistent, harmonious color palettes with proper contrast for accessibility.

## Customization

Extend components in `src/components/` directory and customize theme in `src/assets/scss/base/` files (\_root.scss, \_colors.scss, etc.).
