import { Component } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.css']
})
export class AccessDeniedPageComponent {
  userRole: any;

  constructor(private apiServices: ApiServicesService) {  }

  ngOnInit() {
    this.apiServices.getUserRole().subscribe({
      next: (response: any) => {
        this.userRole = response.user[0].user_role.role_name;
      },
      error: (error: any) => {
        console.log('error fetching user role', error);
      }
    });
  }
}
