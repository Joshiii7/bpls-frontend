import { Component, EnvironmentInjector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-permit',
  templateUrl: './apply-permit.component.html',
  styleUrls: ['./apply-permit.component.css']
})
export class ApplyPermitComponent {
  isLoading: boolean = false;
  activeTab = 'businessInfo';
  tabs = [
    { key: 'businessInfo', label: 'A. Business Information' },
    { key: 'businessOperation', label: 'B. Business Operation' },
    { key: 'documentsLocation', label: 'C. Documents & Location' },
    { key: 'review', label: 'D. Review' },
  ];

  applicationTypeForm!: FormGroup;
  paymentOptionForm!: FormGroup;
  businessInfoForm!: FormGroup;
  businessOpeForm!: FormGroup;

  businessDocuments: any;  
  mapLocation: any;

  applicationData: any = {};

  constructor(
    private api: ApplicantService,
    private fb: FormBuilder,
    private router: Router
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

    this.applicationTypeForm.valueChanges.subscribe(() => this.emitFormData());
    this.paymentOptionForm.valueChanges.subscribe(() => this.emitFormData());
  }

  private emitFormData() {
    const applicationType = this.applicationTypeForm.get('applicationType')?.value;
    const paymentOption = this.paymentOptionForm.get('paymentOption')?.value;

    this.applicationData = {
      ...this.applicationData,
      applicationType,
      paymentOption,
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

  onFormChange(formType: string, form: FormGroup) {
    switch(formType) {
      case 'businessInfo':
        this.businessInfoForm = form;
        break;
      case 'businessOperation':
        this.businessOpeForm = form;
        break;
    }
    console.log(`Updated form: ${formType}`, form.value);
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
          text: 'Please complete all required fields before proceeding.',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#d33',
        });
        return false;
      }
    }

    return true;
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

  submitData() {
    this.isLoading = true;
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
      businessInfo: this.applicationData.businessInfo,
      businessOperation: this.applicationData.businessOperation,
      documents: Object.values(this.applicationData.documents),
    });

    this.api.submitApplicantApplication(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.isLoading = false;
        Swal.fire({
          title: 'Application Submitted!',
          text: 'Your business permit application has been successfully submitted.',
          icon: 'success',
          confirmButtonColor: '#008900',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/applications']);
        });
      },
      error: (err: any) => {
        console.error('error submitting your application: ', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Submission Failed',
          text: 'There was an error submitting your application. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ff0000ff',
          confirmButtonText: 'Close',
        });
      }
    });
  }
}
