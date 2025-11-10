import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-applicants-parent',
  templateUrl: './applicants-parent.component.html',
  styleUrls: ['./applicants-parent.component.css']
})
export class ApplicantsParentComponent {
  showScrollTop: boolean = false;
  withNavigation: boolean = false;
  isSidebarOpen: boolean = true;
  items: MenuItem[] = [];
  home!: MenuItem;

  constructor(
    private router: Router
  ) {
    this.home = { 
      icon: 'fa-solid fa-house text-md', 
      routerLink: '/applications' 
    };

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial load
    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    const trackRegex = /^TRK-\d{4}-\d{6}$/;

    const segments = this.router.url
      .split('/')
      .filter(seg => seg);

    let url = '';
    this.items = segments.map(segment => {
      url += `/${segment}`;

      let label: string;

      if (uuidRegex.test(segment) || trackRegex.test(segment)) {
        label = 'Application Details';
      } else {
        label = this.capitalize(segment);
      }

      return { label, routerLink: url };
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}