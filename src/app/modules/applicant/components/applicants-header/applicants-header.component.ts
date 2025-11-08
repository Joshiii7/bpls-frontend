import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-applicants-header',
  templateUrl: './applicants-header.component.html',
  styleUrls: ['./applicants-header.component.css']
})
export class ApplicantsHeaderComponent {
isMenuOpen: boolean = false;
  username: string = 'User';

  constructor(
    private apiService: AuthService,
    private router: Router,
  ) {
  }

  logout(event?: Event) {
    event?.stopPropagation();
    this.isMenuOpen = false;
    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error logging out:", err);
      }
    });
  }
  
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(event?: Event) {
    event?.stopPropagation();
    this.isMenuOpen = false;
  }
}
