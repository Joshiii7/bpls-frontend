import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminParentComponent } from './components/admin-parent/admin-parent.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PermitReviewComponent } from './pages/permit-review/permit-review.component';
import { PermitReviewDetailsComponent } from './pages/permit-review-details/permit-review-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdminParentComponent,
    data: {
      allowedRoles: ['admin'],
    },
    children: [
      {
        path: 'admin-report-dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'review-permit',
        component: PermitReviewComponent,
      },
      {
        path: 'review-permit/:uuid',
        component: PermitReviewDetailsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
