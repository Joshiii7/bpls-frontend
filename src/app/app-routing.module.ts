import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { PermitOverviewApplicationsComponent } from './pages/admin/permit-approvals/permit-overview-applications/permit-overview-applications.component';
import { PermitViewApplicationDetailsComponent } from './pages/admin/permit-approvals/permit-view-application-details/permit-view-application-details.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { PermitParentElementComponent } from './pages/user/manage-permit/permit-parent-element/permit-parent-element.component';
import { NewPermitComponent } from './pages/user/manage-permit/new-permit/new-permit.component';
import { PermitApprovedApplicationComponent } from './pages/admin/permit-approved/permit-approved-application/permit-approved-application.component';
import { PermitDeclinedApplicationsComponent } from './pages/admin/permit-declined/permit-declined-applications/permit-declined-applications.component';
import { ScheduleComponent } from './pages/admin/schedule/schedule.component';
import { ViewApplicationComponent } from './pages/user/applications/view-application/view-application.component';
import { AdminParentComponent } from './modules/admin/components/admin-parent/admin-parent.component';
import { HomeComponent } from './modules/landing/pages/home/home.component';

const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then(m => m.LandingModule),
  },

  { 
    path: 'auth', 
    loadChildren: () => 
      import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },

  { 
    path: 'applications', 
    loadChildren: () => 
      import('./modules/applicant/applicant.module').then(m => m.ApplicantModule) 
  },

  // Business Owner's Routes
  {
    path: 'application',
    component: PermitParentElementComponent,
    data: {
      allowedRoles: ['business_owner'],
      breadcrumb: 'Dashboard',
    },
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          allowedRoles: ['business_owner'],
          breadcrumb: 'Dashboards',
        }
      },
      {
        path: 'apply-permit',
        component: NewPermitComponent,
        data: { 
          allowedRoles: ['business_owner'],
          breadcrumb: 'Apply for Permit new' 
        },
      },
      {
        path: 'application-details/:uuid',
        component: ViewApplicationComponent,
        data: { breadcrumb: 'Application Details' },
      }
    ],
  },

  // Admin Routings
  {
    path: 'admin-dashboard',
    component: AdminParentComponent,
    data: {
      allowedRoles: ['admin'],
      breadcrumb: 'Admin Dashboard' 
    },
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      }
    ]
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
