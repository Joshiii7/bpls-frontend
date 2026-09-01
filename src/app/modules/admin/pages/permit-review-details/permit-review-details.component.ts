import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PdfGeneratorService } from 'src/app/shared/services/pdf-generator.service';
import { ApplicationPdfData } from 'src/app/shared/services/pdf-document.models';
import { PdfPreviewModalComponent } from 'src/app/shared/components/pdf-preview-modal/pdf-preview-modal.component';

@Component({
  selector: 'app-permit-review-details',
  templateUrl: './permit-review-details.component.html',
  styleUrls: ['./permit-review-details.component.css']
})
export class PermitReviewDetailsComponent {
  @ViewChild('pdfModal') pdfModal!: PdfPreviewModalComponent;

  private readonly businessTypeLabels: Record<number, string> = {
    1: 'Sole Proprietorship',
    2: 'One Person Corporation',
    3: 'Partnership',
    4: 'Corporation',
    5: 'Cooperative',
  };
  private readonly genderLabels: Record<number, string> = { 1: 'Male', 2: 'Female' };
  private readonly paymentTypeLabels: Record<number, string> = { 1: 'Annual', 2: 'Bi-Annual', 3: 'Quarterly' };
  private readonly applicationTypeLabels: Record<number, string> = { 1: 'New', 2: 'Renewal', 3: 'Additional' };
  private readonly businessActivityLabels: Record<number, string> = {
    1: 'Main Office',
    2: 'Branch Office',
    3: 'Admin Office Only',
    4: 'Warehouse',
    5: 'Others',
  };

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
  businessFloorArea: any;
  totalMale: any;
  totalFemale: any;
  totalEmployee: any;
  no_van: any;
  no_motor: any;
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

  permitSchedule: string | null = null;
  permitScheduleOther: string | null = null;

  departments: any[] = []
  
