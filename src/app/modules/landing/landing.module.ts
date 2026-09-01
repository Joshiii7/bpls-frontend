import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LandingRoutingModule } from './landing-routing.module';
import { ServicesComponent } from './pages/services/services.component';
import { PublicParentComponent } from './components/public-parent/public-parent.component';
import { RequirementsComponent } from './pages/requirements/requirements.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { AccessibilityComponent } from './pages/accessibility/accessibility.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SectionHeadingComponent } from './components/section-heading/section-heading.component';
import { IconBadgeComponent } from './components/icon-badge/icon-badge.component';
import { FaqAccordionComponent } from './components/faq-accordion/faq-accordion.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { PermitTrackingComponent } from './pages/permit-tracking/permit-tracking.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ServicesComponent,
    PublicParentComponent,
    RequirementsComponent,
    HomeComponent,
    ContactComponent,
    SchedulesComponent,
    AccessibilityComponent,
    PrivacyPolicyComponent,
    SectionHeadingComponent,
    IconBadgeComponent,
    FaqAccordionComponent,
    FaqSectionComponent,
    PermitTrackingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LandingModule { }
