/**
 * scrollFX - Usage Guide
 * 
 * Professional scroll animations inspired by linkwaychennai.in
 * Clean, subtle, sophisticated motion layer
 */

// ============================================
// SETUP (Already Done)
// ============================================

// In main.tsx:
import scrollFX from './scrollFX';

window.addEventListener('DOMContentLoaded', () => {
  scrollFX.init();
});

// After dynamic content changes:
scrollFX.refresh();

// Cleanup:
scrollFX.destroy();

<h1 data-hero-title>EyeQ Vision</h1>

// Hero subtitle - fades up after title
<p data-hero-subtitle>Riding the Vibe Wave</p>

// Hero CTA - soft float in
<div data-hero-cta>
  <button>Get Started</button>
</div>

<h1 
  data-hero-title
  data-duration="0.8"
  data-stagger="0.06"
  data-delay="0.3"
>
  Custom Title
</h1>

<section data-reveal>
  Content fades up when entering viewport
</section>

// Slide from left
<div data-reveal-left>
  Slides in from left
</div>

// Slide from right
<div data-reveal-right>
  Slides in from right
</div>

// Clip reveal - vertical wipe effect
<div data-clip-reveal>
  Wipes in from top to bottom
</div>

// Scale in - subtle zoom
<div data-scale-in>
  Scales up slightly while fading in
</div>

// Staggered list/cards
<div data-stagger data-stagger="0.08">
  <div data-stagger-item>Item 1</div>
  <div data-stagger-item>Item 2</div>
  <div data-stagger-item>Item 3</div>
</div>

/**
 * 3. PARALLAX
 */

// Vertical parallax (moves -40px to +40px)
<div data-parallax-y>
  Background image or element
</div>

// Custom intensity (0-1)
<div data-parallax-y data-intensity="0.5">
  Subtle parallax
</div>

<div data-parallax-y data-intensity="1.5">
  Strong parallax
</div>

/**
 * 4. PINNED STEP SECTION
 */

<div data-pin>
  <div data-step>Step 1 content</div>
  <div data-step>Step 2 content</div>
  <div data-step>Step 3 content</div>
</div>

// Container pins to viewport
// Steps fade/slide in sequence as user scrolls

/**
 * 5. COUNTERS
 */

// Basic counter (0 to 100)
<div data-counter data-target="100">0</div>

// Float counter with decimals
<div 
  data-counter 
  data-target="99.9"
  data-format="float"
  data-decimals="1"
>
  0.0
</div>

// Stats example
<div data-counter data-target="50">0</div>+ Active Members
<div data-counter data-target="100">0</div>+ Projects

/**
 * 6. PROGRESS BAR
 */

// Fixed top progress bar (auto-scales 0 to 100%)
<div data-progress></div>

// Add to App.tsx or index.html

/**
 * 7. NAVIGATION EFFECTS
 */

// Nav gets data-scrolled attribute after scrolling 24px
<nav>
  <!-- Your nav content -->
</nav>

// Style in CSS:
// nav[data-scrolled] { box-shadow: ... }

// Back to top button (fades in after scrolling 60vh)
<button data-back-to-top onClick={() => window.scrollTo({top: 0})}>
  ↑
</button>

// ============================================
// CUSTOM TIMING (via data attributes)
// ============================================

<div 
  data-reveal
  data-duration="1.2"     // Custom duration (seconds)
  data-delay="0.5"        // Custom delay (seconds)
  data-ease="power3.out"  // Custom easing
>
  Slow reveal with delay
</div>

// ============================================
// REACT COMPONENT EXAMPLES
// ============================================

// Hero Section
export const Hero = () => (
  <section className="hero">
    <h1 data-hero-title>Welcome to EyeQ</h1>
    <p data-hero-subtitle>Computer Vision Club</p>
    <div data-hero-cta>
      <button>Join Now</button>
    </div>
  </section>
);

// Feature Cards with Stagger
export const Features = () => (
  <div data-stagger>
    {features.map((feature) => (
      <div key={feature.id} data-stagger-item>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </div>
);

// Stats with Counters
export const Stats = () => (
  <div>
    <div>
      <span data-counter data-target="50">0</span>+
      <p>Members</p>
    </div>
    <div>
      <span data-counter data-target="100">0</span>+
      <p>Projects</p>
    </div>
  </div>
);

// Parallax Background
export const Section = () => (
  <section>
    <div data-parallax-y data-intensity="0.6">
      <img src="background.jpg" alt="" />
    </div>
    <div data-reveal>
      <h2>Content</h2>
    </div>
  </section>
);

// Pinned Steps
export const Process = () => (
  <div data-pin>
    <div data-step>
      <h2>Step 1</h2>
      <p>Description...</p>
    </div>
    <div data-step>
      <h2>Step 2</h2>
      <p>Description...</p>
    </div>
    <div data-step>
      <h2>Step 3</h2>
      <p>Description...</p>
    </div>
  </div>
);

// ============================================
// ACCESSIBILITY
// ============================================

/**
 * Reduced Motion:
 * - Automatically detected via prefers-reduced-motion media query
 * - Disables Lenis (uses native scroll)
 * - Skips animations, shows final states
 * - ScrollTrigger still works for dynamic content
 * 
 * Users can enable in:
 * - macOS: System Preferences → Accessibility → Display → Reduce Motion
 * - Windows: Settings → Ease of Access → Display → Show animations
 */

// ============================================
// PERFORMANCE TIPS
// ============================================

/**
 * 1. RAF automatically pauses when tab is hidden
 * 2. ScrollTrigger refreshes after fonts/images load
 * 3. Resize handler is debounced (150ms)
 * 4. Use data-reveal for simple fades (most performant)
 * 5. Limit parallax elements (GPU intensive)
 * 6. Call scrollFX.refresh() after adding dynamic content
 */

// ============================================
// DEBUGGING
// ============================================

// In browser console:

// Check if initialized
console.log('scrollFX initialized:', window.scrollFX);

// Manually refresh
scrollFX.refresh();

// View all ScrollTriggers
ScrollTrigger.getAll();

// Kill all animations
scrollFX.destroy();

// Re-initialize
scrollFX.init();

// ============================================
// EXAMPLES FROM YOUR SITE
// ============================================

// Update Index.tsx hero section:
<section id="home">
  <div>
    <h1 data-hero-title>EyeQ</h1>
    <div data-hero-subtitle>
      <RotatingText texts={["See", "Code", "Create"]} />
    </div>
    <p data-hero-subtitle data-delay="0.8">
      Riding the Vibe Wave in Computer Vision!
    </p>
    <div data-hero-cta data-delay="1.1">
      <button>Learn More</button>
      <button>Explore</button>
    </div>
  </div>
</section>

// Add to existing sections:
<section data-reveal>
  <h2>What Makes EyeQ Different?</h2>
  <!-- existing content -->
</section>

<div data-stagger>
  {teamMembers.map((member) => (
    <div key={member.name} data-stagger-item>
      <TeamMember {...member} />
    </div>
  ))}
</div>

// Stats section:
<div data-reveal>
  <div data-counter data-target="50">0</div>
  <p>Active Members</p>
</div>

// Add progress bar to App.tsx:
<>
  <div data-progress />
  <Navbar />
  {/* rest of app */}
</>

export default {};
