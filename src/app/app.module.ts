import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CountUpModule } from 'ngx-countup';
import { AuthComponent } from './auth/auth.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PermitOverviewApplicationsComponent } from './pages/admin/permit-approvals/permit-overview-applications/permit-overview-applications.component';
import { PermitViewApplicationDetailsComponent } from './pages/admin/permit-approvals/permit-view-application-details/permit-view-application-details.component';
import { ApplicationParentElementComponent } from './pages/admin/permit-approvals/application-parent-element/application-parent-element.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { AuthModule } from '@auth0/auth0-angular';
import { SampleSidebarComponent } from './partials/sample-sidebar/sample-sidebar.component';
import { ReviewMapComponent } from './components/review-map/review-map.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PermitApprovedApplicationComponent } from './pages/admin/permit-approved/permit-approved-application/permit-approved-application.component';
import { PermitApprovedParentComponent } from './pages/admin/permit-approved/permit-approved-parent/permit-approved-parent.component';
import { PermitDeclinedApplicationsComponent } from './pages/admin/permit-declined/permit-declined-applications/permit-declined-applications.component';
import { PermitDeclinedParentComponent } from './pages/admin/permit-declined/permit-declined-parent/permit-declined-parent.component';
import { ScheduleComponent } from './pages/admin/schedule/schedule.component';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PermitReviewComponent } from './modules/admin/pages/permit-review/permit-review.component';
import { PermitApprovedComponent } from './modules/admin/pages/permit-approved/permit-approved.component';
import { PermitDeclinedComponent } from './modules/admin/pages/permit-declined/permit-declined.component';
import { PermitRevisionComponent } from './modules/admin/pages/permit-revision/permit-revision.component';
import { AdminParentComponent } from './modules/admin/components/admin-parent/admin-parent.component';
import { AdminHeaderComponent } from './modules/admin/components/admin-header/admin-header.component';
import { AdminSidebarComponent } from './modules/admin/components/admin-sidebar/admin-sidebar.component';
import { ApplicantDashboardComponent } from './modules/applicant/pages/applicant-dashboard/applicant-dashboard.component';
import { HomeComponent } from './modules/landing/pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    AuthComponent,
    PermitOverviewApplicationsComponent,
    PermitViewApplicationDetailsComponent,
    ApplicationParentElementComponent,
    AccessDeniedPageComponent,
    SampleSidebarComponent,
    ReviewMapComponent,
    PermitApprovedApplicationComponent,
    PermitApprovedParentComponent,
    PermitDeclinedApplicationsComponent,
    PermitDeclinedParentComponent,
    ScheduleComponent,
    SignaturePadComponent,
    NotificationsComponent,
    PermitReviewComponent,
    PermitApprovedComponent,
    PermitDeclinedComponent,
    PermitRevisionComponent,
    AdminParentComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    ApplicantDashboardComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    NoopAnimationsModule,
    SidebarModule,
    ProgressSpinnerModule,
    DialogModule,
    SkeletonModule,
    AutoCompleteModule,
    CountUpModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    BreadcrumbModule,
    AuthModule.forRoot({
      domain: 'dev-i13gsn8mlryu6ru5.us.auth0.com',
      clientId: 'jIYgngTr6txEA5XjnFnHh2K0KvZzmrHt',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
