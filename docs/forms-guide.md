# Forms Guide - Movement Starter Template

This guide covers how to use the flexible form system included in the Movement Starter Template.

## Quick Start

### 1. Basic Signup Form

```astro
---
import SignupForm from '@components/forms/SignupForm.astro'
---

<SignupForm 
  title="Join Our Movement"
  subtitle="Add your name to our community"
  requiredFields={['email']}
  optionalFields={['name', 'phone', 'postal_code']}
/>
```

### 2. Volunteer Form

```astro
---
import VolunteerForm from '@components/forms/VolunteerForm.astro'
---

<VolunteerForm 
  title="Volunteer With Us"
  requiredFields={['first_name', 'last_name', 'email']}
  optionalFields={['phone', 'address_1', 'postal_code', 'skills']}
/>
```

## Environment Configuration

Configure forms via environment variables in `.env.local`:

```bash
# Form endpoints
PUBLIC_FORMS_SIGNUP_ENDPOINT=https://your-api.com/signup
PUBLIC_FORMS_VOLUNTEER_ENDPOINT=https://your-api.com/volunteer

# Form caching
PUBLIC_FORMS_CACHE=true
PUBLIC_FORMS_CACHE_TTL=3600000
PUBLIC_FORMS_CACHE_KEY=your_org_form_cache

# Success/error pages
PUBLIC_FORMS_SUCCESS_PAGE=/thank-you
PUBLIC_FORMS_ERROR_PAGE=/form-error

# Security
PUBLIC_FORMS_CSRF=true
PUBLIC_FORMS_RATE_LIMIT=true
PUBLIC_FORMS_RATE_LIMIT_PER_MINUTE=5
```

## Form Components

### SignupForm

Basic signup form for general membership/newsletter signups.

#### Props

```typescript
interface SignupFormProps {
  // Content
  title?: string
  subtitle?: string
  
  // Behavior
  endpoint?: string
  successUrl?: string
  errorUrl?: string
  language?: string
  showProgress?: boolean
  
  // Field Configuration
  requiredFields?: string[]  // ['email'] by default
  optionalFields?: string[]  // ['name', 'phone', 'postal_code'] by default
  
  // Styling
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}
```

#### Field Options

- `name` - Full name field
- `email` - Email address (usually required)
- `phone` - Phone number
- `postal_code` - Postal/zip code

#### Examples

**Minimal Email Signup:**
```astro
<SignupForm 
  title="Stay Updated"
  requiredFields={['email']}
  optionalFields={[]}
  variant="compact"
/>
```

**Full Contact Form:**
```astro
<SignupForm 
  title="Join Our Campaign"
  requiredFields={['name', 'email', 'postal_code']}
  optionalFields={['phone']}
/>
```

**Inline Newsletter Signup:**
```astro
<SignupForm 
  title="Newsletter"
  requiredFields={['email']}
  optionalFields={[]}
  variant="inline"
/>
```

### VolunteerForm

Comprehensive volunteer application form.

#### Props

```typescript
interface VolunteerFormProps {
  // Content
  title?: string
  subtitle?: string
  
  // Behavior
  endpoint?: string
  successUrl?: string
  errorUrl?: string
  language?: string
  showProgress?: boolean
  
  // Field Configuration
  requiredFields?: string[]
  optionalFields?: string[]
  
  // Custom Questions
  customQuestions?: Array<{
    id: string
    label: string
    type: 'text' | 'select' | 'checkbox' | 'textarea'
    options?: string[]
    required?: boolean
  }>
  
  // Styling
  variant?: 'default' | 'compact'
  className?: string
}
```

#### Field Options

**Personal Information:**
- `first_name` - First name
- `last_name` - Last name  
- `email` - Email address
- `phone` - Phone number

**Location:**
- `address_1` - Address line 1
- `address_2` - Address line 2
- `postal_code` - Postal/zip code

**Volunteer Details:**
- `availability` - Time availability (predefined options)
- `skills` - Skills and interests (textarea)
- `languages` - Languages spoken (checkbox grid)

#### Examples

**Basic Volunteer Form:**
```astro
<VolunteerForm 
  title="Join Our Team"
  requiredFields={['first_name', 'last_name', 'email']}
  optionalFields={['phone', 'skills']}
/>
```

**Comprehensive Application:**
```astro
<VolunteerForm 
  title="Volunteer Application"
  requiredFields={['first_name', 'last_name', 'email', 'phone', 'availability']}
  optionalFields={['address_1', 'address_2', 'postal_code', 'skills', 'languages']}
  customQuestions={[
    {
      id: 'experience',
      label: 'Previous organizing experience',
      type: 'textarea',
      required: false
    },
    {
      id: 'commitment',
      label: 'How long can you volunteer?',
      type: 'select',
      options: ['1-3 months', '3-6 months', '6+ months', 'Through election'],
      required: true
    }
  ]}
/>
```

## Form Caching System

The form caching system automatically saves and restores form data across page visits.

### Features

- **Session Storage**: Data persists for browser session only (privacy-friendly)
- **Configurable TTL**: Default 1 hour, customizable via environment variables
- **Cross-Form Sharing**: Data entered in one form appears in others
- **URL Prefilling**: Support for `?prefill_email=user@example.com` parameters
- **Name Mirroring**: Automatically syncs `name` ↔ `first_name`/`last_name`

