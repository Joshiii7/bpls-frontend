import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitOverviewApplicationsComponent } from './pages/admin/permit-approvals/permit-overview-applications/permit-overview-applications.component';
import { PermitViewApplicationDetailsComponent } from './pages/admin/permit-approvals/permit-view-application-details/permit-view-application-details.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { PermitApprovedApplicationComponent } from './pages/admin/permit-approved/permit-approved-application/permit-approved-application.component';
import { PermitDeclinedApplicationsComponent } from './pages/admin/permit-declined/permit-declined-applications/permit-declined-applications.component';
import { ScheduleComponent } from './pages/admin/schedule/schedule.component';
import { AdminParentComponent } from './modules/admin/components/admin-parent/admin-parent.component';

const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then(m => m.LandingModule),
  },

  // Auth Routes
  { 
    path: 'auth', 
    loadChildren: () => 
      import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },

  // Business Owner's Routes
  { 
    path: 'applications', 
    loadChildren: () => 
      import('./modules/applicant/applicant.module').then(m => m.ApplicantModule) 
  },
  
  // Admin Routes
  { 
    path: 'admin', 
    loadChildren: () => 
      import('./modules/admin/admin.module').then(m => m.AdminModule) 
  },


  {
    path: 'under-review-applications',
    component: AdminParentComponent,
    data: { allowedRoles: ['admin'] },
    children: [
      {
        path: '',
        component: PermitOverviewApplicationsComponent,
        data: { breadcrumb: 'Applications' },
      },
      {
        path: 'application-details/:uuid',
        component: PermitViewApplicationDetailsComponent,
        data: { breadcrumb: 'Application Details' },
      },
    ],
  },
  {
    path: 'approved-applications',
    component: AdminParentComponent,
    data: { allowedRoles: ['admin'] },
    children: [
      {
        path: '',
        component: PermitApprovedApplicationComponent,
      },
      {
        path: 'application-details/:uuid',
        component: PermitViewApplicationDetailsComponent,
      },
    ],
  },
  {
    path: 'declined-applications',
    component: AdminParentComponent,
    data: { allowedRoles: ['admin'] },
    children: [
      {
        path: '',
        component: PermitDeclinedApplicationsComponent,
      },
      {
        path: 'application-details/:uuid',
        component: PermitViewApplicationDetailsComponent,
      },
    ],
  },
  {
    path: 'permit-schedule',
    component: AdminParentComponent,
    data: {
      allowedRoles: ['admin'],
      breadcrumb: 'Permit Schedule' 
    },
    children: [
      {
        path: '',
        component: ScheduleComponent,
      }
    ]
  },

  // Access Denied Route
  {
    path: 'access-denied',
    component: AccessDeniedPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
