import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    FooterComponent, 
    LoaderComponent, 
    MapComponent
  ],
  imports: [CommonModule],
  exports: [
    FooterComponent, 
    LoaderComponent, 
    MapComponent
  ]
})
export class SharedModule { }