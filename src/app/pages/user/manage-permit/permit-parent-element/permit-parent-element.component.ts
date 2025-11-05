import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-permit-parent-element',
  templateUrl: './permit-parent-element.component.html',
  styleUrls: ['./permit-parent-element.component.css']
})
export class PermitParentElementComponent {
  withNavigation: boolean = false;
  isSidebarOpen: boolean = true;
  items: MenuItem[] = [];
  home!: MenuItem;
  showScrollTop = false;

  constructor(
    private router: Router
  ) {
    this.home = { 
      icon: 'fa-solid fa-house text-md', 
      routerLink: '/application' 
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
      .filter(seg => seg && !uuidRegex.test(seg) && !trackRegex.test(seg));

    
    let url = '';
    this.items = segments.map(segment => {
      url += `/${segment}`;
      return { label: this.capitalize(segment), routerLink: url };
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
