# Security Guidelines for Forms System

This document outlines security considerations and best practices for implementing and maintaining the forms system in progressive movement organizations.

## Overview

Forms are critical attack vectors for malicious actors targeting political organizations. This guide covers both technical security measures and operational security practices to protect your supporters, organizers, and movement data.

## Threat Model

### Common Threats to Movement Organizations

**Data Extraction Attacks:**
- Harvesting supporter contact information
- Mining organizational tactics and strategies
- Building surveillance profiles on activists

**Disruption Attacks:**
- Spam form submissions overwhelming systems
- Data corruption attacks on supporter lists
- Resource exhaustion (DDoS via forms)

**Social Engineering:**
- Fake volunteer signups to infiltrate organizing
- Information gathering through form interactions
- Trust exploitation via phishing-style forms

**State and Corporate Surveillance:**
- Mass data collection on political activities
- Cross-platform tracking of supporters
- Metadata analysis of organizing patterns

### Risk Assessment Framework

**High Risk Scenarios:**
- Electoral campaigns in contested races
- Direct action organizations
- International solidarity movements
- Organizations challenging powerful interests

**Medium Risk Scenarios:**
- Local issue-based campaigns
- Established nonprofit organizations
- Educational and awareness campaigns

**Considerations for All Scenarios:**
- Supporter privacy and safety
- Organizational operational security
- Long-term data protection
- Legal and regulatory compliance

## Technical Security Measures

### Input Validation and Sanitization

**Server-Side Validation (Critical):**
```javascript
// Never trust client-side validation alone
function validateSignupForm(data) {
  const errors = [];
  
  // Email validation
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email required');
  }
  
  // Length limits to prevent buffer overflows
  if (data.name && data.name.length > 120) {
    errors.push('Name too long');
  }
  
  // Sanitize HTML to prevent XSS
  data.name = sanitizeHtml(data.name);
  
  return { isValid: errors.length === 0, errors, data };
}
```

**Client-Side Validation (UX Enhancement):**
```javascript
// Provide immediate feedback but always validate server-side
function validateField(field, value) {
  const rules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\+\(\)]{10,15}$/,
    postal_code: /^[A-Za-z0-9\s]{3,10}$/
  };
  
  return rules[field] ? rules[field].test(value) : true;
}
```

### CSRF Protection

**Token Generation:**
```javascript
// Generate unique CSRF tokens per session
import crypto from 'crypto';

function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store in secure session storage
app.use(session({
  secret: process.env.SESSION_SECRET,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
}));
```

**Token Validation:**
```javascript
function validateCSRFToken(req, res, next) {
  const token = req.body._csrf || req.headers['x-csrf-token'];
  
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ 
      error: 'CSRF token mismatch. Please refresh and try again.' 
    });
  }
  
  next();
}
```

### Rate Limiting

**Progressive Rate Limiting:**
```javascript
import rateLimit from 'express-rate-limit';

// Basic rate limiting
const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per window
  message: 'Too many submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiting for suspicious behavior
const suspiciousRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1,
  skip: (req) => !isSuspiciousSubmission(req),
});
```

**Adaptive Rate Limiting:**
```javascript
function isSuspiciousSubmission(req) {
  return (
    req.body.honeypot || // Honeypot field filled
    req.body.name === req.body.email || // Obviously fake data
    req.headers['user-agent'].includes('bot') || // Bot user agent
    req.body.message && req.body.message.includes('<script>') // XSS attempt
  );
}
```

### Data Encryption

**Encryption in Transit:**
```javascript
// Enforce HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Strict Transport Security
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

**Encryption at Rest:**
```javascript
import bcrypt from 'bcrypt';

// Hash sensitive data before storage
async function hashSensitiveData(data) {
  if (data.phone) {
    data.phone_hash = await bcrypt.hash(data.phone, 12);
    delete data.phone; // Store only hash for analytics
  }
  return data;
}
```

### Honeypot Fields

**HTML Implementation:**
```html
<!-- Hidden field to catch bots -->
<input 
  type="text" 
  name="website" 
  style="position: absolute; left: -9999px;"
  tabindex="-1"
  autocomplete="off"
  aria-hidden="true"
/>
```

**Server-Side Detection:**
```javascript
function checkHoneypot(req, res, next) {
  if (req.body.website) {
    // Log suspicious activity
    console.log('Bot detected:', req.ip, req.headers['user-agent']);
    
    // Return fake success to avoid detection
    return res.status(200).json({ success: true });
  }
  next();
}
```

## Privacy Protection

### Data Minimization

**Collect Only What's Needed:**
```javascript
// Define purpose-specific data requirements
const dataRequirements = {
  newsletter: ['email'],
  volunteer: ['name', 'email', 'phone'],
  donation: ['name', 'email', 'billing_address'],
  event_rsvp: ['name', 'email', 'dietary_restrictions']
};

