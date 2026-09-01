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
      icon: 'ti ti-home text-md', 
      routerLink: '/applications' 
    };

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    const trackRegex = /^TRK-\d{4}-\d{6}$/;

    const segments = this.router.url
      .split('/')
      .filter(seg => 
        seg &&
        seg !== 'admin'
      );

    let url = '';
    this.items = segments.map(segment => {
      url += `/${segment}`;

      const label = uuidRegex.test(segment)
        ? 'Application Details'
        : this.formatLabel(segment);
      return { 
        label: label,
        routerLink: url
      };
    });
  }

  formatLabel(text: string): string {
    return text
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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