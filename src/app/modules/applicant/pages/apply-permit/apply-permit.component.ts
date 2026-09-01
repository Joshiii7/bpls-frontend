import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoNoticeService } from 'src/app/shared/services/demo-notice.service';

const ORGANIZATION_TYPE_BY_ID: Record<number, string> = {
  1: 'Sole Proprietorship',
  2: 'One Person Corporation',
  3: 'Partnership',
  4: 'Corporation',
  5: 'Cooperative',
};

const PAYMENT_OPTION_BY_LABEL: Record<string, string> = {
  Annual: 'annual',
  'Bi-Annual': 'bi-annual',
  Quarterly: 'quarterly',
};

const PERMIT_SCHEDULE_BY_LABEL: Record<string, string> = {
  'New Business Permit Period': 'new',
  'Business Permit Renewal Period': 'renewal',
  'Amendment / Update': 'amendment',
  'Others': 'others',
};

const DOCUMENT_TITLE_TO_KEY: Record<string, string> = {
  'Proof of Registration (DTI/SEC/CDA)': 'file1',
  'Authority to Use of Place of Business': 'file2',
  'Fire Safety Inspection Certificate': 'file3',
  'Sanitary Permit / Health Clearance': 'file4',
  'Environmental Clearance / Barangay Clearance': 'file6',
  'Occupancy Permit': 'file7',
};

@Component({
  selector: 'app-apply-permit',
  templateUrl: './apply-permit.component.html',
  styleUrls: ['./apply-permit.component.css']
})
export class ApplyPermitComponent {
  isLoading: boolean = false;
  isLoadingDraft: boolean = false;
  activeTab = 'businessInfo';
  tabs = [
    { key: 'businessInfo', label: 'Business & Applicant Details', description: 'Your business and your information as the applicant' },
    { key: 'businessOperation', label: 'Business Operation', description: 'How and where the business operates' },
    { key: 'documentsLocation', label: 'Requirements', description: 'Upload supporting documents and pin your location' },
    { key: 'review', label: 'Review & Submit', description: 'Check everything before you submit' },
  ];

  applicationTypeForm!: FormGroup;
  paymentOptionForm!: FormGroup;
  permitScheduleForm!: FormGroup;
  businessInfoForm!: FormGroup;
  businessOpeForm!: FormGroup;

  businessDocuments: any;
  mapLocation: any;

  applicationData: any = {};

  // Draft-resume state
  draftUuid: string | null = null;
  businessInfoInitialValue: any = null;
  businessOperationInitialValue: any = null;
  documentsInitialValue: any = null;

  constructor(
    private api: ApplicantService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private demoNotice: DemoNoticeService,
  ) {
    document.title = 'BPLS | Apply Permit';
  }

  ngOnInit(): void {
    this.applicationTypeForm = this.fb.group({
      applicationType: ['', Validators.required],
    });

    this.paymentOptionForm = this.fb.group({
      paymentOption: ['', Validators.required],
    });

    this.permitScheduleForm = this.fb.group({
      scheduleType: ['', Validators.required],
      scheduleOther: [''],
    });

    this.applicationTypeForm.valueChanges.subscribe(() => this.emitFormData());
    this.paymentOptionForm.valueChanges.subscribe(() => this.emitFormData());

    // "Please specify" only matters, and is only required, once "Others" is
    // selected. Switching away clears it so a stale note cannot linger on a
    // schedule type that no longer needs it.
    this.permitScheduleForm.get('scheduleType')!.valueChanges.subscribe(value => this.syncScheduleOtherValidator(value));
    this.permitScheduleForm.valueChanges.subscribe(() => this.emitFormData());

    const draftUuid = this.route.snapshot.queryParamMap.get('draft');
    if (draftUuid) {
      this.loadDraft(draftUuid);
    }
  }

  get showScheduleOtherField(): boolean {
    return this.permitScheduleForm?.get('scheduleType')?.value === 'others';
  }

  private syncScheduleOtherValidator(scheduleType: string): void {
    const scheduleOtherControl = this.permitScheduleForm.get('scheduleOther')!;
    if (scheduleType === 'others') {
      scheduleOtherControl.setValidators([Validators.required]);
    } else {
      scheduleOtherControl.setValidators(null);
      scheduleOtherControl.setValue('', { emitEvent: false });
    }
    scheduleOtherControl.updateValueAndValidity({ emitEvent: false });
  }