function validateDataNeed(formType, data) {
  const allowed = dataRequirements[formType] || [];
  const filtered = {};
  
  allowed.forEach(field => {
    if (data[field]) filtered[field] = data[field];
  });
  
  return filtered;
}
```

### Data Retention Policies

**Automatic Data Purging:**
```javascript
// Clean up expired form cache data
function purgeExpiredFormData() {
  const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
  
  db.collection('form_submissions')
    .where('created_at', '<', cutoff)
    .where('purpose', '==', 'cache')
    .delete();
}

// Run daily cleanup
cron.schedule('0 2 * * *', purgeExpiredFormData);
```

### Consent Management

**Explicit Consent Collection:**
```html
<fieldset class="consent-section">
  <legend>Privacy and Communications</legend>
  
  <label>
    <input type="checkbox" name="consent_email" required>
    I consent to receiving campaign updates via email
  </label>
  
  <label>
    <input type="checkbox" name="consent_sms">
    I consent to receiving text message updates (optional)
  </label>
  
  <label>
    <input type="checkbox" name="consent_data_processing" required>
    I understand how my data will be used (see privacy policy)
  </label>
</fieldset>
```

**Consent Tracking:**
```javascript
function recordConsent(userData, consents) {
  return {
    ...userData,
    consent: {
      email: consents.consent_email === 'on',
      sms: consents.consent_sms === 'on',
      data_processing: consents.consent_data_processing === 'on',
      timestamp: new Date().toISOString(),
      ip_address: req.ip, // For legal compliance
      user_agent: req.headers['user-agent']
    }
  };
}
```

## Operational Security

### Access Controls

**Role-Based Permissions:**
```javascript
const permissions = {
  volunteer: ['view_own_data'],
  organizer: ['view_supporter_data', 'export_lists'],
  coordinator: ['view_all_data', 'modify_settings'],
  admin: ['full_access', 'security_settings']
};

