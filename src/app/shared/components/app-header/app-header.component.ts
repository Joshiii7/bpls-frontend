import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';

// The one header for the entire site, public pages and the authenticated
// applicant area alike. Which nav/branding it shows is driven purely by
// AuthStateService, not by which route rendered it, so a signed-in user keeps
// seeing the authenticated header on public pages (Home, Services, Requirements,
// Contact, ...) instead of the session feeling like it drops the moment they
// leave /applications. Logging out, from any page, flips it straight back.
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  isLoggedIn$ = this.authState.isLoggedIn$;

  isAccountMenuOpen = false;
  isMobileNavOpen = false;
  fullName = '';

  @ViewChild('mobileNavToggle') mobileNavToggle?: ElementRef<HTMLButtonElement>;

  constructor(
    private authState: AuthStateService,
    private authService: AuthService,
    private profileService: UserProfileService,
    private router: Router,
  ) {
    // This header stays mounted across child-route navigation (it lives in the
    // public/applicant shells, not inside their <router-outlet>), so its open
    // menus need to close on navigation instead of staying open over the next page.
    this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => {
      this.isAccountMenuOpen = false;
      this.isMobileNavOpen = false;
    });
  }

  ngOnInit(): void {
    this.authState.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.loadDisplayName();
      } else {
        this.fullName = '';
      }
    });

    // Keeps "Signed in as ..." current after the user edits their name on the
    // profile page, without waiting for their next login.
    this.profileService.profileUpdated$.subscribe(() => {
      if (this.authState.isLoggedIn) {
        this.loadDisplayName();
      }
    });
  }

  private loadDisplayName(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile: any) => {
        this.fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
      },
      error: () => {
        // Non-critical: the header still works without a display name.
      }
    });
  }

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    this.isAccountMenuOpen = false;
  }

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    this.isMobileNavOpen = false;
  }

  closeAccountMenu(event?: Event): void {
    event?.stopPropagation();
    this.isAccountMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.isMobileNavOpen) {
      this.isMobileNavOpen = false;
      this.mobileNavToggle?.nativeElement.focus();
    }
    this.isAccountMenuOpen = false;
  }

  logout(event?: Event): void {
    event?.stopPropagation();
    this.isAccountMenuOpen = false;
    this.isMobileNavOpen = false;
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: (err) => {
        console.error('Error logging out:', err);
        this.finishLogout();
      }
    });
  }

  private finishLogout(): void {
    localStorage.clear();
    this.authState.markLoggedOut();
    this.router.navigate(['/']);
  }

  // Focusing the target explicitly (rather than relying on the browser's default
  // hash-jump behavior) makes sure the next Tab press continues from inside the
  // page content, and keeps it reliable in browsers that don't move focus on a
  // URL fragment.
  skipToMainContent(): void {
    document.getElementById('main')?.focus();
  }
}
