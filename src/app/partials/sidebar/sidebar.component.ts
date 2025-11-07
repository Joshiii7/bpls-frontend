import { ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // @Input('isSideBarOpen') isSidebarOpen: boolean = true;
  isSidebarOpen: boolean = true;
  isMdOrBelow = false;
  sideMenu: any;
  default: any;
  roleID: any;
  isDropdownOpen: boolean = false;
  isHovered: boolean = false;

  dropdownHeight: number = 0;

  currentRoute: string = '';

  constructor(
    private router: Router,
    private auth: Auth0Service,
    private sidebarService: SidebarService,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.sidebarService.sidebarState$.subscribe((state) => {
      this.isSidebarOpen = state;
    });

    const storedDropdownState = localStorage.getItem('ddOpen');
    this.isDropdownOpen = storedDropdownState === 'true';

    this.isMdOrBelow = window.innerWidth < 1024;

    this.defaultSidebar();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setSideMenuFromRoute(event.url);
      }
    });

    // Set sideMenu based on the stored value
    const storedMenu = localStorage.getItem('sn');
    if (storedMenu) {
      this.sideMenu = Number(storedMenu);
    }
  }

  defaultSidebar() {
    const role = localStorage.getItem('r');
    const sn = localStorage.getItem('sn');
    if (role == '1') {
      this.default = 5;
    } else if (role == '2') {
      this.default = 1;
    }

    this.sideMenu = sn ? +sn : this.default;

    this.getRoleFunction();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event.target.innerWidth);
    this.isMdOrBelow = event.target.innerWidth < 1024;
  }

  onHover(state: boolean) {
    this.isHovered = state;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    localStorage.setItem('ddOpen', this.isDropdownOpen.toString());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarService.toggleSidebar();
  }

  onSidebarClick(event: Event) {
    event.stopPropagation();
  }

  getRoleFunction() {
    this.roleID = localStorage.getItem('r');
  }

  sidebarMenu(num: number) {
    localStorage.setItem('sn', `${num}`);
    this.sideMenu = num;
    this.cdRef.detectChanges();
    this.navigateToMenu(this.sideMenu);
  }

  navigateToMenu(num: number) {
    const routes: Record<number, string> = {
      1: 'admin-dashboard',
      2: 'applications',
      3: 'approved-applications',
      4: 'declined-applications',
      5: 'permit-schedule',
      6: 'logout',
    };
  
    if (routes[num]) {
      if (num === 6) {
        this.logout();
      } else {
        this.router.navigate([routes[num]]);
      }
    }
  }
  
  setSideMenuFromRoute(url: string) {
    if (url.includes('/dashboard')) {
      this.sideMenu = 1;
    } else if (url.includes('/my-application')) {
      this.sideMenu = 2;
    } else if (url.includes('/admin-dashboard')) {
      this.sideMenu = 5;
    } else if (url.includes('/applications')) {
      this.sideMenu = 6;
    }

    localStorage.setItem('sn', this.sideMenu.toString());

    this.cdRef.detectChanges();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

    localStorage.clear();

    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
