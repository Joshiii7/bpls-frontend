import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { PermitReviewComponent } from './pages/permit-review/permit-review.component';
import { PermitApprovedComponent } from './pages/permit-approved/permit-approved.component';
import { PermitDeclinedComponent } from './pages/permit-declined/permit-declined.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { PermitReviewDetailsComponent } from './pages/permit-review-details/permit-review-details.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    PermitReviewComponent,
    PermitApprovedComponent,
    PermitDeclinedComponent,
    ScheduleComponent,
    PermitReviewDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class AdminModule { }
