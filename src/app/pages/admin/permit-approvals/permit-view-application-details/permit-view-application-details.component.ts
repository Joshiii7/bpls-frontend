import { Component, EventEmitter, Output } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permit-view-application-details',
  templateUrl: './permit-view-application-details.component.html',
  styleUrls: ['./permit-view-application-details.component.css']
})
export class PermitViewApplicationDetailsComponent {
  @Output() emitNavigationState = new EventEmitter<boolean>();
  isLoading: boolean = true;
  application_id = localStorage.getItem('vad');
  uuid!: string

  businessName: any;
  franchiseName: any;
  dtiNumber: any;
  tinNumber: any;
  surname: any;
  givenname: any;
  middlename: any;
  suffix: any;
  email: any;
  number: any;
  barangay: any;
  city: any;
  province: any;
  zipCode: any;
  businessArea: any;
  totalMale: any;
  totalFemale: any;
  totalEmployee: any;
  gender: any;

  paymentType: number = 0;
  businessType: number = 0;
  businessActivity: number = 0;
  
  constructor(private apiService: ApiServicesService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uuid = params.get('uuid')!;
      console.log('Application UUID:', this.uuid);
    });
    this.emitNavigationState.emit(true);
    this.getApplicationDetail();
  }

  getApplicationDetail() {
    this.apiService.applicationDetail(this.uuid).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.isLoading = false; 
        }
        this.businessName = response.permit[0].business_name;
        this.franchiseName = response.permit[0].franchise_name;
        this.dtiNumber = response.permit[0].dti_number;
        this.tinNumber = response.permit[0].tin_number;
        this.surname = response.permit[0].last_name;
        this.givenname = response.permit[0].first_name;
        this.middlename = response.permit[0].middle_name;
        this.suffix = response.permit[0].suffix;
        this.email = response.permit[0].email;
        this.number = response.permit[0].number;
        this.barangay = response.permit[0].business_operation.baranggay_id.brgy_name;
        this.city = response.permit[0].business_operation.city_id.city_name;
        this.province = response.permit[0].business_operation.province_id.province_name;
        this.zipCode = response.permit[0].business_operation.zip_code;
        this.businessArea = response.permit[0].business_operation.business_area;
        this.totalFemale = response.permit[0].business_operation.total_female;
        this.totalMale = response.permit[0].business_operation.total_male;
        
        this.totalEmployee = response.permit[0].business_operation.no_employee;
        this.businessActivity = response.permit[0].business_operation.business_activity_id;
        this.paymentType = response.permit[0].payment_type_id;
        this.businessType = response.permit[0].business_type_id;
        this.gender = response.permit[0].gender;
        // console.log(this.gender);
      },
      error: (error: any) => {
        console.log('error fetching application detail:', error);
      }
    });
  }
}
