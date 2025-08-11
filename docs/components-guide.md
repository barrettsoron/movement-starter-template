# Movement Components Guide

This guide covers using accessible components in progressive campaign and movement websites.

## Quick Import

```astro
---
import { 
  Accordion, Avatar, AvatarGroup, Badge, Breadcrumbs, 
  Card, DarkMode, Media, Modal, Notification, 
  Pagination, SkipLinks, Tabs, Video 
} from '@components/AccessibleComponents.astro';
---
```

## Component Reference

### Accordion
**Use for**: FAQ sections, policy details, campaign timeline breakdowns
```astro
<Accordion>
  <div slot="header">What does this campaign stand for?</div>
  <div slot="content">
    <p>Our campaign fights for economic justice, environmental protection, and democratic reform.</p>
  </div>
</Accordion>
```

### Avatar
**Use for**: Staff profiles, endorser photos, testimonial speakers
```astro
<Avatar 
  name="Maria Rodriguez" 
  src="/images/staff/maria.jpg" 
  alt="Campaign manager Maria Rodriguez" 
/>
```

### AvatarGroup
**Use for**: Coalition partners, volunteer teams, endorsement showcases
```astro
<AvatarGroup>
  <Avatar name="Union Rep" src="/images/endorsers/union.jpg" />
  <Avatar name="Community Leader" src="/images/endorsers/community.jpg" />
  <Avatar name="Environmental Advocate" src="/images/endorsers/env.jpg" />
</AvatarGroup>
```

### Badge
**Use for**: Campaign status, event types, volunteer roles, priority levels
```astro
<Badge variant="success">Active Campaign</Badge>
<Badge variant="warning">Urgent Action Needed</Badge>
<Badge variant="neutral">Upcoming Event</Badge>
```

### Breadcrumbs
**Use for**: Site navigation, campaign structure, issue hierarchies
```astro
<Breadcrumbs>
  <a href="/">Home</a>
  <a href="/issues">Issues</a>
  <span>Housing Justice</span>
</Breadcrumbs>
```

### Card
**Use for**: Event listings, volunteer opportunities, news updates, donation calls
```astro
<Card>
  <h3 slot="header">Community Canvass</h3>
  <div slot="content">
    <p>Join us Saturday for door-to-door voter outreach in the downtown district.</p>
    <p><strong>When:</strong> Saturday 10am-2pm</p>
    <p><strong>Where:</strong> Campaign HQ</p>
  </div>
  <div slot="footer">
    <button>Sign Up to Volunteer</button>
  </div>
</Card>
```

### DarkMode
**Use for**: Accessibility, user preference respect
```astro
<DarkMode />
```

### Media
**Use for**: Campaign photos, event images, infographics
```astro
<Media 
  src="/images/rally-crowd.jpg" 
  alt="Hundreds of supporters at downtown rally for economic justice"
  caption="Over 500 community members joined our kickoff rally"
/>
```

### Modal
**Use for**: Volunteer signup, donation forms, detailed policy information
```astro
<Modal triggerId="donate-modal" title="Support Our Campaign">
  <p>Your contribution helps us organize communities and fight for change.</p>
  <form>
    <label for="amount">Donation Amount:</label>
    <select id="amount">
      <option value="25">$25</option>
      <option value="50">$50</option>
      <option value="100">$100</option>
    </select>
    <button type="submit">Donate Now</button>
  </form>
</Modal>

<button id="donate-modal">Contribute to Change</button>
```

### Notification
**Use for**: Campaign updates, event reminders, call-to-action alerts
```astro
<Notification type="info">
  <p>New: Early voting starts October 15th. Find your polling location.</p>
</Notification>

<Notification type="success">
  <p>Victory! City Council passes affordable housing resolution.</p>
</Notification>

<Notification type="warning">
  <p>Only 5 days left to register to vote. Register now!</p>
</Notification>
```

### Pagination
**Use for**: Blog posts, event listings, volunteer stories, news archives
```astro
<Pagination 
  currentPage={1}
  totalPages={5}
  disablePrevious={true}
  disableNext={false}
  previousUrl="/stories"
  nextUrl="/stories/page/2"
/>
```

### SkipLinks
**Use for**: Accessibility - always include at top of layout
```astro
<SkipLinks />
```

### Tabs
**Use for**: Platform sections, event categories, ways to get involved
```astro
<Tabs>
  <div slot="tab">Our Platform</div>
  <div slot="tab">Get Involved</div>
  <div slot="tab">Events</div>
  
  <div slot="panel">
    <h3>Economic Justice</h3>
    <p>We believe everyone deserves living wages, affordable housing, and quality healthcare.</p>
    <h3>Environmental Protection</h3>
    <p>Climate action and environmental justice are central to our campaign.</p>
  </div>
  
  <div slot="panel">
    <h3>Volunteer Opportunities</h3>
    <ul>
      <li>Canvassing and phone banking</li>
      <li>Event organizing</li>
      <li>Digital outreach</li>
      <li>Community listening sessions</li>
    </ul>
  </div>
  
  <div slot="panel">
    <h3>Upcoming Events</h3>
    <p>Join us for community meetings, rallies, and organizing trainings.</p>
  </div>
</Tabs>
```

### Video
**Use for**: Campaign messages, event coverage, testimonials, educational content
```astro
<Video 
  title="Campaign Launch Speech" 
  youtube="dQw4w9WgXcQ"
  caption="Watch our campaign launch and learn about our vision for change"
/>
```

## Movement-Specific Patterns

### Campaign Hero Section
```astro
<Hero>
  <h1>Fighting for Economic Justice</h1>
  <p>Together we can build a community where everyone has housing, healthcare, and hope.</p>
  <div class="hero-actions">
    <button id="volunteer-modal">Volunteer</button>
    <button id="donate-modal">Donate</button>
  </div>
</Hero>
```

### Event Showcase
```astro
<div class="events-grid">
  <Card>
    <h3 slot="header">Community Town Hall</h3>
    <div slot="content">
      <Media src="/images/townhall.jpg" alt="Previous town hall meeting" />
      <p>Join us for our monthly community input session.</p>
      <Badge variant="info">Free Event</Badge>
    </div>
  </Card>
  
  <Card>
    <h3 slot="header">Voter Registration Drive</h3>
    <div slot="content">
      <p>Help neighbors register to vote in upcoming elections.</p>
      <Badge variant="success">Volunteer Opportunity</Badge>
    </div>
  </Card>
</div>
```

### Coalition Partners
```astro
<section class="partners">
  <h2>Endorsed By</h2>
  <AvatarGroup>
    <Avatar name="Teachers Union" src="/images/partners/teachers.jpg" />
    <Avatar name="Environmental Alliance" src="/images/partners/env.jpg" />
    <Avatar name="Neighborhood Council" src="/images/partners/council.jpg" />
  </AvatarGroup>
</section>
```

## Accessibility Notes

- All components are keyboard navigable and screen reader compatible
- Use semantic HTML structure within component slots
- Provide descriptive alt text for images
- Use appropriate color contrast for badges and notifications
- Include skip links for keyboard users
- Test with actual assistive technologies when possible

## Styling Integration

Components work with the existing Movement Starter Template styling:
- OKLCH color system provides automatic contrast
- Atkinson Hyperlegible font improves readability
- Dark mode support built-in
- Industrial design tokens available in CSS custom properties