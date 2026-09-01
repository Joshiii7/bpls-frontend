import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminParentComponent } from './components/admin-parent/admin-parent.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PermitReviewComponent } from './pages/permit-review/permit-review.component';
import { PermitReviewDetailsComponent } from './pages/permit-review-details/permit-review-details.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

// Every admin-facing route lives under this one module, under one shared
// AdminParentComponent shell (sidebar + topbar). Keeping everything on a single
// '/admin/...' prefix, rather than split across top-level routes like the
// old '/approved-applications', is what lets the sidebar's routerLinkActive
// correctly keep "Applications" highlighted while looking at any status tab
// or an individual application's detail page, without hardcoding per-route logic.
const routes: Routes = [
  // Sits outside the guarded parent below, since a visitor isn't
  // authenticated yet when they reach the login page.
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: '',
    component: AdminParentComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['admin'],
    },
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'applications',
        component: PermitReviewComponent,
        data: { status: 'All', breadcrumb: 'All Applications' },
      },
      {
        path: 'applications/pending',
        component: PermitReviewComponent,
        data: { status: 'Pending', breadcrumb: 'Pending Applications' },
      },
      {
        path: 'applications/approved',
        component: PermitReviewComponent,
        data: { status: 'Approved', breadcrumb: 'Approved Applications' },
      },
      {
        path: 'applications/declined',
        component: PermitReviewComponent,
        data: { status: 'Declined', breadcrumb: 'Declined Applications' },
      },
      // Must come after the static application list routes above, otherwise
      // this would greedily match "pending"/"approved"/"declined" as a :uuid.
      {
        path: 'applications/:uuid',
        component: PermitReviewDetailsComponent,
        data: { breadcrumb: 'Application Details' },
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        data: { breadcrumb: 'Permit Schedule' },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
