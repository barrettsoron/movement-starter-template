# Understanding Component APIs: A Training Guide for Editors

*A comprehensive guide for junior developers and content editors working with movement and campaign websites.*

## Table of Contents

1. [What is a Component API?](#what-is-a-component-api)
2. [Why APIs Matter for Movement Work](#why-apis-matter-for-movement-work)
3. [Modern vs. Legacy Component APIs](#modern-vs-legacy-component-apis)
4. [Component API Types](#component-api-types)
5. [Real-World Examples](#real-world-examples)
6. [Learning Any Component API](#learning-any-component-api)
7. [Building Your Own Component APIs](#building-your-own-component-apis)
8. [Best Practices for Movement Sites](#best-practices-for-movement-sites)
9. [Common Patterns Reference](#common-patterns-reference)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## What is a Component API?

A **Component API** is the interface—the contract—between you (the developer/editor) and a reusable component. It defines:

- **Props**: What data you can pass into the component
- **Events**: What actions the component can respond to  
- **Methods**: What functions you can call on the component
- **Slots/Children**: Where you can insert your own content

Think of it like a volunteer sign-up form for your campaign:
- **Required fields** (props): Name, email address
- **Optional fields** (optional props): Phone number, skills
- **Actions** (events): Submit button, cancel button
- **Content areas** (children): Space for custom questions

### Simple Example

```javascript
// This is a component API in action
<EventCard 
  title="Climate Justice Rally"        // Required prop
  date={new Date('2024-03-15')}       // Required prop
  location="City Hall"                // Required prop
  isFree={true}                       // Optional prop
  registrationRequired={false}        // Optional prop
>
  {/* Content area (children) */}
  <p>Join us for bold climate action!</p>
  <Badge type="success">All Ages</Badge>
</EventCard>
```

---

## Why APIs Matter for Movement Work (And Your Sanity)

> **💡 What's In It For You?** Understanding component APIs isn't just good practice—it's your shield against 2am debugging sessions, frustrated volunteers, and the stress of broken websites during crucial campaign moments.

### 1. **Protect Your Future Self**
Six months from now, you'll return to this code. Will Future You thank Present You, or curse your name?

**Good APIs mean:**
- **No more archaeology**: Clear prop names tell you exactly what each component needs
- **Copy-paste friendly**: Working patterns you can replicate without thinking
- **Documentation that actually helps**: Props are self-documenting when done right

```javascript
// Future You will love this clarity:
<EventCard 
  title="Climate Rally"           // Obviously the event name
  isUrgent={true}                // Obviously marks priority
  registrationRequired={false}   // Obviously handles signup logic
/>

// Future You will hate this mystery:
<EventCard 
  data={complexObject}          // What's in here? Who knows!
  config="urgent-type-3"        // What does this mean?
  opts={{rr: false}}           // ???
/>
```

### 2. **Accessibility is for Everyone (Including Future You)**
Here's the reality nobody talks about: **you're only temporarily able-bodied.**

**Personal benefits you'll experience:**
- **Broken mouse?** Keyboard navigation gets you unstuck at midnight before a big rally
- **Cooking dinner while checking event details?** Screen reader support lets you listen while stirring
- **Squinting at your phone in bright sunlight?** High contrast helps you see the donation totals
- **Trying to fill out a form while holding coffee?** Clear focus indicators show where you are
- **Eye strain from coding all day?** Screen reader breaks let your eyes rest
- **Sprained wrist?** Voice navigation still works on accessible sites

```javascript
// ❌ Manual accessibility (you'll mess this up at 2am)
<div className="accordion-header" onClick={toggle}>
  What is our platform?
</div>
// Results: Broken for keyboards, screen readers, and stressed-out you

// ✅ Accessibility automatically handled (works when you're tired)
<AccordionItem title="What is our platform?">
  {/* Keyboard navigation, screen reader support, focus management—all automatic */}
</AccordionItem>
// Results: Works for everyone, including exhausted campaign-mode you
```

> **🎯 Real Talk:** The volunteer trying to sign up with a broken finger? That might be you next month. The organizer with eye strain squinting at tiny text? That's definitely you during crunch time. Build for them = build for yourself.

### 3. **Your Website Won't Embarrass You**
Remember that time a donation form broke during the fundraising deadline? Or when the event page crashed during voter registration drives?

**Consistent APIs prevent public failures:**
- **Volunteers trust your tech**: Same patterns work the same way everywhere
- **Updates don't break things**: Change one component, improve all instances
- **You look professional**: Brand consistency makes you seem bigger than you are
- **Emergency fixes are possible**: Clear patterns mean anyone can jump in and help

```javascript
// All your events look and work the same way:
<EventCard title="Town Hall" type="meeting" />
<EventCard title="Phone Bank" type="volunteer" />
<EventCard title="Rally" type="action" />
// Result: Volunteers know what to expect, you get fewer support requests
```

### 4. **Less Stress, More Impact**
Movement work is already exhausting. Don't make technology add to your burden.

**How good APIs improve your quality of life:**

📞 **Fewer emergency calls**: Consistent patterns mean fewer "the website is broken" panics  
🛠 **Easier handoffs**: When you're overwhelmed, teammates can help without a PhD in your code  
⚡ **Faster launches**: Copy working patterns instead of reinventing wheels  
🧠 **Lower cognitive load**: Less mental energy on tech details = more for organizing strategy  
🏠 **Work-life balance**: Reliable code means fewer weekend debugging sessions  

> **🔥 Burnout Prevention:** Every hour you spend learning good API patterns saves you five hours of debugging later. That's five more hours with your family, five more hours for self-care, five more hours for the organizing that changes the world.

### 5. **Career Protection**
Understanding component APIs makes you **indispensable** to resource-strapped movements:

- **Job security**: You become the person who "just knows how to make it work"
- **Skill transferability**: These patterns work across React, Vue, Astro, and future frameworks
- **Leadership opportunities**: You can train other volunteers instead of doing everything yourself
- **Reputation building**: "Ask [Your Name]—they build sites that actually work"

The developer who understands APIs becomes the developer movements depend on. In a sector where good tech people are rare, being reliable makes you invaluable.

---

## Modern vs. Legacy Component APIs

### The Old Way: Slot-Based API (Avoid This)

```javascript
// ❌ OLD: Slot-based (fragile, limited accessibility)
<Accordion>
  <div slot="header">What is our platform?</div>
  <div slot="content">
    <p>We fight for housing justice...</p>
  </div>
</Accordion>
```

**Problems with slots:**
- **Accessibility Issues**: No way to set proper heading levels or ARIA attributes
- **Limited Control**: Can't configure behavior (open by default, animations, etc.)
- **Fragile**: If the library changes slot names, everything breaks
- **Poor Developer Experience**: Have to guess what slots exist
- **No Type Safety**: No way to know if you're using slots correctly

### The Modern Way: Props-Based API (Use This)

```javascript
// ✅ MODERN: Props-based (flexible, accessible, maintainable)
<Accordion>
  <AccordionItem 
    title="What is our platform?"     // Clear, typed prop
    tagName="h3"                      // Semantic heading level
    open                              // Default state
    variant="chevron"                 // Visual style
    name="platform-group"            // Grouping behavior
  >
    <p>We fight for housing justice...</p>
  </AccordionItem>
</Accordion>
```

**Advantages of modern props:**
- **Accessibility Built-in**: Proper ARIA relationships, heading hierarchy
- **Type Safety**: IDE can validate props and show documentation
- **Flexibility**: Configure exactly what you need
- **Maintainability**: Breaking changes are easier to track and fix
- **Self-Documenting**: Props clearly show what's possible

---

## Component API Types

### 1. **Simple Data Props**
Pass basic information to customize component behavior:

```javascript
<Badge 
  type="success"     // enum: success, warning, error, info
  size="md"          // enum: sm, md, lg  
  isButton={false}   // boolean: make it clickable
  animateOnHover     // boolean shorthand (same as animateOnHover={true})
>
  Confirmed Event
</Badge>
```

### 2. **Event Handler Props**
Define what happens when users interact with components:

```javascript
<Modal 
  triggerId="volunteer-signup"  // string: element that opens modal
  title="Join Our Campaign"     // string: modal header
  closeText="Cancel"           // string: close button text
  onClose={() => {             // function: called when modal closes
    console.log('User closed volunteer modal')
    // Track analytics, update state, etc.
  }}
>
  <VolunteerForm />
</Modal>
```

### 3. **Compound Components (Multiple Parts Working Together)**
Complex components that have multiple related pieces:

```javascript
<Tabs>
  {/* TabsList contains the clickable tabs */}
  <TabsList>
    <TabsTab id="platform" controls="platform-panel" selected>
      Our Platform
    </TabsTab>
    <TabsTab id="events" controls="events-panel">
      Events  
    </TabsTab>
  </TabsList>
  
  {/* TabsPanel contains the content for each tab */}
  <TabsPanel id="platform-panel" labelledby="platform" selected>
    <h3>Housing Justice Platform</h3>
    <p>Everyone deserves safe, affordable housing...</p>
  </TabsPanel>
  
  <TabsPanel id="events-panel" labelledby="events">
    <h3>Upcoming Events</h3>
    <EventCard title="Community Town Hall" />
  </TabsPanel>
</Tabs>
```

---

## Real-World Examples

> **🎯 Why This Matters to You:** These aren't just code examples—they're patterns that will save you hours of work and prevent embarrassing bugs when your site goes viral or gets attacked. Each example shows you how to build something once and reuse it everywhere.

### Example 1: Building a Campaign FAQ

> **💭 Personal Stakes:** You're building this FAQ at 11pm because the candidate debate is tomorrow and everyone has questions about rent stabilization. Good API patterns mean you can build this fast and it won't break when 1000 people hit it simultaneously during the livestream.

Let's build an FAQ section for a housing justice campaign:

#### Step 1: Basic Implementation
```javascript
<Accordion>
  <AccordionItem 
    title="What is rent stabilization?"
    tagName="h3"    // Creates <h3> for proper page structure
    open            // Start with first question open
  >
    <p>
      Rent stabilization limits how much landlords can raise rent each year, 
      protecting tenants from displacement.
    </p>
    <Badge type="info" size="sm">Policy Details Available</Badge>
  </AccordionItem>
</Accordion>
```

#### Step 2: Adding More Questions
```javascript
<Accordion>
  <AccordionItem 
    name="housing-faq"  // Same name = only one can be open at a time
    title="What is rent stabilization?"
    tagName="h3"
    open
  >
    <p>Rent stabilization limits annual rent increases...</p>
    <a href="/platform/housing" className="read-more">
      Read Full Policy →
    </a>
  </AccordionItem>
  
  <AccordionItem 
    name="housing-faq"  // Same group
    title="How will this affect small landlords?"
    tagName="h3"
  >
    <p>Our plan includes support for small property owners...</p>
    <ul>
      <li>Tax credits for building maintenance</li>
      <li>Low-interest loans for accessibility improvements</li>
      <li>Mediation services for tenant-landlord disputes</li>
    </ul>
  </AccordionItem>
  
  <AccordionItem 
    name="housing-faq"
    title="What about new construction?"  
    tagName="h3"
  >
    <p>We support incentives for affordable housing development...</p>
    <Badge type="success">Union Jobs Required</Badge>
  </AccordionItem>
</Accordion>
```

#### Step 3: Understanding the Props API

Let's break down what each prop does:

```javascript
<AccordionItem 
  // REQUIRED: The visible header text
  title="What is rent stabilization?"
  
  // ACCESSIBILITY: What HTML element for the header?
  tagName="h3"  // Creates <h3> for proper page structure
  
  // STATE: Should this start open?
  open={true}  // or just `open` as shorthand
  
  // GROUPING: Multiple accordions that interact?
  name="housing-faq"  // Only one in group can be open at a time
  
  // STYLING: Different visual treatments?
  variant="chevron"  // Shows arrow icon, or "default" for plus/minus
>
  {/* CONTENT: Regular HTML/JSX goes here */}
  <p>Your content...</p>
</AccordionItem>
```

### Example 2: Event Listing Cards

Building a grid of upcoming campaign events:

```javascript
<div className="events-grid">
  <Card 
    img="/images/town-hall.jpg"
    imageAlt="Community members at previous town hall meeting"
    url="/events/town-hall-march"
    title="Community Town Hall"
    footer="Saturday, March 15th at 2:00 PM"
  >
    <p>
      Join us for our monthly community input session where residents 
      shape our policy priorities and campaign strategy.
    </p>
    <div className="event-badges">
      <Badge type="success" size="sm">Free Event</Badge>
      <Badge type="info" size="sm">Child Care Provided</Badge>
      <Badge type="info" size="sm">Translation Available</Badge>
    </div>
  </Card>
  
  <Card 
    img="/images/phone-bank.jpg"
    imageAlt="Volunteers making calls to voters"
    url="/events/phone-bank-training"
    title="Phone Bank Training"  
    footer="Wednesday, March 20th at 6:30 PM"
  >
    <p>
      Learn effective voter contact techniques and help us reach 
      community members about our housing justice campaign.
    </p>
    <div className="event-badges">
      <Badge type="warning" size="sm">Training Required</Badge>
      <Badge type="success" size="sm">Dinner Provided</Badge>
    </div>
  </Card>
  
  <Card 
    img="/images/rally.jpg"
    imageAlt="Previous rally with hundreds of community members"
    url="/events/housing-justice-rally"
    title="Housing Justice Rally"
    footer="Saturday, April 5th at 12:00 PM"
  >
    <p>
      Stand with tenants and housing advocates as we demand action 
      on rent stabilization and affordable housing.
    </p>
    <div className="event-badges">
      <Badge type="error" size="sm">Action Alert</Badge>
      <Badge type="success" size="sm">All Ages Welcome</Badge>
    </div>
  </Card>
</div>
```

### Example 3: Team Member Profiles

Showcasing campaign leadership and endorsers:

```javascript
<section className="team-section">
  <h2>Campaign Leadership</h2>
  
  {/* Grid layout for key team members */}
  <AvatarGroup display="grid">
    <Avatar 
      img="/images/candidate.jpg"
      title="Maria Rodriguez"
      subtitle="Candidate for City Council"
      size="lg"
    />
    <Avatar 
      img="/images/manager.jpg"
      title="David Chen"
      subtitle="Campaign Manager"
      size="md"
    />
    <Avatar 
      initials="JS"  // Fallback when no image available
      title="Jennifer Smith"
      subtitle="Policy Director"
      type="info"    // Color scheme variant
      size="md"
    />
    <Avatar 
      initials="MJ"
      title="Marcus Johnson"  
      subtitle="Field Organizer"
      type="success"
      size="md"
    />
  </AvatarGroup>
</section>

<section className="endorsers-section">
  <h2>Community Endorsements</h2>
  <p>Supported by over 150 community leaders and organizations:</p>
  
  {/* Condensed layout shows many endorsers efficiently */}
  <AvatarGroup display="condensed">
    <Avatar img="/images/union-leader.jpg" title="Local 503 President" />
    <Avatar img="/images/teacher.jpg" title="Teachers Union Rep" />
    <Avatar initials="DR" title="Dr. Rodriguez, Healthcare Worker" />
    <Avatar initials="SW" title="Sarah Williams, Small Business Owner" />
    <Avatar initials="TJ" title="Rev. Thomas Jackson, Community Leader" />
    <Avatar initials="LH" title="Lisa Hayes, Environmental Activist" />
    <Avatar initials="RM" title="Roberto Martinez, Housing Advocate" />
    <Avatar initials="KP" title="Karen Park, Student Leader" />
    {/* Component automatically shows "+142 more" or similar */}
  </AvatarGroup>
</section>
```

---

## Learning Any Component API

> **🎯 Personal ROI:** These 5 steps will prevent you from spending your weekend googling "why doesn't this component work." Master this process once, apply it to any library forever.

### 1. **Start with Documentation**
Always check the official docs first—don't guess!

> **🔥 Time Saver:** 15 minutes reading docs saves 3 hours debugging wrong assumptions. Your future stressed-out self will thank you.

```bash
# For npm packages
npm docs accessible-astro-components

# Or check the GitHub repo
# Look for README.md, docs/ folder, or examples/ folder
```

### 2. **Use Context7 for Current Information**
Context7 ensures you get up-to-date documentation, not outdated tutorials:

```javascript
// In your development workflow
use context7
// Then ask: "Show me all props for AccordionItem component"
// Or: "How do I create a modal with accessible-astro-components?"
```

### 3. **Examine TypeScript Definitions**
In VS Code, hover over component names to see available props:

```javascript
<AccordionItem |  // Put cursor here, hover to see prop definitions
```

### 4. **Start Simple, Build Complexity**
Begin with the minimum working example, then add features:

```javascript
// Step 1: Minimal working example
<Badge>Event Status</Badge>

// Step 2: Add basic styling
<Badge type="success">Confirmed</Badge>

// Step 3: Add advanced features
<Badge 
  type="success" 
  size="lg"
  isButton
  animateOnHover
  label="Event status indicator for screen readers"
>
  Confirmed
</Badge>
```

### 5. **Study Working Examples**
Look at the components demo page (`/components-demo`) to see APIs in action.

---

## Building Your Own Component APIs

When creating components for your campaign site, follow these principles:

### ❌ **Poor API Design**
```javascript
// Hard to use, not flexible, unclear purpose
<EventCard>
  <div className="date">March 15</div>
  <div className="title">Rally</div>
  <div className="location">City Hall</div>
  <div className="free">true</div>
</EventCard>
```

### ✅ **Good API Design**
```javascript
// Clear, flexible, reusable, self-documenting
<EventCard 
  title="Climate Justice Rally"           // Clear purpose
  date={new Date('2024-03-15')}          // Proper data types
  location="City Hall"                    // Required information
  type="rally"                           // Categorization
  isFree={true}                          // Boolean for clear logic
  registrationRequired={false}           // Boolean for clear logic
  badges={['All Ages', 'Wheelchair Accessible']}  // Flexible list
  onRegisterClick={() => openModal()}    // Event handler
/>
```

### **API Design Principles**

1. **Required props should be obvious**
   ```javascript
   // Good: Clear what's required
   <EventCard title="Rally" date={date} location="City Hall" />
   ```

2. **Use proper data types**
   ```javascript
   // Good: JavaScript Date objects, not strings
   date={new Date('2024-03-15')}
   
   // Good: Booleans for true/false values
   isFree={true}
   
   // Good: Arrays for lists
   badges={['Free', 'All Ages']}
   ```

3. **Provide sensible defaults**
   ```javascript
   // Component should work with minimal props
   <EventCard title="Basic Event" />
   
   // But allow customization when needed
   <EventCard 
     title="Advanced Event"
     showDate={false}
     customLayout="compact"
   />
   ```

4. **Make APIs discoverable**
   ```javascript
   // Use TypeScript or PropTypes so developers can see options
   interface EventCardProps {
     title: string                    // Required
     date?: Date                     // Optional
     location?: string               // Optional  
     type?: 'rally' | 'meeting' | 'training'  // Limited options
     isFree?: boolean                // Optional with default
   }
   ```

---

## Best Practices for Movement Sites

> **🎯 Your Site's Reputation:** These practices separate professional-looking campaign sites from amateur ones. Follow them, and volunteers will trust your tech. Ignore them, and you'll get "your website doesn't work" complaints during the busiest campaign moments.

### 1. **Build for Everyone (Including Your Future Self)**

**The reality check:** You're only temporarily able-bodied. Build for your future self with a broken wrist, your supporter with low vision, and the volunteer trying to sign up on a cracked phone screen in bright sunlight.

**What accessibility gives you personally:**
- **Reputation insurance**: Never get called out for excluding disabled activists
- **SEO boost**: Google loves accessible sites (better search ranking = more donations)
- **Mobile optimization**: Most accessibility features improve mobile experience
- **Voice interaction**: Works with Siri, Alexa, and future voice tech you'll want
- **Future-proofing**: Accessible patterns adapt better to new devices and browsers

Every component should work when you can't use a mouse:

```javascript
// ✅ Good: Proper ARIA relationships
<Tabs>
  <TabsList>
    <TabsTab id="platform" controls="platform-panel">Platform</TabsTab>
  </TabsList>
  <TabsPanel id="platform-panel" labelledby="platform">
    Content...
  </TabsPanel>
</Tabs>

// ✅ Good: Meaningful labels for screen readers
<Badge 
  label="5 new volunteer signups this week"
  type="success"
>
  5
</Badge>
```

### 2. **Design for Organizers**
Components should make common campaign tasks easier:

```javascript
// Event management made simple
<EventCard 
  title="Volunteer Training"
  registrationUrl="/register/training-march"
  capacity={25}
  currentRegistrations={18}
  showCapacityWarning={true}
/>

// Donation tracking
<Badge 
  type="success" 
  label="Fundraising progress: 73% of monthly goal"
  isButton
  onClick={() => showDonationDetails()}
>
  $14,600 / $20,000
</Badge>
```

### 3. **Support Multiple Languages**
When building components for diverse communities:

```javascript
<EventCard 
  title="Community Meeting"
  titleEs="Reunión Comunitaria"           // Spanish title
  description="Monthly community input session"
  descriptionEs="Sesión mensual de participación comunitaria"
  translationAvailable={true}
  badges={['Translation Available', 'Traducción Disponible']}
/>
```

### 4. **Plan for Mobile-First**
Campaign volunteers often work on phones:

```javascript
<Card 
  title="Phone Bank Training"
  layout="mobile"                    // Optimized for small screens
  showFullDescription={false}        // Shorter text on mobile
  priorityAction="register"          // Primary button prominent
/>
```

### 5. **Make Content Shareable**
Help supporters spread the message:

```javascript
<EventCard 
  title="Housing Justice Rally"
  shareTitle="Join us at the Housing Justice Rally!"
  shareDescription="Stand with tenants demanding affordable housing"
  shareImage="/images/rally-share.jpg"
  enableSocialSharing={true}
/>
```

---

## Performance: Why Your Site Speed Affects Your Mission

> **💸 The Bottom Line:** Every second your site takes to load costs you 10% of potential volunteers. A slow donation form during a viral moment means less money for organizing. Fast sites = more impact.

### **Bundle Size: It's About More Than Code**

**The personal impact:**
- **Your reputation**: "The website is too slow" reflects on you personally
- **Your stress levels**: Servers crash when slow sites get traffic spikes
- **Your effectiveness**: Organizers abandon slow forms, donors give up on slow checkouts
- **Your budget**: Slow sites cost more to host and scale

**Tree shaking saves you from embarrassment:**

```javascript
// ❌ Importing everything (50kb bundle):
import { Badge } from '@components/AccessibleComponents.astro';
// Result: Slow loading, frustrated volunteers, crashed servers during viral moments

// ✅ Importing only what you need (4kb bundle):
import { Badge } from 'accessible-astro-components';
// Result: Instant loading, smooth signups, servers handle traffic spikes
```

**Real-world consequences:**

📱 **Mobile organizing**: Field organizers on slow data connections can actually use your site  
💰 **Fundraising**: Donation forms load before donors change their minds  
🚨 **Crisis response**: Action alerts work when everyone shares them simultaneously  
🗳️ **Voter registration**: Forms work on election day when traffic is highest  

> **🎯 Success Metric:** Your site should work perfectly on a volunteer's cracked phone with 2 bars of signal in a parking lot outside the polls. That's the test of real performance.

### **Import Strategy for Speed**

**For learning and production (RECOMMENDED):**
```javascript
// Direct imports = smaller bundles = happier users
import { Badge } from 'accessible-astro-components';
import CallToAction from '@components/CallToAction.astro';
```

**For demos and rapid prototyping only:**
```javascript
// Barrel imports = larger bundles = use sparingly
import { Badge, Modal, Accordion } from '@components/AccessibleComponents.astro';
```

> **💡 Pro Tip:** Your development experience might feel slower with direct imports, but your users' experience will be dramatically faster. Choose user speed over developer convenience—that's what good organizers do.

---

## Common Patterns Reference

### **Boolean Props (true/false values)**
```javascript
<Component open />                    // Shorthand for open={true}
<Component disabled={false} />        // Explicit false
<Component showIcon={userPreference} />  // Variable boolean
```

### **Enum Props (limited string options)**
```javascript
<Badge type="success" />              // Only: success, warning, error, info
<Button size="lg" />                  // Only: sm, md, lg
<Modal position="center" />           // Only: center, top, bottom
```

### **Function Props (event handlers)**
```javascript
<Button onClick={() => console.log('Clicked!')} />
<Modal onOpen={() => trackEvent('modal_opened')} />
<Form onSubmit={(data) => submitToServer(data)} />
```

### **Array Props (lists of items)**
```javascript
<TagList tags={['Housing', 'Climate', 'Healthcare']} />
<Badge badges={[
  { text: 'Free', type: 'success' },
  { text: 'All Ages', type: 'info' }
]} />
```

### **Object Props (complex configuration)**
```javascript
<Map 
  location={{
    address: '123 Main St',
    city: 'Springfield', 
    coordinates: { lat: 40.7128, lng: -74.0060 }
  }}
  mapOptions={{
    zoom: 15,
    showTraffic: false,
    style: 'street'
  }}
/>
```

---

## Troubleshooting Guide

### **Component Not Rendering**

```javascript
// ❌ Check: Is the component imported correctly?
import { AccordionItem } from 'accessible-astro-components'  // Missing Accordion?

// ✅ Fix: Import all needed components
import { Accordion, AccordionItem } from 'accessible-astro-components'

// ❌ Check: Are you using the old API?
<Accordion>
  <div slot="header">Title</div>  // Old slot-based API
</Accordion>

// ✅ Fix: Use modern props API
<Accordion>
  <AccordionItem title="Title">Content</AccordionItem>
</Accordion>
```

### **Props Not Working**

```javascript
// ❌ Check: Typos in prop names
<Badge tpye="success" />  // Should be "type"

// ✅ Fix: Use exact prop names from documentation
<Badge type="success" />

// ❌ Check: Wrong data types  
<EventCard date="March 15" />  // String instead of Date

// ✅ Fix: Use correct data types
<EventCard date={new Date('2024-03-15')} />
```

### **Accessibility Issues**

```javascript
// ❌ Check: Missing labels for interactive elements
<Badge isButton>5</Badge>

// ✅ Fix: Add descriptive labels
<Badge isButton label="5 new volunteer signups">5</Badge>

// ❌ Check: Wrong heading hierarchy
<AccordionItem tagName="h1" />  // Should match page structure

// ✅ Fix: Use appropriate heading levels
<AccordionItem tagName="h3" />  // If this is under an h2
```

### **Styling Problems**

```javascript
// ❌ Check: CSS conflicts with component styles
.my-custom-class {
  color: red !important;  // Overriding component styles
}

// ✅ Fix: Use component's built-in variants
<Badge type="error">Error</Badge>  // Uses theme's error color

// ✅ Or: Use CSS custom properties to customize theme
:root {
  --badge-error-color: #dc2626;  // Customize error color globally
}
```

### **Performance Issues**

```javascript
// ❌ Check: Recreating objects in render
<EventCard 
  date={new Date('2024-03-15')}  // New object every render
  badges={['Free', 'All Ages']}  // New array every render
/>

// ✅ Fix: Move static data outside component or use useMemo
const eventDate = new Date('2024-03-15')
const eventBadges = ['Free', 'All Ages']

<EventCard 
  date={eventDate}
  badges={eventBadges}
/>
```

---

## Getting Help

### **Resources for Learning More**

1. **Official Documentation**
   - Always start with the component library's official docs
   - Look for examples and API reference sections

2. **Context7 for Up-to-Date Info**
   ```
   use context7
   "Show me examples of accessible-astro-components Modal component"
   ```

3. **Community Resources**
   - GitHub Issues for the component library
   - Movement tech communities and forums
   - Accessibility-focused developer groups

4. **Browser Developer Tools**
   - Inspect elements to see how components render
   - Check console for warnings about prop usage
   - Test keyboard navigation and screen readers

### **When to Ask for Help**

- Documentation is unclear or missing
- Component behavior doesn't match expectations  
- Accessibility concerns or test failures
- Performance issues with component usage
- Need help designing APIs for custom components

### **How to Ask Good Questions**

1. **Include minimal reproducible example**
   ```javascript
   // This isn't working as expected:
   <AccordionItem title="Question" open>
     <p>Answer content</p>
   </AccordionItem>
   // Expected: Should start open
   // Actual: Starts closed
   ```

2. **Mention what you've tried**
   "I checked the documentation and tried using `open={true}` instead of `open`, but still having the same issue."

3. **Include error messages**
   Copy the exact error from browser console or build process.

4. **Specify your context**
   "Building a campaign FAQ section for mobile-first audience with screen reader support required."

---

## Conclusion

> **🏆 What You've Gained:** You now understand the difference between code that works and code that works *reliably*. You can protect your future self from debugging disasters, build sites that won't embarrass you, and create tools that work for everyone—including you when you're tired, stressed, or dealing with broken devices.

Understanding component APIs is essential for building effective movement websites. Good APIs help you:

- **Protect your time and sanity** with less debugging and more focus on organizing
- **Build for your future self** who might be disabled, exhausted, or using broken equipment
- **Create professional-quality sites** that handle traffic spikes and work in crisis moments
- **Scale your impact** by reusing patterns that work across campaigns and organizations

> **🎯 Your Personal ROI:** Every hour you spend learning these patterns saves you five hours of debugging, prevents dozens of "the website is broken" calls, and builds your reputation as someone who creates tech that actually works when it matters most.

**The beautiful alignment:** When you build for your future disabled self, you automatically build for everyone who's currently disabled. When you optimize for your stressed, overwhelmed state, you create better experiences for everyone under pressure. Self-interest and solidarity aren't opposites—they're the same thing.

**Your users aren't "other people"—they're you, in different circumstances.**

Remember: **Technology should serve justice, not corporate profits.** By mastering component APIs, you're building tools that redistribute power and support community organizing. But you're also protecting yourself, your reputation, and your ability to sleep peacefully knowing your code won't fail when movements need it most.

The time you invest in learning these patterns pays dividends in every campaign site, volunteer portal, and organizing tool you build. That's technology in service of movements—and in service of the person you'll be tomorrow.

> **📚 Next Step:** Read [Why Accessibility Helps YOU](why-accessibility-helps-you.md) to dive deeper into how accessible design protects your future self while building more just technology.

---

*This guide is part of the Movement Starter Template documentation. For updates and community contributions, visit our GitHub repository.*