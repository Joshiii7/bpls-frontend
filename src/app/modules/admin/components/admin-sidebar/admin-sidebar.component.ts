import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
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
    private apiService: AuthService
  ) {

     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;

        const appRoutes = [
          '/admin/review-permit',
          '/admin/approved-applications',
          '/admin/declined-applications'
        ];
        this.isApplicationsOpen = appRoutes.some(route => this.currentRoute.startsWith(route));
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

    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error logging out:", err);
      }
    });
  }
}
