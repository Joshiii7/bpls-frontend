import { Component, EventEmitter, Output } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();


  applications: any;
  isLoading: boolean = true;

  constructor(private apiService: ApiServicesService) { }

  ngOnInit():void {
    this.emitNavigationState.emit(true);
    this.getAppFunction();
  }

  getAppFunction() {
    this.apiService.getApplications().subscribe({
      next: (response: any) => {
        console.log(response);
        this.applications = response.permit;
      },
      error: (error: any) => {
        console.log('error fetching applications:', error);
      }
    });
  }
}
