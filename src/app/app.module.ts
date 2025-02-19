import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { AngularFireModule } from '@angular/fire/compat'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { ApplicationComponent } from './pages/user/application/application.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { FooterComponent } from './partials/footer/footer.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CountUpModule } from 'ngx-countup';
import { AuthComponent } from './auth/auth.component';
import { FormComponent } from './components/form/form.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MapComponent } from './components/map/map.component';
import { PermitOverviewApplicationsComponent } from './pages/admin/permit-approvals/permit-overview-applications/permit-overview-applications.component';
import { PermitViewApplicationDetailsComponent } from './pages/admin/permit-approvals/permit-view-application-details/permit-view-application-details.component';
import { ApplicationParentElementComponent } from './pages/admin/permit-approvals/application-parent-element/application-parent-element.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { AuthModule } from '@auth0/auth0-angular';
import { SampleSidebarComponent } from './partials/sample-sidebar/sample-sidebar.component';
import { ReviewMapComponent } from './components/review-map/review-map.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { NewPermitComponent } from './pages/user/manage-permit/new-permit/new-permit.component';
import { PermitParentElementComponent } from './pages/user/manage-permit/permit-parent-element/permit-parent-element.component';
import { PermitApprovedApplicationComponent } from './pages/admin/permit-approved/permit-approved-application/permit-approved-application.component';
import { PermitApprovedParentComponent } from './pages/admin/permit-approved/permit-approved-parent/permit-approved-parent.component';
import { PermitApprovedViewApplicationComponent } from './pages/admin/permit-approved/permit-approved-view-application/permit-approved-view-application.component';
import { PermitDeclinedApplicationsComponent } from './pages/admin/permit-declined/permit-declined-applications/permit-declined-applications.component';
import { PermitDeclinedParentComponent } from './pages/admin/permit-declined/permit-declined-parent/permit-declined-parent.component';
import { PermitDeclinedViewApplicationsComponent } from './pages/admin/permit-declined/permit-declined-view-applications/permit-declined-view-applications.component';

const firebaseConfig = {
  apiKey: "AIzaSyDteaccknTxLOY2hOXeluL5aH88B7q-ob8",
  authDomain: "bpls-54e21.firebaseapp.com",
  databaseURL: "https://bpls-54e21-default-rtdb.firebaseio.com",
  projectId: "bpls-54e21",
  storageBucket: "bpls-54e21.firebasestorage.app",
  messagingSenderId: "1028038457025",
  appId: "1:1028038457025:web:18c1c53acb0f4125e04640",
  measurementId: "G-JSGTB33V9T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    DashboardComponent,
    SidebarComponent,
    AdminDashboardComponent,
    ApplicationComponent,
    AuthComponent,
    FormComponent,
    MapComponent,
    PermitOverviewApplicationsComponent,
    PermitViewApplicationDetailsComponent,
    ApplicationParentElementComponent,
    AccessDeniedPageComponent,
    SampleSidebarComponent,
    ReviewMapComponent,
    NewPermitComponent,
    PermitParentElementComponent,
    PermitApprovedApplicationComponent,
    PermitApprovedParentComponent,
    PermitApprovedViewApplicationComponent,
    PermitDeclinedApplicationsComponent,
    PermitDeclinedParentComponent,
    PermitDeclinedViewApplicationsComponent,
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
    AngularFireModule.initializeApp(firebaseConfig),
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
