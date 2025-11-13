import { Component, EnvironmentInjector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apply-permit',
  templateUrl: './apply-permit.component.html',
  styleUrls: ['./apply-permit.component.css']
})
export class ApplyPermitComponent {
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

  businessInfoData: any = {};

  constructor(
    private api: ApplicantService,
    private fb: FormBuilder,
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
  }

  onBusinessInfoFormChange(event: { formType: string; form: FormGroup }) {
    if (event.formType === 'businessInfo') {
      this.businessInfoForm = event.form;
    } else if (event.formType === 'businessOperation') {
      this.businessOpeForm = event.form
    }
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
}
