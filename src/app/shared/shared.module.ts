import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MapComponent } from './components/map/map.component';
import { UnifiedApplicationFormComponent } from './components/unified-application-form/unified-application-form.component';

@NgModule({
  declarations: [
    FooterComponent, 
    LoaderComponent, 
    MapComponent, 
    UnifiedApplicationFormComponent
  ],
  imports: [CommonModule],
  exports: [
    FooterComponent, 
    LoaderComponent, 
    MapComponent,
    UnifiedApplicationFormComponent,
  ]
})
export class SharedModule { }