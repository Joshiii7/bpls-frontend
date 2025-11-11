import { Component, EnvironmentInjector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';

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
  ) {}

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
    }
  }

  onFormChange(formType: string, form: FormGroup) {
    switch(formType) {
      case 'businessInfo':
        this.businessInfoForm = form;
        break;
      case 'ownerInfo':
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
      case 'ownerInfo':
        currentForm = this.businessOpeForm;
        break;
    }

    if (currentForm) {
      console.log('Hello');
      currentForm.markAllAsTouched();

      if (currentForm.invalid) {
        alert('Please complete all required fields before proceeding.');
        return false;
      }
    }

    return true;
  }

  switchTab(tabKey: string) {
    if (this.activeTab === tabKey) return;
    if (this.canSwitchTab(tabKey)) {
      this.activeTab = tabKey;
    }
  }

}
