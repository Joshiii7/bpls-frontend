import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
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

const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'application',
    component: PermitParentElementComponent,
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
