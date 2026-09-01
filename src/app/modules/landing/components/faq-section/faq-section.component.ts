import { Component, Input } from '@angular/core';
import { FaqItem } from '../faq-accordion/faq-accordion.component';

// One place that owns the FAQ section's look (Tinuy-an Falls backdrop, dark
// overlay, light heading) so every page's FAQ uses the exact same treatment
// instead of each page rebuilding it. Pages just pass in their heading text
// and question list; app-faq-accordion still owns the actual accordion
// behavior underneath.
@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html'
})
export class FaqSectionComponent {
  @Input() eyebrow?: string;
  @Input() heading = '';
  @Input() accent?: string;
  @Input() description?: string;
  @Input() items: FaqItem[] = [];
}
