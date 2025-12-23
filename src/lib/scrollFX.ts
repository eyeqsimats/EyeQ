/**
 * scrollFX - Professional scroll-based animations
 * Inspired by linkwaychennai.in: clean, subtle, crisp
 * 
 * @requires gsap, @studio-freight/lenis, split-type
 */

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Default animation settings
  ease: 'power2.out',
  duration: 0.6,
  stagger: 0.04,
  
  // Lenis settings
  lenis: {
    duration: 1.0,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  },
  
  // Reveal settings
  reveal: {
    distance: 24,
    opacity: 0,
  },
  
  // Parallax settings
  parallax: {
    y: 40,
  },
};

// ============================================
// SCROLL FX CLASS
// ============================================

class ScrollFX {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private isInitialized = false;
  private prefersReducedMotion = false;
  private splitInstances: SplitType[] = [];

  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ============================================
  // PUBLIC API
  // ============================================

  public init(): void {
    if (this.isInitialized) {
      console.warn('[scrollFX] Already initialized');
      return;
    }

    console.log('[scrollFX] Initializing...');

    // Setup smooth scroll (unless reduced motion)
    if (!this.prefersReducedMotion) {
      this.initLenis();
    } else {
      console.log('[scrollFX] Reduced motion detected - using native scroll');
    }

    // Setup all animations
    this.setupHeroEntrance();
    this.setupReveals();
    this.setupParallax();
    this.setupPinnedSection();
    this.setupCounters();
    this.setupProgressBar();
    this.setupNavEffects();

    // Performance optimizations
    this.setupVisibilityHandler();
    this.setupLoadHandlers();

    this.isInitialized = true;
    console.log('[scrollFX] Initialized successfully');
  }

  public refresh(): void {
    ScrollTrigger.refresh();
    console.log('[scrollFX] Refreshed');
  }

  public destroy(): void {
    if (!this.isInitialized) return;

    this.stopRAF();
    
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Revert split text
    this.splitInstances.forEach(instance => instance.revert());
    this.splitInstances = [];

    this.isInitialized = false;
    console.log('[scrollFX] Destroyed');
  }

  // ============================================
  // LENIS SMOOTH SCROLL
  // ============================================

