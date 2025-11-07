import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  title = 'Business Permit and Licensing System';
  isLoggedIn = localStorage.getItem('loggedIn') !== null;
  currentTime: any;
  
  dropDownMenu: boolean = false;
  isSidebarOpen = true;

  items: MenuItem[] = [];
  home!: MenuItem;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private sidebarService: SidebarService
  ) {}

  ngOnInit():void {
    // console.log(this.isLoggedIn);
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    const role = localStorage.getItem('r');

    this.home = { 
      icon: 'fa-solid fa-house text-white', 
      routerLink: role === '1' ? '/admin-dashboard' : '/dashboard' 
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
    const segments = this.router.url.split('/').filter(seg => seg && !uuidRegex.test(seg));
    
    let url = '';
    this.items = segments.map(segment => {
      url += `/${segment}`;
      return { label: this.capitalize(segment), routerLink: url };
    });
  }
  

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  updateTime(): void {
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateString = now.toLocaleDateString('en-US', {
      timeZone: timeZone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    this.currentTime = `${dateString}, ${timeString}`;
  }

  dropDown() {
    this.dropDownMenu =! this.dropDownMenu;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarService.toggleSidebar();
  }
}
