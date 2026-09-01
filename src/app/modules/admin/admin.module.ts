import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermitReviewComponent } from './pages/permit-review/permit-review.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { PermitReviewDetailsComponent } from './pages/permit-review-details/permit-review-details.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    PermitReviewComponent,
    ScheduleComponent,
    PermitReviewDetailsComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class AdminModule { }