  private initLenis(): void {
    this.lenis = new Lenis(CONFIG.lenis);

    // Setup ScrollTrigger proxy
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: (value) => {
        if (!this.lenis) return 0;
        if (arguments.length) {
          this.lenis.scrollTo(value as number, { immediate: true });
        }
        return this.lenis.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        right: window.innerWidth,
        bottom: window.innerHeight,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    // Start RAF loop
    this.startRAF();
  }

  private startRAF(): void {
    const raf = (time: number) => {
      if (this.lenis) {
        this.lenis.raf(time);
        ScrollTrigger.update();
      }
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  private stopRAF(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // ============================================
  // HERO ENTRANCE
  // ============================================

  private setupHeroEntrance(): void {
    // Hero title - split and stagger
    const heroTitle = document.querySelector('[data-hero-title]') as HTMLElement;
    if (heroTitle) {
      if (this.prefersReducedMotion) {
        gsap.set(heroTitle, { opacity: 1 });
      } else {
        const split = new SplitType(heroTitle, { types: 'chars' });
        this.splitInstances.push(split);

        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: this.getAttr(heroTitle, 'duration', CONFIG.duration),
            stagger: this.getAttr(heroTitle, 'stagger', CONFIG.stagger),
            ease: this.getAttr(heroTitle, 'ease', CONFIG.ease),
            delay: this.getAttr(heroTitle, 'delay', 0.2),
          }
        );
      }
    }

    // Hero subtitle - fade up
    const heroSubtitle = document.querySelector('[data-hero-subtitle]') as HTMLElement;
    if (heroSubtitle) {
      if (this.prefersReducedMotion) {
        gsap.set(heroSubtitle, { opacity: 1 });
      } else {
        gsap.fromTo(
          heroSubtitle,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: this.getAttr(heroSubtitle, 'duration', CONFIG.duration),
            ease: this.getAttr(heroSubtitle, 'ease', CONFIG.ease),
            delay: this.getAttr(heroSubtitle, 'delay', 0.6),
          }
        );
      }
    }

    // Hero CTA - soft float in
    const heroCTA = document.querySelector('[data-hero-cta]') as HTMLElement;
    if (heroCTA) {
      if (this.prefersReducedMotion) {
        gsap.set(heroCTA, { opacity: 1 });
      } else {
        gsap.fromTo(
          heroCTA,
          { opacity: 0, y: 16, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: this.getAttr(heroCTA, 'duration', CONFIG.duration),
            ease: this.getAttr(heroCTA, 'ease', 'back.out(1.2)'),
            delay: this.getAttr(heroCTA, 'delay', 0.9),
          }
        );
      }
    }
  }

  // ============================================
  // SECTION REVEALS
  // ============================================

  private setupReveals(): void {
    if (this.prefersReducedMotion) {
      // Set final states
      gsap.set('[data-reveal], [data-reveal-left], [data-reveal-right], [data-clip-reveal], [data-scale-in]', {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      });
      return;
    }

    // Basic reveal - fade up
    this.setupReveal('[data-reveal]', { y: CONFIG.reveal.distance });

    // Reveal from left
    this.setupReveal('[data-reveal-left]', { x: -CONFIG.reveal.distance });

    // Reveal from right
    this.setupReveal('[data-reveal-right]', { x: CONFIG.reveal.distance });

    // Clip reveal - vertical wipe
    document.querySelectorAll('[data-clip-reveal]').forEach((element) => {
      gsap.fromTo(
        element,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: this.getAttr(element as HTMLElement, 'duration', 0.8),
          ease: this.getAttr(element as HTMLElement, 'ease', 'power2.inOut'),
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    // Scale in - subtle zoom
    this.setupReveal('[data-scale-in]', { scale: 0.94 });

    // Stagger groups
    document.querySelectorAll('[data-stagger]').forEach((container) => {
      const items = container.querySelectorAll('[data-stagger-item]');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: CONFIG.reveal.distance },
          {
            opacity: 1,
            y: 0,
            duration: this.getAttr(container as HTMLElement, 'duration', CONFIG.duration),
            stagger: this.getAttr(container as HTMLElement, 'stagger', CONFIG.stagger),
            ease: this.getAttr(container as HTMLElement, 'ease', CONFIG.ease),
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    });
  }

  private setupReveal(selector: string, from: gsap.TweenVars): void {
    document.querySelectorAll(selector).forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: CONFIG.reveal.opacity, ...from },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: this.getAttr(element as HTMLElement, 'duration', CONFIG.duration),
          ease: this.getAttr(element as HTMLElement, 'ease', CONFIG.ease),
          delay: this.getAttr(element as HTMLElement, 'delay', 0),
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });
  }

  // ============================================
  // PARALLAX & DEPTH
  // ============================================

  private setupParallax(): void {
    if (this.prefersReducedMotion) return;

    document.querySelectorAll('[data-parallax-y]').forEach((element) => {
      const intensity = this.getAttr(element as HTMLElement, 'intensity', 1);
      const yRange = CONFIG.parallax.y * intensity;

      gsap.fromTo(
        element,
        { y: yRange },
        {
          y: -yRange,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  // ============================================
  // PINNED STEP SECTION
  // ============================================

  private setupPinnedSection(): void {
    const pinContainer = document.querySelector('[data-pin]') as HTMLElement;
    if (!pinContainer) return;

    const steps = pinContainer.querySelectorAll('[data-step]');
    if (steps.length === 0) return;

    if (this.prefersReducedMotion) {
      // Show all steps
      gsap.set(steps, { opacity: 1, y: 0 });
      return;
    }

    // Pin the container
    ScrollTrigger.create({
      trigger: pinContainer,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: true,
    });

    // Animate each step
    steps.forEach((step, index) => {
      const progress = index / steps.length;
      const nextProgress = (index + 1) / steps.length;

      gsap.fromTo(
        step,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: pinContainer,
            start: `top+=${progress * 100}% top`,
            end: `top+=${nextProgress * 100}% top`,
            scrub: true,
          },
        }
      );

      // Fade out as next comes in
      if (index < steps.length - 1) {
        gsap.to(step, {
          opacity: 0,
          y: -20,
          scrollTrigger: {
            trigger: pinContainer,
            start: `top+=${nextProgress * 100}% top`,
            end: `top+=${(nextProgress + 0.1) * 100}% top`,
            scrub: true,
          },
        });
      }
    });
  }

  // ============================================
  // COUNTERS
  // ============================================

  private setupCounters(): void {
    document.querySelectorAll('[data-counter]').forEach((element) => {
      const target = parseFloat(element.getAttribute('data-target') || '100');
      const format = element.getAttribute('data-format') || 'int';
      const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);

      const counter = { value: 0 };

      gsap.to(counter, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          const formatted = format === 'float'
            ? counter.value.toFixed(decimals)
            : Math.round(counter.value).toString();
          element.textContent = formatted;
        },
      });
    });
  }

  // ============================================
  // PROGRESS BAR
  // ============================================

  private setupProgressBar(): void {
    const progressBar = document.querySelector('[data-progress]') as HTMLElement;
    if (!progressBar) return;

    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left' });

    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  // ============================================
  // NAV EFFECTS
  // ============================================

  private setupNavEffects(): void {
    // Sticky nav scrolled state
    const nav = document.querySelector('nav');
    if (nav) {
      ScrollTrigger.create({
        start: 24,
        end: 'max',
        onUpdate: (self) => {
          if (self.direction === 1 && self.progress > 0.01) {
            nav.setAttribute('data-scrolled', 'true');
          } else if (self.direction === -1 && self.progress < 0.01) {
            nav.removeAttribute('data-scrolled');
          }
        },
      });
    }

    // Back to top button
    const backToTop = document.querySelector('[data-back-to-top]') as HTMLElement;
    if (backToTop) {
      gsap.set(backToTop, { opacity: 0, scale: 0.8 });

      ScrollTrigger.create({
        start: '60vh',
        end: 'max',
        onEnter: () => gsap.to(backToTop, { opacity: 1, scale: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(backToTop, { opacity: 0, scale: 0.8, duration: 0.3 }),
      });
    }
  }

  // ============================================
  // PERFORMANCE & LIFECYCLE
  // ============================================

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopRAF();
      } else if (this.lenis && !this.rafId) {
        this.startRAF();
      }
    });
  }

  private setupLoadHandlers(): void {
    // Refresh after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => this.refresh());
    }

    // Refresh after images load
    window.addEventListener('load', () => this.refresh());

    // Debounced resize refresh
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => this.refresh(), 150);
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  private getAttr(element: HTMLElement, attr: string, fallback: any): any {
    const value = element.getAttribute(`data-${attr}`);
    if (value === null) return fallback;
    
    // Try to parse as number
    const num = parseFloat(value);
    if (!isNaN(num)) return num;
    
    return value;
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

const scrollFX = new ScrollFX();

export default scrollFX;
