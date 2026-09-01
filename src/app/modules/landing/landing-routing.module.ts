import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { PublicParentComponent } from './components/public-parent/public-parent.component';
import { RequirementsComponent } from './pages/requirements/requirements.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { AccessibilityComponent } from './pages/accessibility/accessibility.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { PermitTrackingComponent } from './pages/permit-tracking/permit-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    component: PublicParentComponent,
    children: [
      {
        path: 'requirements',
        component: RequirementsComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'schedules',
        component: SchedulesComponent
      },
      {
        path: 'accessibility',
        component: AccessibilityComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'permit-tracking',
        component: PermitTrackingComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
