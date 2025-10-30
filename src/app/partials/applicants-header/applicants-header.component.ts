import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-applicants-header',
  templateUrl: './applicants-header.component.html',
  styleUrls: ['./applicants-header.component.css']
})
export class ApplicantsHeaderComponent {
  isMenuOpen: boolean = false;
  username: string = 'User';

  constructor(
    private apiService: ApiServicesService,
    private router: Router,
  ) {
    this.initUser();
  }

  initUser() {
    this.apiService.getUserRole().subscribe({
      next: (response: any) => {
        this.username = response.user[0]?.first_name;
      },
      error: (err) => {
        console.error("Error fetching user:", err);
      }
    });
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
