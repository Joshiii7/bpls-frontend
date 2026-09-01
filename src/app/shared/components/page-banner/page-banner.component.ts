import { Component, Input } from '@angular/core';

// Full-width page title banner used at the top of every public inner page
// (Services, Requirements, Contact, Register): background image, dark
// overlay, centered heading. Matches the "page banner" pattern from the
// portfolio design reference. Uses the same background photo as the
// homepage hero so every public page shares one consistent look.
@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.css']
})
export class PageBannerComponent {
  @Input() title = '';
  @Input() description?: string;
}
