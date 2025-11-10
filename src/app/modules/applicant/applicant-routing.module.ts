import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantsParentComponent } from './components/applicants-parent/applicants-parent.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ApplicantDashboardComponent } from './pages/applicant-dashboard/applicant-dashboard.component';
import { ApplyPermitComponent } from './pages/apply-permit/apply-permit.component';
import { ApplicantProfileComponent } from './pages/applicant-profile/applicant-profile.component';
import { ApplicantApplicationDetailsComponent } from './pages/applicant-application-details/applicant-application-details.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicantsParentComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['business_owner'],
    },
    children: [
      {
        path: '',
        component: ApplicantDashboardComponent
      },
      {
        path: 'apply-permit',
        component: ApplyPermitComponent
      },
      {
        path: 'profile',
        component: ApplicantProfileComponent
      },
      {
        path: ':uuid',
        component: ApplicantApplicationDetailsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicantRoutingModule { }
