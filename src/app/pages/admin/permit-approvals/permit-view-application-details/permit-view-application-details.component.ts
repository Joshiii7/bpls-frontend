import { Component, EventEmitter, Output } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-permit-view-application-details',
  templateUrl: './permit-view-application-details.component.html',
  styleUrls: ['./permit-view-application-details.component.css'],
  providers: [MessageService]
})
export class PermitViewApplicationDetailsComponent {
  isLoading: boolean = true;
  application_id = localStorage.getItem('vad');
  uuid!: string

  businessName: any;
  franchiseName: any;
  dtiNumber: any;
  dti_registration_date: any;
  tinNumber: any;
  surname: any;
  givenname: any;
  middlename: any;
  suffix: any;
  email: any;
  number: any;
  businessArea: any;
  totalMale: any;
  totalFemale: any;
  totalEmployee: any;
  gender: any;
 
  barangay: any;
  city: any;
  province: any;
  zipCode: any;
  street: any;
  house_no: any;
  name_building: any;
  lot_no: any;
  block_no: any;
  subdivision: any;

  operationalBarangay: any;
  operationalCity: any;
  operationalProvince: any;
  operationalZipCode: any;
  operationalStreet: any;
  operational_house_no: any;
  operational_name_building: any;
  operational_lot_no: any;
  operational_block_no: any;
  operational_subdivision: any;

  tracking_number: any;
  business_id_number: any;
  date_of_receipt: any;

  paymentType: number = 0;
  businessType: number = 0;
  businessActivity: number = 0;
  isNew: number = 0;

  visible: boolean = false;
  businessID: any;
  
  constructor(
    private apiService: ApiServicesService, 
    private route: ActivatedRoute, 
    public router: Router,
    private messageService: MessageService, 
  ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uuid = params.get('uuid')!;
      // console.log('Application UUID:', this.uuid);
    });
    this.getApplicationDetail();
  }

  getApplicationDetail() {
    this.apiService.applicationDetail(this.uuid).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.isLoading = false; 
        }
        this.businessID = response.permit[0].id;
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
        this.businessArea = response.permit[0].business_operation.business_area;
        this.totalFemale = response.permit[0].business_operation.total_female;
        this.totalMale = response.permit[0].business_operation.total_male;
        
        this.operationalBarangay = response.permit[0].business_operation.baranggay_id.brgy_name;
        this.operationalCity = response.permit[0].business_operation.city_id.city_name;
        this.operationalProvince = response.permit[0].business_operation.province_id.province_name;
        this.operationalZipCode = response.permit[0].business_operation.zip_code;
        this.operationalStreet = response.permit[0].business_operation.street;
        this.operational_house_no = response.permit[0].business_operation.house_no;
        this.operational_name_building = response.permit[0].business_operation.building_name;
        this.operational_lot_no = response.permit[0].business_operation.lot_no;
        this.operational_block_no = response.permit[0].business_operation.block_no;
        this.operational_subdivision = response.permit[0].business_operation.subdivision;
        
        this.barangay = response.permit[0].baranggay_id.brgy_name;
        this.city = response.permit[0].city_id.city_name;
        this.province = response.permit[0].province_id.province_name;
        this.zipCode = response.permit[0].zip_code;
        this.street = response.permit[0].street;
        this.house_no = response.permit[0].house_no;
        this.name_building = response.permit[0].name_building;
        this.lot_no = response.permit[0].lot_no;
        this.block_no = response.permit[0].block_no;
        this.subdivision = response.permit[0].subdivision;
        
        this.totalEmployee = response.permit[0].business_operation.no_employee;
        this.businessActivity = response.permit[0].business_operation.business_activity_id;
        this.paymentType = response.permit[0].payment_type_id;
        this.businessType = response.permit[0].business_type_id;
        this.dti_registration_date = response.permit[0].dti_registration_date;
        this.isNew = response.permit[0].isNew;
        
        this.tracking_number = response.permit[0].tracking_number;
        this.business_id_number = response.permit[0].business_id_number;
        this.date_of_receipt = response.permit[0].created_at;
        
        this.gender = (response.permit[0].gender == 'Male') ? 1 : 2;
        this.isNew = (response.permit[0].isNew == 'New') ? 1 : 2;
      },
      error: (error: any) => {
        console.log('error fetching application detail:', error);
      }
    });
  }

  approve() {
    // this.visible = true;
    this.apiService.updateStatus(this.businessID, { status: 'Approved' }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Approved Permit' });
          
          setTimeout(() => {
            this.router.navigate(['/applications']).then(() => {
              window.location.reload();
            });
          }, 300);
        }
      },
      error: (error: any) => {
        console.log('error approving the status:', error);
      }
    });
  }

  decline() {
    // this.visible = true;
    this.apiService.updateStatus(this.businessID, { status: 'Declined' }).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Approved Permit' });
          
          setTimeout(() => {
            this.router.navigate(['/applications']).then(() => {
              window.location.reload();
            });
          }, 300);
        }
      },
      error: (error: any) => {
        console.log('error approving the status:', error);
      }
    });
  }
}
