import { Component, HostListener } from '@angular/core';

// Shared across every public page (Home renders it directly; the other
// public pages get it through PublicParentComponent) so "back to top"
// behaves identically everywhere instead of each page wiring its own copy.
@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.css']
})
export class BackToTopComponent {
  showScrollTop = false;

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
}
