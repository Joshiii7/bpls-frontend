import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router, private apiService: ApiServicesService) {  }

  newApplication() {
    this.router.navigate(['/application/apply-permit']);
  }
}