function hasPermission(user, action) {
  const userRole = user.role || 'volunteer';
  return permissions[userRole].includes(action) || 
         permissions[userRole].includes('full_access');
}
```

### Data Access Logging

**Audit Trail Implementation:**
```javascript
function logDataAccess(user, action, data_type, record_count) {
  db.collection('access_logs').add({
    user_id: user.id,
    user_email: user.email,
    action: action,
    data_type: data_type,
    record_count: record_count,
    timestamp: new Date(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });
}

// Usage example
app.get('/api/supporters', authenticate, (req, res) => {
  if (!hasPermission(req.user, 'view_supporter_data')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  const supporters = getSupporters();
  logDataAccess(req.user, 'export_supporters', 'supporter_data', supporters.length);
  
  res.json(supporters);
});
```

### Secure Configuration Management

**Environment Variable Security:**
```bash
# Use strong, unique secrets
SESSION_SECRET=$(openssl rand -base64 32)
CSRF_SECRET=$(openssl rand -base64 32)
DATABASE_ENCRYPTION_KEY=$(openssl rand -base64 32)

# Restrict access to sensitive endpoints
ALLOWED_ADMIN_IPS="203.0.113.1,203.0.113.2"

# Enable security headers
SECURITY_HEADERS_ENABLED=true
FORCE_HTTPS=true
```

**Configuration Validation:**
```javascript
function validateSecurityConfig() {
  const required = [
    'SESSION_SECRET',
    'DATABASE_URL',
    'CSRF_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required security configuration: ${missing.join(', ')}`);
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FORCE_HTTPS) {
      console.warn('WARNING: HTTPS not enforced in production');
    }
  }
}
```

## Incident Response

### Security Incident Detection

**Automated Monitoring:**
```javascript
function monitorSuspiciousActivity() {
  // Detect rapid-fire submissions
  const recentSubmissions = getSubmissionsInTimeWindow(60000); // 1 minute
  if (recentSubmissions.length > 10) {
    alertSecurityTeam('High submission rate detected');
  }
  
  // Detect XSS attempts
  const xssAttempts = recentSubmissions.filter(s => 
    JSON.stringify(s.data).includes('<script>') ||
    JSON.stringify(s.data).includes('javascript:')
  );
  if (xssAttempts.length > 0) {
    alertSecurityTeam('XSS attempt detected');
  }
  
  // Detect data scraping patterns
  const uniqueIPs = new Set(recentSubmissions.map(s => s.ip));
  if (uniqueIPs.size === 1 && recentSubmissions.length > 5) {
    alertSecurityTeam('Potential data scraping detected');
  }
}
```

### Response Procedures

**Immediate Response Checklist:**
1. **Isolate the threat** - Block suspicious IPs
2. **Assess the scope** - Check logs for data access
3. **Preserve evidence** - Snapshot logs and database state
4. **Notify stakeholders** - Security team and leadership
5. **Document everything** - Timeline and technical details

**Recovery Procedures:**
```javascript
async function emergencySecurityMode() {
  // Temporarily disable form submissions
  await setSystemSetting('forms_enabled', false);
  
  // Increase rate limiting
  await setSystemSetting('rate_limit_max', 1);
  
  // Enable additional logging
  await setSystemSetting('detailed_logging', true);
  
  // Notify administrators
  await sendAlertEmail('SECURITY ALERT: Emergency mode activated');
}
```

## Compliance Considerations

### GDPR and Privacy Regulations

**Right to Access:**
```javascript
async function generateDataExport(email) {
  const userData = await db.collection('supporters')
    .where('email', '==', email)
    .get();
    
  const formData = await db.collection('form_submissions')
    .where('email', '==', email)
    .get();
    
  return {
    personal_data: userData.docs.map(doc => doc.data()),
    form_submissions: formData.docs.map(doc => ({
      date: doc.data().timestamp,
      form_type: doc.data().form_type,
      data: doc.data().form_data
    })),
    generated_at: new Date().toISOString()
  };
}
```

**Right to Deletion:**
```javascript
async function deleteUserData(email) {
  // Delete from all relevant collections
  const collections = ['supporters', 'form_submissions', 'email_subscriptions'];
  
  for (const collection of collections) {
    await db.collection(collection)
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      });
  }
  
  // Log deletion for compliance
  await logDataAccess({ email: 'system' }, 'gdpr_deletion', 'all_data', 1);
}
```

### Documentation Requirements

**Privacy Policy Requirements:**
- Data collection purposes
- Data retention periods  
- Third-party data sharing
- User rights and procedures
- Contact information for data protection

**Terms of Service Considerations:**
- Acceptable use policies
- Content ownership
- Liability limitations
- Dispute resolution procedures

## Security Checklist

### Development Phase

- [ ] Input validation on all form fields
- [ ] CSRF protection implemented
- [ ] Rate limiting configured
- [ ] Honeypot fields added
- [ ] Error messages don't leak information
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] SQL injection prevention
- [ ] XSS protection implemented
- [ ] Data encryption at rest and in transit

### Deployment Phase

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Monitoring and alerting configured  
- [ ] Backup procedures tested
- [ ] Incident response plan documented
- [ ] Access controls implemented
- [ ] Audit logging enabled
- [ ] Security scanning completed
- [ ] Penetration testing performed
- [ ] Staff security training completed

### Ongoing Maintenance

- [ ] Regular security audits scheduled
- [ ] Dependency updates automated
- [ ] Log analysis performed weekly
- [ ] Backup integrity verified monthly
- [ ] Access permissions reviewed quarterly
- [ ] Incident response drills conducted
- [ ] Security training updated annually
- [ ] Compliance requirements reviewed
- [ ] Threat model updated as needed

## Resources

### Security Tools

**Static Analysis:**
- ESLint with security plugins
- Snyk for dependency scanning
- SonarQube for code quality

**Dynamic Testing:**
- OWASP ZAP for vulnerability scanning
- Burp Suite for penetration testing
- Artillery.js for load testing

**Monitoring:**
- Sentry for error tracking
- LogRocket for user session recording
- Cloudflare for DDoS protection

### Education Resources

**Team Training:**
- OWASP Top 10 security risks
- Social engineering awareness
- Phishing recognition training
- Incident response procedures

**Technical References:**
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Emergency Contacts

**Internal Security Team:**
- Security Lead: [contact information]
- Technical Lead: [contact information]
- Legal Counsel: [contact information]

**External Resources:**
- Electronic Frontier Foundation: [contact for digital rights organizations]
- Access Now: [contact for human rights organizations]
- Local cybersecurity incident response team

---

## Conclusion

Security for progressive organizations requires balancing accessibility with protection. The measures outlined here provide a foundation for secure form handling while maintaining the usability needed for effective organizing.

Remember: **Security is not a one-time implementation but an ongoing practice.** Regular reviews, updates, and training ensure your forms continue to protect your supporters and your movement as threats evolve.