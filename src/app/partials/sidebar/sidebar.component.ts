import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input('isSideBarOpen') isSidebarOpen: boolean = true;
  // sideMenu = localStorage.getItem('sn');
  // sideMenuNumber: number = 1;
  sideMenu: any;
  default: any;
  isHovered: boolean = false;
  // isSidebarOpen: boolean = true;

  // default is user role
  roleID: any;
  constructor(
    private router: Router, 
    private auth: Auth0Service,
  ) {  }

  ngOnInit(): void {
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

  onHover(hoverState: boolean): void {
    this.isHovered = hoverState;
  }

  close() {
    this.isSidebarOpen = !this.isSidebarOpen;
    // console.log(this.isSidebarOpen);
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