### URL Prefilling

Support prefill parameters for deep linking:

```
/signup?prefill_name=Jane%20Doe&prefill_email=jane@example.com
/volunteer?prefill_first_name=John&prefill_last_name=Smith&prefill_phone=555-1234
```

Supported prefill parameters:
- `prefill_name`
- `prefill_first_name` 
- `prefill_last_name`
- `prefill_email`
- `prefill_phone`
- `prefill_postal_code`
- `prefill_address_1`
- `prefill_address_2`
- `prefill_organization`
- `prefill_referral_id`

### Programmatic Access

```javascript
// Get cached data
const cachedData = window.FormCache.get()

// Manually save data
window.FormCache.set({ email: 'user@example.com' }, 3600000)

// Clear cache
window.FormCache.clear()
```

## Backend Integration

### Form Data Structure

All forms submit with this structure:

```javascript
{
  // Metadata
  form_type: 'signup' | 'volunteer',
  language: 'en',
  timestamp: 1234567890,
  success_url: '/thanks',
  error_url: '/error',
  
  // User data (varies by form and configuration)
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  // ... other fields
}
```

### API Endpoints

Configure endpoints in `site.config.js` or environment variables:

```javascript
forms: {
  endpoints: {
    signup: '/api/forms/signup',
    volunteer: '/api/forms/volunteer',
  }
}
```

### Example Backend Handler (Node.js)

```javascript
app.post('/api/forms/signup', async (req, res) => {
  const { form_type, email, name, success_url, error_url } = req.body
  
  try {
    // Validate data
    if (!email || !isValidEmail(email)) {
      throw new Error('Valid email required')
    }
    
    // Save to database
    await saveSignup({ email, name, timestamp: new Date() })
    
    // Redirect to success page
    res.redirect(success_url || '/thanks')
  } catch (error) {
    console.error('Signup error:', error)
    res.redirect(error_url || '/error')
  }
})
```

## Styling & Customization

### CSS Variables

Forms use CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-error-500: #ef4444;
  --color-neutral-600: #4b5563;
  
  /* Spacing */
  --form-padding: 2rem;
  --field-gap: 1.5rem;
}
```

### Custom Styling

Override form styles with CSS classes:

```astro
<SignupForm className="custom-signup-form" />

<style>
  .custom-signup-form {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .custom-signup-form .field-input {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }
</style>
```

## Accessibility Features

All forms include comprehensive accessibility features:

- **Semantic HTML**: Proper form structure with labels and fieldsets
- **ARIA Support**: Screen reader announcements for errors and status
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Handling**: Accessible error messages with `role="alert"`
- **Progressive Enhancement**: Works without JavaScript

## Internationalization

Forms support multiple languages through props:

```astro
<!-- English (default) -->
<SignupForm 
  title="Join Our Movement"
  language="en"
/>

<!-- French -->
<SignupForm 
  title="Rejoignez notre mouvement"
  language="fr"
/>

<!-- Spanish -->
<SignupForm 
  title="Únete a nuestro movimiento"  
  language="es"
/>
```

## Security Considerations

### Built-in Protections

- **Input Sanitization**: All form data is sanitized and length-limited
- **CSRF Protection**: Anti-forgery tokens (when enabled)
- **Rate Limiting**: Configurable submission rate limits
- **Allowlist Validation**: Only permitted fields are processed

### Best Practices

1. **Always validate server-side**: Never trust client-side validation alone
2. **Use HTTPS**: Encrypt all form submissions
3. **Implement rate limiting**: Prevent abuse and spam
4. **Sanitize inputs**: Clean all user data before storage
5. **Log security events**: Monitor for suspicious activity

## Testing

### Manual Testing

Test forms across different scenarios:

1. **Required field validation**: Submit with missing required fields
2. **Email validation**: Test invalid email formats
3. **Form caching**: Navigate between pages and verify data persistence
4. **URL prefilling**: Test prefill parameters
5. **Accessibility**: Use keyboard navigation and screen readers
6. **Mobile responsiveness**: Test on different screen sizes

### Automated Testing

Example Cypress test:

```javascript
describe('Signup Form', () => {
  it('submits successfully with valid data', () => {
    cy.visit('/signup')
    cy.get('#email').type('test@example.com')
    cy.get('#name').type('Test User')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/thanks')
  })
  
  it('shows validation errors for invalid email', () => {
    cy.visit('/signup')
    cy.get('#email').type('invalid-email')
    cy.get('#email').blur()
    cy.get('.field-error-message').should('be.visible')
  })
})
```

## Troubleshooting

### Common Issues

**Forms not submitting:**
- Check endpoint configuration in `site.config.js`
- Verify network connectivity
- Check browser console for JavaScript errors

**Caching not working:**
- Ensure `form-cache.js` is loaded
- Check that forms have `movement-form` class
- Verify sessionStorage is available and not disabled

**Styling issues:**
- Check CSS variable definitions
- Ensure form components are importing styles correctly
- Verify no CSS conflicts with existing styles

**Accessibility problems:**
- Validate HTML with accessibility checkers
- Test with keyboard navigation
- Use screen reader testing tools

### Debug Mode

Enable debug logging:

```javascript
// In browser console
window.FormCache.config.debug = true
```

This will log cache operations and form interactions to help diagnose issues.