import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();
  isSidebarOpen: boolean = true;
  roleID: any;
  isLoading: boolean = true;

  constructor(private router: Router, private apiService: ApiServicesService) {  }

  ngOnInit():void {
    this.emitNavigationState.emit(true);
    this.getRoleFunction();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  getRoleFunction() {
    this.roleID = localStorage.getItem('r');
    this.apiService.getUserRole().subscribe({
      next: (response: any) => {
        // console.log(response.user[0].user_role.role_name);
      },
      error: (error: any) => {
        console.log('error fetching user role:', error);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  applyButton(num: number) {
    if (num === 1) {
      this.router.navigate(['dashboard/apply-permit']);
    } else if (num === 2) {
      this.router.navigate(['dashboard/renew-permit']);
    }
  }

}