  private loadDraft(uuid: string) {
    this.isLoadingDraft = true;
    this.api.getApplicantApplicationDetails(uuid).subscribe({
      next: (response: any) => {
        this.isLoadingDraft = false;
        if (!response) {
          Swal.fire({ icon: 'error', title: 'Draft Not Found', text: 'We could not find that draft. Starting a new application instead.', confirmButtonColor: '#009800' });
          return;
        }

        this.draftUuid = uuid;
        const tx = response.transactions?.[0];
        const reg = tx?.register_business;
        const op = tx?.business_operation;
        const registered = tx?.business_addresses?.find((a: any) => a.type === 'registered');
        const operation = tx?.business_addresses?.find((a: any) => a.type === 'operation');

        this.applicationTypeForm.patchValue({ applicationType: tx?.transaction_type || 'new' }, { emitEvent: false });
        this.paymentOptionForm.patchValue({ paymentOption: PAYMENT_OPTION_BY_LABEL[reg?.payment_type] || 'annual' }, { emitEvent: false });
        const scheduleType = PERMIT_SCHEDULE_BY_LABEL[response.permit_schedule] || 'new';
        this.permitScheduleForm.patchValue({
          scheduleType,
          scheduleOther: response.permit_schedule_other || '',
        }, { emitEvent: false });
        this.syncScheduleOtherValidator(scheduleType);
        this.emitFormData();

        this.businessInfoInitialValue = {
          businessName: response.business_name,
          tradeName: response.franchise_name,
          registrationNumber: reg?.dti_number,
          registrationDate: reg?.dti_registration_date,
          tin: reg?.tin_number,
          organizationType: ORGANIZATION_TYPE_BY_ID[reg?.business_type_id] || '',
          gender: reg?.gender,
          givenName: reg?.first_name,
          middleName: reg?.middle_name,
          surname: reg?.last_name,
          suffix: reg?.suffix,
          contactNumber: reg?.number,
          email: reg?.email,
          province: registered?.province,
          city: registered?.city,
          barangay: registered?.barangay,
          zipCode: registered?.zip_code,
          streetAddress: registered?.street,
          houseNumber: registered?.house_no,
          buildingName: registered?.building_name,
          lotNumber: registered?.lot_no,
          blockNumber: registered?.block_no,
          subdivision: registered?.subdivision,
        };

        this.businessOperationInitialValue = {
          businessActivity: op?.business_activity,
          businessArea: op?.business_area,
          totalFloorArea: op?.total_floor_area,
          totalEmployees: { male: op?.total_male, female: op?.total_female },
          deliveryVehicles: { vanOrTruck: op?.no_van, motorcycle: op?.no_motor },
          barangay: operation?.barangay,
          zipCode: operation?.zip_code,
          streetAddress: operation?.street,
          houseNumber: operation?.house_no,
          buildingName: operation?.building_name,
          lotNumber: operation?.lot_no,
          blockNumber: operation?.block_no,
          subdivision: operation?.subdivision,
        };

        const documents: Record<string, { title: string; previewUrl: string }> = {};
        (reg?.business_images || []).forEach((img: any) => {
          const key = DOCUMENT_TITLE_TO_KEY[img.type];
          if (key) documents[key] = { title: img.type, previewUrl: img.file_path };
        });
        this.documentsInitialValue = {
          documents,
          location: op?.latitude && op?.longitude ? { lat: op.latitude, lng: op.longitude } : null,
        };
      },
      error: (err: any) => {
        this.isLoadingDraft = false;
        console.error('error loading draft: ', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Could not load your saved draft. Starting a new application instead.', confirmButtonColor: '#009800' });
      }
    });
  }

  private emitFormData() {
    const applicationType = this.applicationTypeForm.get('applicationType')?.value;
    const paymentOption = this.paymentOptionForm.get('paymentOption')?.value;

    this.applicationData = {
      ...this.applicationData,
      applicationType,
      paymentOption,
      permitSchedule: this.permitScheduleForm.value,
    };
  }

  handleBusinessOperationData(data: any) {
    const { documents, location } = data;

    this.businessDocuments = documents;
    this.mapLocation = location;

    this.applicationData.documents = documents;
    this.applicationData.location = location;

    this.updateApplicationData();
  }

  onBusinessInfoFormChange(event: { formType: string; form: FormGroup }) {
    if (event.formType === 'businessInfo') {
      this.businessInfoForm = event.form;
      this.applicationData.businessInfo = event.form.value;
    } else if (event.formType === 'businessOperation') {
      this.businessOpeForm = event.form
      this.applicationData.businessOperation = event.form.value;
    }

    this.updateApplicationData();
  }

  updateApplicationData() {
    this.applicationData = {
      ...this.applicationData,
      businessInfo: this.businessInfoForm?.value || null,
      businessOperation: this.businessOpeForm?.value || null,
      documents: this.businessDocuments || null,
      location: this.mapLocation || null,
    };
  }

  get requiredDocumentTitlesMissing(): string[] {
    if (!this.businessDocuments) return Object.keys(DOCUMENT_TITLE_TO_KEY);
    return Object.values(this.businessDocuments)
      .filter((doc: any) => !doc?.previewUrl)
      .map((doc: any) => doc.title);
  }

  canSwitchTab(nextTab: string): boolean {
    let currentForm: FormGroup | undefined;

    switch(this.activeTab) {
      case 'businessInfo':
        currentForm = this.businessInfoForm;
        break;
      case 'businessOperation':
        currentForm = this.businessOpeForm;
        break;
    }

    if (currentForm) {
      currentForm.markAllAsTouched();

      if (currentForm.invalid) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Form',
          text: 'Please complete all required fields before continuing.',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#d33',
        });
        return false;
      }
    }

    if (this.activeTab === 'documentsLocation' && nextTab === 'review') {
      const missing = this.requiredDocumentTitlesMissing;
      if (missing.length) {
        Swal.fire({
          icon: 'warning',
          title: 'Documents Needed',
          text: `Please upload the following before continuing: ${missing.join(', ')}.`,
          confirmButtonText: 'Understood',
          confirmButtonColor: '#d33',
        });
        return false;
      }
    }

    return true;
  }

  get activeTabIndex(): number {
    return this.tabs.findIndex(t => t.key === this.activeTab);
  }

  switchTab(tabKey: string) {
    if (this.activeTab === tabKey) return;

    const currentIndex = this.tabs.findIndex(t => t.key === this.activeTab);
    const nextIndex = this.tabs.findIndex(t => t.key === tabKey);

    if (nextIndex > currentIndex && !this.canSwitchTab(tabKey)) {
      return;
    }

    this.activeTab = tabKey;
  }

  goToStep(tabKey: string) {
    // Stepper header: only block forward jumps, editing an earlier completed step is always allowed.
    const currentIndex = this.tabs.findIndex(t => t.key === this.activeTab);
    const targetIndex = this.tabs.findIndex(t => t.key === tabKey);
    if (targetIndex <= currentIndex) {
      this.activeTab = tabKey;
      return;
    }
    this.switchTab(tabKey);
  }

  private buildFormData(isDraft: boolean): FormData {
    const formData = new FormData();

    function appendFormData(fd: FormData, data: any, parentKey = '') {
      Object.entries(data).forEach(([key, value]) => {
        const formKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value === null || value === undefined) return;

        if (value instanceof File) {
          fd.append(formKey, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              fd.append(`${formKey}[${index}]`, item);
            } else if (typeof item === 'object') {
              appendFormData(fd, item, `${formKey}[${index}]`);
            } else {
              fd.append(`${formKey}[${index}]`, item.toString());
            }
          });
        } else if (typeof value === 'object') {
          appendFormData(fd, value, formKey);
        } else {
          fd.append(formKey, value.toString());
        }
      });
    }

    appendFormData(formData, {
      applicationType: this.applicationData.applicationType,
      paymentOption: this.applicationData.paymentOption,
      permitSchedule: this.applicationData.permitSchedule,
      businessInfo: this.applicationData.businessInfo,
      businessOperation: this.applicationData.businessOperation,
      documents: Object.values(this.applicationData.documents || {}),
      location: this.applicationData.location,
      isDraft: isDraft ? 'true' : 'false',
    });

    return formData;
  }

  private requireApplicationBasics(): boolean {
    if (!this.applicationData.applicationType || !this.applicationData.paymentOption || !this.applicationData.permitSchedule?.scheduleType) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a type of application, a payment option, and a permit schedule before saving.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    if (!this.applicationData.businessInfo?.businessName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter at least your business name before saving a draft.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  saveDraft() {
    if (!this.requireApplicationBasics()) return;

    this.isLoading = true;
    const formData = this.buildFormData(true);
    const request = this.draftUuid
      ? this.api.updateApplicantApplication(this.draftUuid, formData)
      : this.api.submitApplicantApplication(formData);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Draft Saved',
          text: 'Your progress has been saved. You can continue this application anytime from your dashboard.',
          icon: 'success',
          confirmButtonColor: '#008900',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/applications']);
        });
      },
      error: (err: any) => {
        console.error('error saving draft: ', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Could Not Save Draft',
          text: 'Something went wrong while saving your draft. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
        });
      }
    });
  }

  submitData() {
    this.permitScheduleForm.markAllAsTouched();
    if (this.permitScheduleForm.invalid) {
      const needsOther = this.permitScheduleForm.get('scheduleType')?.value === 'others';
      Swal.fire({
        icon: 'warning',
        title: 'Permit Schedule Needed',
        text: needsOther
          ? 'Please specify the purpose of this schedule before submitting.'
          : 'Please select a permit schedule before submitting.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#d33',
      });
      this.activeTab = 'businessInfo';
      return;
    }

    this.isLoading = true;
    const formData = this.buildFormData(false);
    const request = this.draftUuid
      ? this.api.updateApplicantApplication(this.draftUuid, formData)
      : this.api.submitApplicantApplication(formData);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.demoNotice.show({
          title: 'Application Submitted',
          summary: `Your application for <strong>${response.business_name}</strong> has been received with reference number <strong>${response.tracking_number}</strong> and is now <strong>${response.status}</strong>. Save this reference number so you can look it up anytime.`,
          confirmButtonText: 'View Application',
        }).then(() => {
          this.router.navigate(['/applications', response.uuid]);
        });
      },
      error: (err: any) => {
        console.error('error submitting your application: ', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Submission Failed',
          text: 'There was a problem submitting your application. Please check your information and try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Close',
        });
      }
    });
  }
}