  constructor(
    private api: AdminService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private pdfService: PdfGeneratorService,
  ) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uuid = params.get('uuid')!;
    });
    this.initApplicationDetails();
    this.initDepartmentApproval();
  }

  goBack(): void {
    this.location.back();
  }

  get overallStatus(): string {
    return this.computeStatusLabel();
  }

  get overallStatusBadgeClass(): string {
    switch (this.overallStatus) {
      case 'Approved': return 'bg-green-50 text-green-800 border-green-200';
      case 'Declined': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  }

  get overallStatusIcon(): string {
    switch (this.overallStatus) {
      case 'Approved': return 'ti-circle-check';
      case 'Declined': return 'ti-circle-x';
      default: return 'ti-hourglass';
    }
  }

  initApplicationDetails() {
    this.api.showAdminPermits(this.uuid)
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
          this.permitSchedule = response.permit_schedule || null;
          this.permitScheduleOther = response.permit_schedule_other || null;

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
            // Demo documents/signatures are stored as data URIs, so they're used as-is;
            // only a legacy relative path would still need the backend host prefixed.
            const resolveAssetUrl = (path: string) =>
              path.startsWith('data:') || path.startsWith('http') ? path : `${baseUrl}/public/${path}`;

            this.signature = reg.signature ? resolveAssetUrl(reg.signature) : null;

            // Images
            this.pictures = [];
            if (reg.business_images?.length) {
              reg.business_images.forEach((img: any) => {
                this.pictures.push({
                  type: img.type,
                  file_path: resolveAssetUrl(img.file_path)
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
            this.businessFloorArea = op.total_floor_area;
            this.totalMale = op.total_male;
            this.totalFemale = op.total_female;
            this.totalEmployee = op.no_employee;
            this.no_van = op.no_van;
            this.no_motor = op.no_motor;
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

  initDepartmentApproval() {
    this.api.showDepartmentApproval(this.uuid).subscribe({
      next: (response: any) => {
        this.departments = response;
      },
      error: (err: any) => {
        console.error("error fetching department approval: ", err);
      }
    });
  }

  setStatus(dept: any, status: string) {
    if (status === 'Declined') {
      Swal.fire({
        title: 'Decline Application',
        input: 'textarea',
        inputLabel: 'Reason / Comments',
        inputPlaceholder: 'Enter your comments here...',
        inputAttributes: {
          'aria-label': 'Enter your comments here'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'swal-confirm-button'
        },
        didOpen: () => {
          const textarea = Swal.getInput() as unknown as HTMLTextAreaElement;
          if (textarea) {
            textarea.style.border = '2px solid #008900';
            textarea.style.borderRadius = '4px';
            textarea.style.padding = '6px';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const notes = result.value;
          this.sendPatch(dept, status, notes);
        }
      });
    } else {
      // Approve directly
      this.sendPatch(dept, status);
    }
  }


  private sendPatch(dept: any, status: string, notes: string | null = null) {
    dept.status = status;
    const payload = {
      department: dept.department,
      status: status,
      notes: notes
    };

    this.api.patchDepartmentApproval(this.uuid, payload).subscribe({
      next: (response: any) => {
        console.log('Department updated:', response);

        Swal.fire({
          icon: 'success',
          title: `${dept.department} has been ${status}`,
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err: any) => {
        console.error('Error updating department approval: ', err);
        dept.status = dept.status === 'Approved' ? 'Pending' : dept.status;
        Swal.fire('Error', 'Failed to update department status.', 'error');
      }
    });
  }

  // ---------- PDF preview/generation ----------
  // Always rebuilds from the component's current fields (populated from the mock
  // backend, which itself reads/writes localStorage), so a regenerated PDF reflects
  // any department approve/decline actions taken during this visit.

  async previewPdf(): Promise<void> {
    const fileName = this.pdfFileName();
    this.pdfModal.showLoading(fileName);

    try {
      const data = this.buildPdfData();
      const blob = await this.pdfService.generateApplicationPdf(data);
      this.pdfModal.showPdf(blob, fileName);
    } catch (err) {
      console.error('Error generating application PDF:', err);
      this.pdfModal.showError('Something went wrong while generating the PDF. Please try again.');
    }
  }

  private pdfFileName(): string {
    const base = (this.tracking_number || this.uuid || 'application').toString();
    return `${base.replace(/[^a-z0-9-_]+/gi, '_')}.pdf`;
  }

  private fullName(): string {
    return [this.givenname, this.middlename, this.surname, this.suffix].filter(Boolean).join(' ').trim();
  }

  private computeStatusLabel(): string {
    if (!this.departments?.length) return 'Pending Review';
    if (this.departments.some(d => d.status === 'Declined')) return 'Declined';
    if (this.departments.every(d => d.status === 'Approved')) return 'Approved';
    return 'Pending Review';
  }

  private formatAddress(parts: {
    house_no?: any; name_building?: any; lot_no?: any; block_no?: any;
    street?: any; barangay?: any; subdivision?: any; city?: any; province?: any; zipCode?: any;
  }): string {
    const line1 = [parts.house_no && `#${parts.house_no}`, parts.name_building, parts.street]
      .filter(Boolean).join(', ');
    const line2 = [parts.barangay && `Brgy. ${parts.barangay}`, parts.subdivision, parts.city, parts.province]
      .filter(Boolean).join(', ');
    const line3 = parts.zipCode ? `Zip Code ${parts.zipCode}` : '';
    return [line1, line2, line3].filter(Boolean).join('\n') || '-';
  }

  private buildPdfData(): ApplicationPdfData {
    return {
      documentTitle: 'Unified Application Form for Business Permit',
      subtitle: this.businessName || 'Business Permit Application',
      logoUrl: 'assets/images/logo/bislig lgu logo.png',
      trackingNumber: this.tracking_number,
      businessIdNumber: this.business_id_number,
      statusLabel: this.computeStatusLabel(),
      generatedAt: new Date(),
      sections: [
        {
          heading: 'A. Business Information & Registration',
          rows: [
            { label: 'Business Type', value: this.businessTypeLabels[this.businessType] || '-' },
            { label: 'Business Name', value: this.businessName || '-' },
            { label: 'Trade Name / Franchise', value: this.franchiseName || '-' },
            { label: 'Application Type', value: this.applicationTypeLabels[this.isNew] || '-' },
            { label: 'DTI/SEC/CDA Registration No.', value: this.dtiNumber || '-' },
            { label: 'DTI/SEC/CDA Registration Date', value: this.dti_registration_date || '-' },
            { label: 'Tax Identification Number (TIN)', value: this.tinNumber || '-' },
            { label: 'Owner / Representative', value: this.fullName() || '-' },
            { label: 'Gender', value: this.genderLabels[this.gender] || '-' },
            { label: 'Email Address', value: this.email || '-' },
            { label: 'Mobile Number', value: this.number || '-' },
            {
              label: 'Registered Business Address',
              value: this.formatAddress({
                house_no: this.house_no, name_building: this.name_building, lot_no: this.lot_no,
                block_no: this.block_no, street: this.street, barangay: this.barangay,
                subdivision: this.subdivision, city: this.city, province: this.province, zipCode: this.zipCode,
              }),
            },
          ],
        },
        {
          heading: 'B. Business Operation',
          rows: [
            { label: 'Payment Type', value: this.paymentTypeLabels[this.paymentType] || '-' },
            { label: 'Business Activity', value: this.businessActivityLabels[this.businessActivity] || '-' },
            { label: 'Business Area (sq.m.)', value: String(this.businessArea ?? '-') },
            { label: 'Total Floor Area (sq.m.)', value: String(this.businessFloorArea ?? '-') },
            { label: 'Employees (Male / Female / Total)', value: `${this.totalMale ?? 0} / ${this.totalFemale ?? 0} / ${this.totalEmployee ?? 0}` },
            { label: 'Delivery Vehicles (Van-Truck / Motorcycle)', value: `${this.no_van ?? 0} / ${this.no_motor ?? 0}` },
            {
              label: 'Business Operation Address',
              value: this.formatAddress({
                house_no: this.operational_house_no, name_building: this.operational_name_building,
                lot_no: this.operational_lot_no, block_no: this.operational_block_no,
                street: this.operationalStreet, barangay: this.operationalBarangay,
                subdivision: this.operational_subdivision, city: this.operationalCity,
                province: this.operationalProvince, zipCode: this.operationalZipCode,
              }),
            },
          ],
        },
        {
          heading: 'Application Tracking',
          rows: [
            { label: 'Date of Receipt', value: this.date_of_receipt || '-' },
            { label: 'Tracking Number', value: this.tracking_number || '-' },
            { label: 'Business ID Number', value: this.business_id_number || '-' },
          ],
        },
      ],
      documents: (this.pictures || []).map(p => ({ label: p.type, url: p.file_path })),
      approvals: (this.departments || []).map(d => ({ department: d.department, status: d.status, notes: d.notes })),
      signatures: [
        { name: this.fullName(), role: 'Signature of Applicant / Owner over Printed Name', imageUrl: this.signature },
      ],
      declaration:
        'I DECLARE UNDER PENALTY OF PERJURY that all information in this application are true and correct based on my ' +
        'personal knowledge and authentic records submitted to the Business Permit & Licensing Office. Any false or ' +
        'misleading information supplied, or production of fake/falsified documents shall be grounds for appropriate ' +
        'legal action against me and automatically revokes the permit. I hereby agree that all personal data (as defined ' +
        'under the Data Privacy Law of 2012 and its Implementing Rules and Regulations) and account transaction ' +
        'information or records with the City/Municipality Government may be processed, profiled or shared to ' +
        'requesting parties or for the purpose of any court, legal process, examination, inquiry and audit or ' +
        'investigation on any authority.',
    };
  }
}
