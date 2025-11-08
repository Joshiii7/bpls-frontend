import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [FooterComponent, LoaderComponent],
  imports: [CommonModule],
  exports: [FooterComponent, LoaderComponent]
})
export class SharedModule { }