import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockBackendInterceptor } from './demo/mock-backend.interceptor';

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
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { SampleSidebarComponent } from './partials/sample-sidebar/sample-sidebar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SharedModule } from './shared/shared.module';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { AdminParentComponent } from './modules/admin/components/admin-parent/admin-parent.component';
import { AdminHeaderComponent } from './modules/admin/components/admin-header/admin-header.component';
import { AdminSidebarComponent } from './modules/admin/components/admin-sidebar/admin-sidebar.component';
import { ApplicantDashboardComponent } from './modules/applicant/pages/applicant-dashboard/applicant-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    AuthComponent,
    AccessDeniedPageComponent,
    SampleSidebarComponent,
    SignaturePadComponent,
    NotificationsComponent,
    AdminParentComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    ApplicantDashboardComponent,
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
    SharedModule,
    // Auth0 (@auth0/auth0-angular) is not used in this demo, authentication is fully local.
    // AuthModule.forRoot(...) was removed so the SDK never contacts Auth0's servers.
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
