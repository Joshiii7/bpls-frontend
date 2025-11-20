import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  isApplicationsOpen: boolean = false;
  dropdownHeight: number = 0;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private auth: Auth0Service,
  ) {

    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;
        }
    });
  }

  toggleApplicationsDropdown() {
    this.isApplicationsOpen = !this.isApplicationsOpen;
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
