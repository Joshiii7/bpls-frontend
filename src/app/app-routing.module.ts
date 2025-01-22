import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { ApplyPermitComponent } from './pages/user/apply-permit/apply-permit.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { ApplicationComponent } from './pages/user/application/application.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { PermitOverviewApplicationsComponent } from './pages/admin/permit-approvals/permit-overview-applications/permit-overview-applications.component';
import { PermitViewApplicationDetailsComponent } from './pages/admin/permit-approvals/permit-view-application-details/permit-view-application-details.component';
import { ApplicationParentElementComponent } from './pages/admin/permit-approvals/application-parent-element/application-parent-element.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { 
      allowedRoles: ['business_owner'],
      breadcrumb: 'Dashboard'
    },
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['admin'],
      breadcrumb: 'Admin Dashboard' 
    },
  },
  {
    path: 'my-application',
    component: ApplicationComponent,
    canActivate: [AuthGuard],
    data: { 
      allowedRoles: ['business_owner'],
      breadcrumb: 'My Application' 
    },
  },
  {
    path: 'apply-permit',
    component: ApplyPermitComponent,
    canActivate: [AuthGuard],
    data: { 
      allowedRoles: ['business_owner'],
      breadcrumb: 'Apply for Permit' 
    },
  },
  {
    path: 'applications',
    component: ApplicationParentElementComponent,
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
    path: 'access-denied',
    component: AccessDeniedPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
