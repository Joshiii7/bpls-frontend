import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApplicantService } from '../../services/applicant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-applicant-application-details',
  templateUrl: './applicant-application-details.component.html',
  styleUrls: ['./applicant-application-details.component.css']
})
export class ApplicantApplicationDetailsComponent implements OnInit {
  isLoading: boolean = true;
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
  signature: string | null = null
 
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
    private api: ApplicantService, 
    private route: ActivatedRoute, 
    public router: Router,
  ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uuid = params.get('uuid')!;
      // console.log('Application UUID:', this.uuid);
    });
    this.getApplicationDetail();
  }

  getApplicationDetail() {
    this.api.getApplicantApplicationDetails(this.uuid)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (response: any) => {
        if (response) {

          // Root-level fields
          this.businessID = response.id;
          this.businessName = response.business_name;
          this.franchiseName = response.franchise_name;
          this.tracking_number = response.tracking_number;
          this.business_id_number = response.business_id_number;
          this.date_of_receipt = response.created_at;

          const transaction = response.transactions?.[0];
          const reg = transaction?.register_business;
          const op = transaction?.business_operation;

          // -------- Register Business --------
          if (reg) {
            this.dtiNumber = reg.dti_number;
            this.dti_registration_date = reg.dti_registration_date;
            this.tinNumber = reg.tin_number;

            this.surname = reg.last_name;
            this.givenname = reg.first_name;
            this.middlename = reg.middle_name;
            this.suffix = reg.suffix;

            this.email = reg.email;
            this.number = reg.number;

            const paymentTypeMap: Record<string, number> = {
              'annual': 1,
              'bi-annual': 2,
              'quarterly': 3
            };

            this.paymentType = paymentTypeMap[reg.payment_type.toLowerCase()] ?? 0;
            this.businessType = reg.business_type_id;
            this.gender = reg.gender === "Male" ? 1 : 2;
            this.isNew = transaction.transaction_type === "new" ? 1 : 2;

            const baseUrl = this.api.baseUrl;
            this.signature = reg.signature
              ? `${baseUrl}/public/${reg.signature}`
              : null;

            // Images
            this.pictures = [];
            if (reg.business_images?.length) {
              reg.business_images.forEach((img: any) => {
                this.pictures.push({
                  type: img.type,
                  file_path: `${baseUrl}/public/${img.file_path}`
                });
              });
            }
          }

          // -------- Business Operation --------
          if (op) {

            const activityMap: Record<string, number> = {
              'main office': 1,
              'branch office': 2,
              'admin office only': 3,
              'warehouse': 4,
              'others': 5
            };

            this.businessArea = op.business_area;
            this.totalMale = op.total_male;
            this.totalFemale = op.total_female;
            this.totalEmployee = op.no_employee;
            this.businessActivity = activityMap[op.business_activity.toLowerCase()] ?? 0;

            this.lat = op.latitude;
            this.lng = op.longitude;
          }

          // -------- Business Addresses --------
          const registered = transaction?.business_addresses?.find((a: any) => a.type === "registered");
          const operational = transaction?.business_addresses?.find((a: any) => a.type === "operation");

          // Registered address
          if (registered) {
            this.city = registered.city;
            this.province = registered.province;
            // No barangay in response → leave empty
            this.barangay = registered.barangay;
            this.zipCode = registered.zip_code;
            this.house_no = registered.house_no;
            this.name_building = registered.building_name;
            this.lot_no = registered.lot_no;
            this.block_no = registered.block_no;
            this.street = registered.street;
            this.subdivision = registered.subdivision;
          }

          // Operational address
          if (operational) {
            this.operationalCity = operational.city;
            this.operationalProvince = operational.province;
            this.operationalBarangay = operational.barangay;  // none in response
            this.operationalZipCode = operational.zip_code;
            this.operational_house_no = operational.house_no;
            this.operational_name_building = operational.building_name;
            this.operational_lot_no = operational.lot_no;
            this.operational_block_no = operational.block_no;
            this.operationalStreet = operational.street;
            this.operational_subdivision = operational.subdivision;
          }
        }

      },
      error: (error: any) => {
        console.log('error fetching application detail:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch application detail.',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#d33',
        });
      }
    });
  }
}
