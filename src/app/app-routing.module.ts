import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';

const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then(m => m.LandingModule),
  },

  // Auth Routes
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Business Owner's Routes
  {
    path: 'applications',
    loadChildren: () =>
      import('./modules/applicant/applicant.module').then(m => m.ApplicantModule)
  },

  // Admin Routes, every LGU-staff-facing page (dashboard, applications,
  // schedule) lives under here; see admin-routing.module.ts.
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  // Access Denied Route
  {
    path: 'access-denied',
    component: AccessDeniedPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
