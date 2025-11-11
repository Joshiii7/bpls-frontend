import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicantRoutingModule } from './applicant-routing.module';
import { ApplicantsHeaderComponent } from './components/applicants-header/applicants-header.component';
import { ApplicantsParentComponent } from './components/applicants-parent/applicants-parent.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApplicantProfileComponent } from './pages/applicant-profile/applicant-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BusinessInformationFormComponent } from './components/business-information-form/business-information-form.component';
import { ApplyPermitComponent } from './pages/apply-permit/apply-permit.component';
import { BusinessOperationFormComponent } from './components/business-operation-form/business-operation-form.component';

@NgModule({
  declarations: [
    ApplicantsHeaderComponent,
    ApplicantsParentComponent,
    ApplicantProfileComponent,
    BusinessInformationFormComponent,
    ApplyPermitComponent,
    BusinessOperationFormComponent
  ],
  imports: [
    CommonModule,
    ApplicantRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BreadcrumbModule,
  ]
})
export class ApplicantModule { }
