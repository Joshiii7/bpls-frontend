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
  
  lat: any;
  lng: any;

  pictures: any[] = [];
  
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
        if (response.permit) {
          this.businessID = response.permit.businessID;
          this.businessName = response.permit.businessName;
          this.franchiseName = response.permit.franchiseName;
          this.dtiNumber = response.permit.dtiNumber;
          this.tinNumber = response.permit.tinNumber;
          this.surname = response.permit.surname;
          this.givenname = response.permit.givenname;
          this.middlename = response.permit.middlename;
          this.suffix = response.permit.suffix;
          this.email = response.permit.email;
          this.number = response.permit.number;
          
          this.businessArea = response.permit.businessArea;
          this.totalFemale = response.permit.totalFemale;
          this.totalMale = response.permit.totalMale;
          
          this.operationalBarangay = response.permit.operationalBarangay;
          this.operationalCity = response.permit.operationalCity;
          this.operationalProvince = response.permit.operationalProvince;
          this.operationalZipCode = response.permit.operationalZipCode;
          this.operationalStreet = response.permit.operationalStreet;
          this.operational_house_no = response.permit.operationalHouseNo;
          this.operational_name_building = response.permit.operationalBuildingName;
          this.operational_lot_no = response.permit.operationalLotNo;
          this.operational_block_no = response.permit.operationalBlockNo;
          this.operational_subdivision = response.permit.operationalSubdivision;

          this.barangay = response.permit.barangay;
          this.city = response.permit.city;
          this.province = response.permit.province;
          this.zipCode = response.permit.zipCode;
          this.street = response.permit.street;
          this.house_no = response.permit.houseNo;
          this.name_building = response.permit.buildingName;
          this.lot_no = response.permit.lotNo;
          this.block_no = response.permit.blockNo;
          this.subdivision = response.permit.subdivision;

          this.totalEmployee = response.permit.totalEmployee;
          this.businessActivity = response.permit.businessActivity;
          this.paymentType = response.permit.paymentType;
          this.businessType = response.permit.businessType;
          this.dti_registration_date = response.permit.dtiRegistrationDate;
          this.isNew = response.permit.isNew;
          
          this.tracking_number = response.permit.trackingNumber;
          this.business_id_number = response.permit.businessIdNumber;
          this.date_of_receipt = response.permit.created_at;

          this.gender = response.permit.gender === 'Male' ? 1 : 2;
          this.isNew = response.permit.isNew === 'New' ? 1 : 2;

          this.lat = response.permit.lat;
          this.lng = response.permit.lng;

          this.pictures = response.permit.pictures;

          console.log(this.date_of_receipt);
      }

      },
      error: (error: any) => {
        console.log('error fetching application detail:', error);
      },
      complete: () => {
        this.isLoading = false;
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
