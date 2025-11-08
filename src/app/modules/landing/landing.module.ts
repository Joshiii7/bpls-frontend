import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { ServicesComponent } from './pages/services/services.component';
import { PublicParentComponent } from './components/public-parent/public-parent.component';
import { PublicHeaderComponent } from './components/public-header/public-header.component';
import { RequirementsComponent } from './pages/requirements/requirements.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ServicesComponent,
    PublicParentComponent,
    PublicHeaderComponent,
    RequirementsComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule
  ]
})
export class LandingModule { }
