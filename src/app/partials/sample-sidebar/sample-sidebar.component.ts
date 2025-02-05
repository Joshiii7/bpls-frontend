import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-sample-sidebar',
  templateUrl: './sample-sidebar.component.html',
  styleUrls: ['./sample-sidebar.component.css']
})
export class SampleSidebarComponent {
  // @Input('isSideBarOpen') isSidebarOpen: boolean = true;
  isSidebarOpen: boolean = true;
  isMdOrBelow = false;
  sideMenu: any;
  default: any;
  roleID: any;
  isDropdownOpen: boolean = false;
  isHovered: boolean = false;

  dropdownHeight: number = 0;

  constructor(
    private router: Router,
    private auth: Auth0Service,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarState$.subscribe((state) => {
      this.isSidebarOpen = state;
    });

    const storedDropdownState = localStorage.getItem('ddOpen');
    this.isDropdownOpen = storedDropdownState === 'true';

    this.isMdOrBelow = window.innerWidth < 1024;

    this.defaultSidebar();
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

  getRoleFunction() {
    this.roleID = localStorage.getItem('r');
  }

  sidebarMenu(num: number) {
    localStorage.setItem('sn', `${num}`);
    this.sideMenu = num;
    this.navigateToMenu(this.sideMenu);
  }

  navigateToMenu(num: number) {
    if (num === 1) {
      this.router.navigate(['dashboard']);
    } else if (num === 2) {
      this.router.navigate(['my-application']);
    } else if (num === 4) {
      this.logout();
    } else if (num === 5) {
      this.router.navigate(['admin-dashboard']);
    } else if (num === 6) {
      this.router.navigate(['applications'])
    } else if (num === 9) {
      this.logout();
    }
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
