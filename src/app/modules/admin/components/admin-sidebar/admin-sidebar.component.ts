import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, skip } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';
import { SidebarService } from 'src/app/sidebar.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  // Expanded whenever the current URL is under /admin/applications (list or an
  // individual application's detail page), derived from the route itself
  // rather than tracked per-link, so it stays correct without hardcoding.
  isApplicationsOpen = false;
  fullName = '';

  // Below the md breakpoint the sidebar becomes an off-canvas drawer, toggled by the
  // hamburger button in admin-header.component.html via the shared SidebarService.
  isMobileOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: UserProfileService,
    private sidebarService: SidebarService,
  ) {
    this.updateApplicationsExpanded(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.updateApplicationsExpanded(event.urlAfterRedirects));

    // BehaviorSubject replays its current value immediately on subscribe, skip that
    // one so only actual toggleSidebar() clicks flip the drawer open/closed.
    this.sidebarService.sidebarState$.pipe(skip(1)).subscribe(() => {
      this.isMobileOpen = !this.isMobileOpen;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => (this.isMobileOpen = false));
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile: any) => {
        this.fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
      },
      error: () => {
        // Non-critical: the sidebar still works without a display name.
      }
    });
  }

  private updateApplicationsExpanded(url: string): void {
    this.isApplicationsOpen = url.startsWith('/admin/applications');
  }

  toggleApplicationsDropdown(): void {
    this.isApplicationsOpen = !this.isApplicationsOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileOpen = false;
  }

  logout(): void {
    // Auth0 is not used in this demo (no real backend/external auth), so logout only clears
    // the local demo session instead of redirecting to Auth0's hosted logout page.
    localStorage.clear();

    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error("Error logging out:", err);
        this.router.navigate(['/']);
      }
    });
  }
}
