import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Subtle fade/slide-in for public-page sections and cards as they scroll into
// view (paired with the .reveal-on-scroll / .is-visible CSS in styles.css).
// Reveals once per element then stops observing, this is a one-time entrance
// effect, not a scroll-tracking animation, so it stays cheap. Falls back to
// showing content immediately when the browser lacks IntersectionObserver or
// the user has requested reduced motion.
@Directive({
  selector: '[appReveal]'
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement;
    this.renderer.addClass(nativeEl, 'reveal-on-scroll');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      this.renderer.addClass(nativeEl, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(nativeEl, 'is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(nativeEl);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
