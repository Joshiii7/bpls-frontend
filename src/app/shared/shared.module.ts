import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MapComponent } from './components/map/map.component';
import { UnifiedApplicationFormComponent } from './components/unified-application-form/unified-application-form.component';
import { ReviewMapComponent } from '../components/review-map/review-map.component';
import { PdfPreviewModalComponent } from './components/pdf-preview-modal/pdf-preview-modal.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { PageBannerComponent } from './components/page-banner/page-banner.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { NotificationComponent } from './components/notification/notification.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoaderComponent,
    MapComponent,
    UnifiedApplicationFormComponent,
    ReviewMapComponent,
    PdfPreviewModalComponent,
    BackToTopComponent,
    PageBannerComponent,
    LoginFormComponent,
    RevealOnScrollDirective,
    NotificationComponent,
    AppHeaderComponent
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [
    FooterComponent,
    LoaderComponent,
    MapComponent,
    UnifiedApplicationFormComponent,
    ReviewMapComponent,
    PdfPreviewModalComponent,
    BackToTopComponent,
    PageBannerComponent,
    LoginFormComponent,
    RevealOnScrollDirective,
    NotificationComponent,
    AppHeaderComponent
  ]
})
export class SharedModule { }
